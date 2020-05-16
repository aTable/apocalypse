import React, { useEffect, useContext } from 'react';
import TerminalContext from '../stores/TerminalContext';
import AppContext from '../stores/AppContext';
import RepositoryList from '../components/RepositoryList';

const Repositories = () => {
  const { dispatch } = useContext(TerminalContext);
  const appContext = useContext(AppContext);

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_WORKING_DIRECTORY',
      payload: appContext.state.repositoriesPath,
    });
    dispatch({
      type: 'EXECUTE',
      payload: `cd ${appContext.state.repositoriesPath}`,
    });
  }, [appContext.state]);

  return (
    <div className="container-fluid" style={{ height: 'inherit' }}>
      <div className="row" style={{ height: 'inherit' }}>
        <div
          className="col-3"
          style={{
            height: 'inherit',
            overflowY: 'scroll',
            paddingTop: '0.5rem',
          }}
        >
          <RepositoryList />
        </div>
        <div className="col-9">
          <p>...</p>
        </div>
      </div>
    </div>
  );
};

export default Repositories;
