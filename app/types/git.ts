export interface GitStatusFiles {
  path: string;
  xy: [XY, XY];
}

export enum XY {
  // '' = 'unknown',
  ' ' = 'unmodified',
  M = 'modified',
  A = 'added',
  D = 'deleted',
  R = 'renamed',
  C = 'copied',
  U = 'updated but unmerged'
}

export interface FileDiff {
  command: string;
  mode: string;
  a: string;
  b: string;
  hunks: FileDiffHunk[];
}

export interface FileDiffHunk {
  metadata: string;
  hunk: string;
}
