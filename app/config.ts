export interface Config {
  repositoriesPath: string;
  gitinspectorPath: string;
  tempDirectoryPath: string;
}
const config: Config = {
  repositoriesPath: `${process.env.HOME}/code`,
  gitinspectorPath: `/home/imin/code/apocalypse/node_modules/gitinspector/gitinspector.py`,
  tempDirectoryPath: `/tmp/apocalypse`
};

export default config;
