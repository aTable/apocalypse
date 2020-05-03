import { RepositoryLocation } from '../types/repositories';
import { GitStatusFiles, XY } from '../types/git';
import { executeCommand, executeCommandRaw } from './utils';

export async function getGitStatus(
  repo: RepositoryLocation
): Promise<GitStatusFiles[]> {
  return new Promise(resolve => {
    executeCommand(repo.path, 'git status -s', res => {
      // "?? path/to/filename.tsx"
      const mapped = res
        .split('\n')
        .filter(x => x)
        .map<GitStatusFiles>(change => {
          const gitStatus: GitStatusFiles = {
            xy: [
              XY[change[0] as keyof typeof XY],
              XY[change[1] as keyof typeof XY]
            ],
            path: change.substring(2)
          };
          return gitStatus;
        });
      resolve(mapped);
    });
  });
}

export async function getFileDiff(path: string): Promise<string> {
  return new Promise(resolve => {
    executeCommandRaw(`git diff --cached ${path}`, res => {
      resolve(res);
    });
  });
}

export async function stageFile(path: string): Promise<string> {
  return new Promise(resolve => {
    executeCommandRaw(`git add ${path}`, res => {
      resolve(res);
    });
  });
}

export default {};
