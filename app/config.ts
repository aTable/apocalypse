export interface Config {
  repositoriesPath: string;
}
const config: Config = {
  repositoriesPath: `${process.env.HOME}/code`
};

export default config;
