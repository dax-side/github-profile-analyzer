import { GitHubProfile, Repository, LanguageStat, SkillLevel, ProfileAnalysis } from './index';

export class ProfileAnalysisService {
  private static readonly POPULAR_LANGUAGES = [
    'JavaScript',
    'Python',
    'Java',
    'Go',
    'Rust',
    'TypeScript',
    'C++',
    'C#',
  ];
  private static readonly EXPERT_THRESHOLD = 80;
  private static readonly ADVANCED_THRESHOLD = 50;
  private static readonly INTERMEDIATE_THRESHOLD = 25;

  static calculatePrimaryLanguages(repositories: Repository[]): LanguageStat[] {
    const languageMap: { [key: string]: number } = {};

    repositories.slice(0, 5).forEach((repo) => {
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }
    });

    const total = Object.values(languageMap).reduce((a, b) => a + b, 0);
    return Object.entries(languageMap)
      .map(([lang, count]) => new LanguageStat(lang, Math.round((count / total) * 100)))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }

  static getMostActiveRepos(repositories: Repository[]): Repository[] {
    return repositories.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 3);
  }

  static getRecentActivity(repositories: Repository[]): {
    activeReposCount: number;
    lastActivity: Date | null;
  } {
    const activeRepos = repositories.filter((repo) => repo.isRecentlyActive());
    return {
      activeReposCount: activeRepos.length,
      lastActivity: activeRepos.length > 0 ? activeRepos[0].updatedAt : null,
    };
  }

  static isAccountActive(repositories: Repository[]): boolean {
    if (repositories.length === 0) return false;
    const lastUpdate = Math.max(...repositories.map((repo) => repo.updatedAt.getTime()));
    const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
    return lastUpdate > sixMonthsAgo;
  }

  static estimateSkillLevel(
    repositories: Repository[],
    languages: LanguageStat[],
    totalCommits: number,
    profile: GitHubProfile,
  ): SkillLevel {
    const repoCount = repositories.length;
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
    const accountAgeYears = profile.getAccountAgeInYears();
    const hasPopularLangs = languages.some((lang) =>
      this.POPULAR_LANGUAGES.includes(lang.language),
    );
    const languageDiversity = languages.length;

    let score = 0;

    // Repo count (up to 30 points)
    if (repoCount > 50) score += 30;
    else if (repoCount > 20) score += 20;
    else if (repoCount > 10) score += 15;
    else if (repoCount > 5) score += 10;
    else score += repoCount * 2;

    // Total commits (up to 25 points)
    if (totalCommits > 5000) score += 25;
    else if (totalCommits > 1000) score += 20;
    else if (totalCommits > 500) score += 15;
    else if (totalCommits > 100) score += 10;
    else score += Math.min(totalCommits / 10, 10);

    // Stars (up to 20 points)
    if (totalStars > 1000) score += 20;
    else if (totalStars > 500) score += 15;
    else if (totalStars > 100) score += 10;
    else score += Math.min(totalStars / 10, 10);

    // Account age (up to 15 points)
    if (accountAgeYears > 5) score += 15;
    else if (accountAgeYears > 3) score += 10;
    else if (accountAgeYears > 1) score += 5;
    else score += accountAgeYears * 5;

    // Language factors (up to 10 points)
    if (hasPopularLangs) score += 5;
    score += Math.min(languageDiversity, 5);

    if (score >= this.EXPERT_THRESHOLD) return new SkillLevel('Expert');
    if (score >= this.ADVANCED_THRESHOLD) return new SkillLevel('Advanced');
    if (score >= this.INTERMEDIATE_THRESHOLD) return new SkillLevel('Intermediate');
    return new SkillLevel('Beginner');
  }

  static analyzeProfile(
    profile: GitHubProfile,
    repositories: Repository[],
    totalCommits: number,
  ): ProfileAnalysis {
    const primaryLanguages = this.calculatePrimaryLanguages(repositories);
    const mostActiveRepos = this.getMostActiveRepos(repositories);
    const recentActivity = this.getRecentActivity(repositories);
    const isActive = this.isAccountActive(repositories);
    const skillLevel = this.estimateSkillLevel(
      repositories,
      primaryLanguages,
      totalCommits,
      profile,
    );

    return ProfileAnalysis.create(
      profile,
      repositories,
      primaryLanguages,
      totalCommits,
      mostActiveRepos,
      recentActivity,
      isActive,
      skillLevel,
    );
  }
}
