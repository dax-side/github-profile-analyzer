export interface GitHubProfile {
  username: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
}

export interface RepoAnalysis {
  repoName: string;
  stars: number;
  forks: number;
  language: string;
}

export interface LanguageStats {
  language: string;
  percentage: number;
}

export interface LanguageStat {
  language: string;
  percentage: number;
}

export interface ActiveRepo {
  name: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}

export interface RecentActivity {
  activeReposCount: number;
  lastActivity: string | null;
}

export interface ProfileAnalysis {
  username: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  primaryLanguages: LanguageStat[];
  totalCommits: number;
  mostActiveRepos: ActiveRepo[];
  recentActivity: RecentActivity;
  isActive: boolean;
  skillLevel: string;
}
