import React, {
  createContext,
  useReducer,
  FC,
  Dispatch,
  useEffect,
  useRef,
} from 'react';
import { readFile, writeFile, mkdir } from 'fs';
import { RepositoryLocation } from '../types/repositories';
import { useHistory } from 'react-router';

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export interface AppContext {
  //[key: string]: string | RepositoryLocation[] | number;
  rootPath: string;
  configPath: string;
  repositoriesPath: string;
  gitInspectorPath: string;
  tempDirectoryPath: string;
  serverUri: string;
  linesForContext: number;
  openTabs: RepositoryLocation[];
}

export interface AppActions {
  payload: any;
  type: 'OPEN_TAB' | 'CLOSE_TAB' | 'LOAD_CONFIG';
}

export const reducer = (state: AppContext, action: AppActions): AppContext => {
  switch (action.type) {
    case 'OPEN_TAB': {
      const isMatch = state.openTabs.some(
        (x) => x.path === action.payload.path
      );
      if (isMatch) return state;
      return {
        ...state,
        openTabs: [...state.openTabs, action.payload],
      };
    }
    case 'CLOSE_TAB': {
      return {
        ...state,
        // @ts-ignore
        openTabs: state.openTabs.filter((x) => x.path !== action.payload.path),
      };
    }
    case 'LOAD_CONFIG': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export interface AppContextProps {
  state: AppContext;
  dispatch: Dispatch<AppActions>;
}

const defaults: AppContext = {
  rootPath: `${process.env.HOME}/.apocalypse`,
  configPath: `${process.env.HOME}/.apocalypse/config.json`,
  repositoriesPath: `${process.env.HOME}/repos`,
  gitInspectorPath: `${process.env.HOME}/repos/apocalypse/node_modules/gitinspector/gitinspector.py`,
  tempDirectoryPath: `/tmp/apocalypse`,
  serverUri: 'https://localhost',
  linesForContext: 5,
  openTabs: [],
};

function initializer(init: AppContext): AppContext {
  //
  return init;
}

export const AppContextProvider: FC<any> = (props) => {
  const [state, dispatch] = useReducer(reducer, defaults, initializer);
  const isFirstRender = useRef(true);

  useEffect(() => {
    createRootFolderIfNotExists()
      .then(createSettingsIfNotExists)
      .then(getSettings)
      .then((ctx) => dispatch({ type: 'LOAD_CONFIG', payload: ctx }));
  }, []);

  useEffect(() => {
    // first render caused by defaults getting loaded up. Must be a better way to handle saving after the first init
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // TODO: maybe diff previous and current state to determine if save gets called?
    saveConfig(state);
  }, [state, isFirstRender]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

function createRootFolderIfNotExists(): Promise<undefined> {
  return new Promise((resolve) => {
    mkdir(defaults.rootPath, () => {
      resolve();
    });
  });
}

function createSettingsIfNotExists(): Promise<undefined> {
  return new Promise((resolve, reject) => {
    readFile(defaults.configPath, { encoding: 'UTF-8' }, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          writeFile(defaults.configPath, JSON.stringify(defaults), () => {
            resolve();
          });
        }
        reject(err);
      }
      resolve();
    });
  });
}

function getSettings(): Promise<AppContext> {
  return new Promise((resolve, reject) => {
    readFile(defaults.configPath, { encoding: 'UTF-8' }, (err, data) => {
      if (err) reject(err);
      const deserialized: AppContext = JSON.parse(data);
      resolve(deserialized);
    });
  });
}

export function saveConfig(ctx: AppContext): Promise<AppContext> {
  return new Promise((resolve, reject) => {
    writeFile(ctx.configPath, JSON.stringify(ctx), (err) => {
      if (err) reject(err);
      resolve(ctx);
    });
  });
}

export default AppContext;
