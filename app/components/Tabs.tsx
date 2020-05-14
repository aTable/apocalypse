import React, { FC, useContext, SyntheticEvent } from 'react';
import AppContext from '../stores/AppContext';
import { useHistory } from 'react-router';
import { RepositoryLocation } from '../types/repositories';

export interface TabsProps {}
const Tabs: FC<TabsProps> = () => {
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();
  const goToRepo = (x: RepositoryLocation) =>
    history.push(`/repositories/${x.name}`);
  const closeRepo = (x: RepositoryLocation, e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // if current repo, redirect
    if (history.location.pathname === `/repositories/${x.name}`)
      history.replace(`/repositories`);
    dispatch({ type: 'CLOSE_TAB', payload: x });
  };
  return (
    <div id="tabs" className="tabs container-fluid">
      <div className="row">
        {state.openTabs.map((x) => (
          <div
            key={x.path}
            className="col"
            onClick={goToRepo.bind(null, x)}
            style={{ cursor: 'pointer' }}
          >
            <span>{x.name} </span>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={(e) => closeRepo(x, e)}
            >
              <i className="fa fa-times-circle" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
