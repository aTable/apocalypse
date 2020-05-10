import { RepositoryLocation } from '../types/repositories';
import { GitStatusFiles, XY, FileDiff, FileDiffHunk } from '../types/git';
import { executeCommand, executeCommandRaw } from './utils';

export async function gitCommit(
  repo: RepositoryLocation,
  message: string,
  isVerifyCommit: boolean
): Promise<string> {
  return new Promise(resolve => {
    executeCommand(
      repo.path,
      `git commit -m "${message}" ${isVerifyCommit ? '' : '--no-verify'}`,
      res => {
        resolve(res);
      }
    );
  });
}

export async function getRepositoryHistory(
  repo: RepositoryLocation
): Promise<string[]> {
  return new Promise(resolve => {
    executeCommand(repo.path, 'git log --oneline', res => {
      const mapped = res.split('\n').filter(x => x);
      resolve(mapped);
    });
  });
}

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

export async function getFileDiff(
  path: string,
  linesForContext: number
): Promise<FileDiff> {
  return new Promise(resolve => {
    executeCommandRaw(
      `git diff HEAD --unified=${linesForContext} ${path}`,
      res => {
        const metadataStartText = '@@ -';
        const metadataEndText = ' @@';
        const [command, mode, a, b, ...rest] = res.split('\n');
        const hunks: FileDiffHunk[] = [];
        for (let i = 0; i < rest.length; i++) {
          // extract metadata and line in hunk
          if (rest[i].startsWith(metadataStartText)) {
            const metadataLastIndex = rest[i].lastIndexOf(metadataEndText);
            hunks.push({
              metadata: rest[i].substring(
                0,
                metadataLastIndex + metadataEndText.length
              ),
              hunk: ''
            });
            hunks[hunks.length - 1].hunk = `${rest[i].substring(
              metadataLastIndex + metadataEndText.length
            )}\n`;
            continue;
          }
          // extract hunk (no metadata)
          hunks[hunks.length - 1].hunk += `${rest[i]}\n`;
        }

        const result: FileDiff = {
          command,
          mode,
          a,
          b,
          hunks
        };
        return resolve(result);
      }
    );
  });
}

export async function stageFile(path: string): Promise<string> {
  return new Promise(resolve => {
    executeCommandRaw(`git add ${path}`, res => {
      resolve(res);
    });
  });
}

export async function stageAllChanges(): Promise<string> {
  return new Promise(resolve => {
    executeCommandRaw(`git add -A`, res => {
      resolve(res);
    });
  });
}
export default {};
