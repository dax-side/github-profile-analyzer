export class LanguageStat {
  constructor(
    public readonly language: string,
    public readonly percentage: number,
  ) {}

  static fromData(data: { language: string; percentage: number }): LanguageStat {
    return new LanguageStat(data.language, data.percentage);
  }
}

export class SkillLevel {
  constructor(public readonly level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') {}

  static fromString(level: string): SkillLevel {
    const validLevels: Array<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'> = [
      'Beginner',
      'Intermediate',
      'Advanced',
      'Expert',
    ];
    if (!validLevels.includes(level as any)) {
      throw new Error(`Invalid skill level: ${level}`);
    }
    return new SkillLevel(level as any);
  }
}

export class Repository {
  constructor(
    public readonly name: string,
    public readonly stars: number,
    public readonly forks: number,
    public readonly language: string | null,
    public readonly updatedAt: Date,
  ) {}

  static fromApiData(data: any): Repository {
    return new Repository(
      data.name,
      data.stargazers_count,
      data.forks_count,
      data.language,
      new Date(data.updated_at),
    );
  }

  isRecentlyActive(): boolean {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return this.updatedAt > thirtyDaysAgo;
  }
}

export class GitHubProfile {
  constructor(
    public readonly username: string,
    public readonly avatarUrl: string,
    public readonly bio: string | null,
    public readonly publicRepos: number,
    public readonly followers: number,
    public readonly following: number,
    public readonly createdAt: Date,
  ) {}

  static fromApiData(data: any): GitHubProfile {
    return new GitHubProfile(
      data.login,
      data.avatar_url,
      data.bio,
      data.public_repos,
      data.followers,
      data.following,
      new Date(data.created_at),
    );
  }

  getAccountAgeInYears(): number {
    return (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }
}

export class ProfileAnalysis {
  constructor(
    public readonly profile: GitHubProfile,
    public readonly repositories: Repository[],
    public readonly primaryLanguages: LanguageStat[],
    public readonly totalCommits: number,
    public readonly mostActiveRepos: Repository[],
    public readonly recentActivity: { activeReposCount: number; lastActivity: Date | null },
    public readonly isActive: boolean,
    public readonly skillLevel: SkillLevel,
  ) {}

  static create(
    profile: GitHubProfile,
    repositories: Repository[],
    primaryLanguages: LanguageStat[],
    totalCommits: number,
    mostActiveRepos: Repository[],
    recentActivity: { activeReposCount: number; lastActivity: Date | null },
    isActive: boolean,
    skillLevel: SkillLevel,
  ): ProfileAnalysis {
    return new ProfileAnalysis(
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
