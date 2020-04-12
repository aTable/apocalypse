import { exec } from 'child_process';
import { join } from 'path';
import { mkdir } from 'fs';
import config from '../config';

export function splitOnNewLine(text: string): string[] {
  return text.split('\n');
}

export function getListData(text: string): string[] {
  return splitOnNewLine(text).filter(x => x);
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
    exec(`cd ${path} && ${command}`, (err, stdout, stderr) => {
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

export function generateTempFilePath(): string {
  return join(config.tempDirectoryPath, Math.random().toString());
}
