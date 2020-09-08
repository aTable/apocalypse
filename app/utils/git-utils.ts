import { RepositoryLocation } from '../types/repositories';
import { GitStatusFile, XY, FileDiff, FileDiffHunk } from '../types/git';
import { executeCommand, executeCommandRaw } from './utils';

export async function getRemoteBranches2(
  repo: RepositoryLocation,
  remote: string
): Promise<string> {
  return new Promise((resolve) => {
    executeCommand(repo.path, `git ls-remote --heads ${remote}`, (res) => {
      resolve(res);
    });
  });
}

export async function getRemoteBranches(
  repo: RepositoryLocation
): Promise<string> {
  return new Promise((resolve) => {
    executeCommand(repo.path, `git branch --remotes`, (res) => {
      resolve(res);
    });
  });
}

export async function getRemotes(repo: RepositoryLocation): Promise<string> {
  return new Promise((resolve) => {
    executeCommand(repo.path, `git remote`, (res) => {
      resolve(res);
    });
  });
}

export async function getBranches(repo: RepositoryLocation): Promise<string> {
  return new Promise((resolve) => {
    executeCommand(repo.path, `git branch`, (res) => {
      resolve(res);
    });
  });
}

export async function getUnpushedCommits(
  repo: RepositoryLocation
): Promise<string> {
  return new Promise((resolve) => {
    executeCommand(repo.path, `git log --branches --not --remotes`, (res) => {
      resolve(res);
    });
  });
}

export async function gitShortlogBasic(
  repo: RepositoryLocation
): Promise<string> {
  return new Promise((resolve) => {
    executeCommand(
      repo.path,
      `git shortlog  --numbered --email --summary`,
      (res) => {
        resolve(res);
      }
    );
  });
}

export async function gitCommit(
  repo: RepositoryLocation,
  message: string,
  isAmendCommit: boolean,
  isVerifyCommit: boolean
): Promise<string> {
  return new Promise((resolve) => {
    executeCommand(
      repo.path,
      `git commit -m "${message}" ${isAmendCommit ? '--amend ' : ''} ${
        isVerifyCommit ? '' : '--no-verify'
      }`,
      (res) => {
        resolve(res);
      }
    );
  });
}

export async function getRepositoryHistory(
  repo: RepositoryLocation
): Promise<string[]> {
  return new Promise((resolve) => {
    executeCommand(repo.path, 'git log --graph --oneline', (res) => {
      const mapped = res.split('\n').filter((x) => x);
      resolve(mapped);
    });
  });
}

export async function getGitStatus(
  repo: RepositoryLocation
): Promise<GitStatusFile[]> {
  return new Promise((resolve) => {
    executeCommand(repo.path, 'git status -s', (res) => {
      const mapped = res
        .split('\n')
        .filter((x) => x)
        .map<GitStatusFile>((change) => {
          const gitStatus: GitStatusFile = {
            xy: [
              XY[change[0] as keyof typeof XY],
              XY[change[1] as keyof typeof XY],
            ],
            path: change.substring(2),
          };
          return gitStatus;
        });
      resolve(mapped);
    });
  });
}

export async function getFileDiff(
  path: string,
  linesForContext: number,
  isStaged: boolean
): Promise<FileDiff> {
  return new Promise((resolve) => {
    executeCommandRaw(
      `git diff --unified=${linesForContext} ${
        isStaged ? '--cached' : ''
      } ${path}`,
      (res) => {
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
              hunk: '',
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
          hunks,
        };
        return resolve(result);
      }
    );
  });
}

export async function stageFile(path: string): Promise<string> {
  return new Promise((resolve) => {
    executeCommandRaw(`git add ${path}`, (res) => {
      resolve(res);
    });
  });
}

export async function discardFile(path: string): Promise<string> {
  return new Promise((resolve) => {
    executeCommandRaw(`git restore ${path}`, (res) => {
      resolve(res);
    });
  });
}

export async function stageAllChanges(): Promise<string> {
  return new Promise((resolve) => {
    executeCommandRaw(`git add -A`, (res) => {
      resolve(res);
    });
  });
}

export function isFileStaged(status: GitStatusFile): boolean {
  return status.xy[0] !== XY[' '] && status.xy[0] !== undefined;
}

export function isFileUnstaged(status: GitStatusFile): boolean {
  return status.xy[1] !== XY[' '];
}

export default {};
