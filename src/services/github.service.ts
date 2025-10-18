import axios, { AxiosResponse } from 'axios';
import winston from 'winston';
import { GitHubProfile, Repository } from '../domain/index';
import { ProfileAnalysisService } from '../domain/profile-analysis.service';

export class GitHubService {
  private baseUrl: string = 'https://api.github.com';

  constructor(
    private username: string,
    private token?: string,
    private logger?: winston.Logger,
  ) {
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `token ${this.token}`;
    }
    this.logger = logger || winston.createLogger({ silent: true }); // Default silent logger
  }

  async fetchUserProfile(): Promise<GitHubProfile> {
    this.logger?.info(`Fetching profile for ${this.username}`);
    const response: AxiosResponse = await axios.get(`${this.baseUrl}/users/${this.username}`);
    return GitHubProfile.fromApiData(response.data);
  }

  async fetchUserRepos(): Promise<Repository[]> {
    this.logger?.info(`Fetching repositories for ${this.username}`);
    const response: AxiosResponse = await axios.get(`${this.baseUrl}/users/${this.username}/repos`);
    return response.data.map((repo: any) => Repository.fromApiData(repo));
  }

  async fetchRepoCommits(repoName: string): Promise<any[]> {
    const response: AxiosResponse = await axios.get(
      `${this.baseUrl}/repos/${this.username}/${repoName}/commits`,
      {
        params: { per_page: 100 },
      },
    );
    return response.data;
  }

  async analyzeProfile(): Promise<any> {
    const profile = await this.fetchUserProfile();
    const repos = await this.fetchUserRepos();
    const totalCommits = await this.getTotalCommits(repos);

    const analysis = ProfileAnalysisService.analyzeProfile(profile, repos, totalCommits);

    this.logger?.info(`Analysis completed for ${this.username}`);

    return {
      username: analysis.profile.username,
      avatarUrl: analysis.profile.avatarUrl,
      bio: analysis.profile.bio,
      publicRepos: analysis.profile.publicRepos,
      followers: analysis.profile.followers,
      following: analysis.profile.following,
      primaryLanguages: analysis.primaryLanguages.map((lang) => ({
        language: lang.language,
        percentage: lang.percentage,
      })),
      totalCommits: analysis.totalCommits,
      mostActiveRepos: analysis.mostActiveRepos.map((repo) => ({
        name: repo.name,
        stars: repo.stars,
        forks: repo.forks,
        lastUpdated: repo.updatedAt.toISOString(),
      })),
      recentActivity: {
        activeReposCount: analysis.recentActivity.activeReposCount,
        lastActivity: analysis.recentActivity.lastActivity?.toISOString() || null,
      },
      isActive: analysis.isActive,
      skillLevel: analysis.skillLevel.level,
    };
  }

  async getTotalCommits(repos: Repository[]): Promise<number> {
    const topRepos = repos.slice(0, 3);
    const commitPromises = topRepos.map((repo) => this.fetchRepoCommits(repo.name).catch(() => []));
    const commitsArray = await Promise.all(commitPromises);
    return commitsArray.reduce((total, commits) => total + commits.length, 0);
  }
}
