import { exec } from 'child_process';
import { join } from 'path';
import { RepositoryLocation } from '../types/repositories';
import AppContext from '../stores/AppContext';

export function splitOnNewLine(text: string): string[] {
  return text.split('\n');
}

export function getListData(text: string): string[] {
  return splitOnNewLine(text).filter((x) => x);
}

export function takeFirstStdOutputResponse(text: string): string {
  return splitOnNewLine(text)[0];
}

export function executeCommand<T>(
  path: string,
  command: string,
  process: (res: string) => T
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const cmd = `cd ${path} && ${command}`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(err);
      if (stderr) reject(stderr);
      const processed = process(stdout);
      resolve(processed);
    });
  });
}

export function executeCommandRaw<T>(
  command: string,
  process: (res: string) => T
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) reject(err);
      if (stderr) reject(stderr);
      const processed = process(stdout);
      resolve(processed);
    });
  });
}
export function executePythonCommand<T>(
  command: string,
  process: (res: string) => T
): Promise<T> {
  return executeCommandRaw(`python3 ${command}`, process);
}

export function buildRepositoryLocationFromName(
  repositoriesPath: string,
  repositoryName: string
): RepositoryLocation {
  return {
    path: join(repositoriesPath, repositoryName),
    name: repositoryName,
  };
}

export function buildRepositoryLocationFromPath(
  repositoriesPath: string,
  repositoryPath: string
): RepositoryLocation {
  const fragments = repositoryPath.split('/');
  return {
    path: join(repositoriesPath, repositoryPath),
    name: fragments[fragments.length - 1],
  };
}
