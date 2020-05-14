import React, {
  createContext,
  useReducer,
  FC,
  Dispatch,
  useEffect,
  useContext,
} from 'react';
import AppContext from './AppContext';

export const TerminalContext = createContext<TerminalContextProps>(
  {} as TerminalContextProps
);

export interface TerminalContext {
  cwd: string;
  history: string[];
}

export interface TerminalActions {
  payload: string;
  type: 'EXECUTE' | 'LOAD_PREVIOUS_SESSION' | 'SET_CURRENT_WORKING_DIRECTORY';
}

export const reducer = (
  state: TerminalContext,
  action: TerminalActions
): TerminalContext => {
  switch (action.type) {
    case 'SET_CURRENT_WORKING_DIRECTORY':
      return {
        ...state,
        cwd: action.payload,
      };
    case 'EXECUTE':
      return {
        ...state,
        history: [...state.history, action.payload],
      };
    case 'LOAD_PREVIOUS_SESSION':
      return state;
    default:
      return state;
  }
};

export interface TerminalContextProps {
  state: TerminalContext;
  dispatch: Dispatch<TerminalActions>;
}
export const TerminalContextProvider: FC<any> = (props) => {
  const appContext = useContext(AppContext);
  const [state, dispatch] = useReducer(
    reducer,
    { cwd: appContext.state.repositoriesPath, history: [] },
    (init) => init
  );

  useEffect(() => {
    // TODO: load previous session?
    // if (savedCommands) {
    //   dispatch({ type: 'LOAD_PREVIOUS_SESSION', payload: savedCommands });
    // }
  }, []);

  return (
    <TerminalContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TerminalContext.Provider>
  );
};

export default TerminalContext;
