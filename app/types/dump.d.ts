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
}
