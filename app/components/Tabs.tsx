import React, { FC, useContext, SyntheticEvent } from 'react';
import AppContext from '../stores/AppContext';
import { useHistory } from 'react-router';
import { RepositoryLocation } from '../types/repositories';
import styles from '../css/main.scss';

export interface TabsProps {}
const Tabs: FC<TabsProps> = () => {
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();

  const goToRepo = (x: RepositoryLocation) => {
    history.push(`/repositories/${x.name}`);
    dispatch({ type: 'SET_CURRENT_TAB', payload: x });
  };

  const closeRepo = (x: RepositoryLocation, e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // last tab closed
    if (state.openTabs.length === 1) {
      history.replace(`/repositories`);
      dispatch({ type: 'CLOSE_TAB', payload: x });
      return;
    } else if (history.location.pathname === `/repositories/${x.name}`) {
      // current tab closed
      const nextTab = state.openTabs.find((t) => t.path !== x.path);
      if (!nextTab) history.replace(`/repositories`);
      else history.replace(`/repositories/${nextTab.name}`);

      dispatch({ type: 'CLOSE_TAB', payload: x });
      dispatch({ type: 'SET_CURRENT_TAB', payload: x });
    }
  };

  return (
    <div id="tabs" className={styles.tabs}>
      {state.openTabs.length === 0 && <span>Select a repository ...</span>}
      {state.openTabs.map((x) => (
        <div
          key={x.path}
          className={state.currentTab?.path === x.path ? 'active' : ''}
          data-state={state.currentTab?.path === x.path ? 'active' : ''}
          onClick={goToRepo.bind(null, x)}
        >
          <span>{x.name} </span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={(e) => closeRepo(x, e)}
          >
            <i className="fa fa-times-circle" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
