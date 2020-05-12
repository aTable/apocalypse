export interface RepositoryLocation {
  path: string;
  name: string;
}
export interface Repository {
  name: string;
  path: string;
  commitCount: number;
  firstCommit: Date;
  lastCommit: Date;
  branches: string[];
  commits: string[];
  tags: string[];
  remotes: string[];
  readme: string;
  contributions: RepositoryContribution[];
}

export interface RepositoryContribution {
  count: number;
  author: string;
  email: string;
}
