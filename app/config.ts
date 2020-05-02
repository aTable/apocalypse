import { readFile, writeFile, mkdir } from 'fs';

export interface Config {
  [key: string]: string;
  rootPath: string;
  configPath: string;
  repositoriesPath: string;
  gitinspectorPath: string;
  tempDirectoryPath: string;
  serverUri: string;
}

export const defaults: Config = {
  rootPath: `${process.env.HOME}/.apocalypse`,
  configPath: `${process.env.HOME}/.apocalypse/config.json`,
  repositoriesPath: `${process.env.HOME}/repos`,
  gitinspectorPath: `${process.env.HOME}/apocalypse/node_modules/gitinspector/gitinspector.py`,
  tempDirectoryPath: `/tmp/apocalypse`,
  serverUri: 'https://localhost'
};

// NOTE: manipulate and mutate for some reason i want this available statically instead of loaded via context
// $5 there be bugs in this decision
export const config: Config = defaults;

function createRootFolderIfNotExists(): Promise<boolean> {
  return new Promise(resolve => {
    mkdir(defaults.rootPath, () => {
      resolve(true);
    });
  });
}

function createSettingsIfNotExists(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    readFile(defaults.configPath, { encoding: 'UTF-8' }, err => {
      if (err) {
        if (err.code === 'ENOENT') {
          writeFile(defaults.configPath, JSON.stringify(defaults), () => {
            resolve(true);
          });
        }
        reject(err);
      }
      resolve(true);
    });
  });
}

function getSettings(): Promise<Config> {
  return new Promise((resolve, reject) => {
    readFile(defaults.configPath, { encoding: 'UTF-8' }, (err, data) => {
      if (err) reject(err);
      const deserialized: Config = JSON.parse(data);
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, val] of Object.entries(deserialized)) {
        config[key] = val;
      }
      resolve(config);
    });
  });
}

export function loadConfig(): Promise<Config> {
  return createRootFolderIfNotExists()
    .then(createSettingsIfNotExists)
    .then(getSettings);
}

export default config;
