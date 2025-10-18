import { GitHubService } from '../src/services/github.service';
import { GitHubProfile, Repository, LanguageStat } from '../src/domain/index';
import { ProfileAnalysisService } from '../src/domain/profile-analysis.service';

describe('GitHubService', () => {
  describe('estimateSkillLevel', () => {
    it('should return Beginner for low activity', () => {
      const profile = GitHubProfile.fromApiData({
        login: 'test',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        public_repos: 1,
        followers: 0,
        following: 0,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      });
      const repos = [Repository.fromApiData({
        name: 'test-repo',
        stargazers_count: 0,
        forks_count: 0,
        updated_at: new Date().toISOString(),
        language: 'JavaScript',
      })];
      const languages = [new LanguageStat('JavaScript', 100)];
      const totalCommits = 10;

      const analysis = ProfileAnalysisService.analyzeProfile(profile, repos, totalCommits);
      expect(analysis.skillLevel.level).toBe('Beginner');
    });

    it('should return Expert for high activity', () => {
      const profile = GitHubProfile.fromApiData({
        login: 'test',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        public_repos: 60,
        followers: 100,
        following: 50,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 6).toISOString(), // 6 years ago
      });
      const repos = Array(60).fill(null).map((_, i) => Repository.fromApiData({
        name: `test-repo-${i}`,
        stargazers_count: 100,
        forks_count: 10,
        updated_at: new Date().toISOString(),
        language: 'JavaScript',
      }));
      const totalCommits = 6000;

      const analysis = ProfileAnalysisService.analyzeProfile(profile, repos, totalCommits);
      expect(analysis.skillLevel.level).toBe('Expert');
    });

    it('should return Intermediate for moderate activity', () => {
      const profile = GitHubProfile.fromApiData({
        login: 'test',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        public_repos: 10,
        followers: 10,
        following: 5,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2).toISOString(), // 2 years ago
      });
      const repos = Array(10).fill(null).map((_, i) => Repository.fromApiData({
        name: `test-repo-${i}`,
        stargazers_count: 5,
        forks_count: 2,
        updated_at: new Date().toISOString(),
        language: 'Python',
      }));
      const totalCommits = 200;

      const analysis = ProfileAnalysisService.analyzeProfile(profile, repos, totalCommits);
      expect(analysis.skillLevel.level).toBe('Intermediate');
    });
  });
});