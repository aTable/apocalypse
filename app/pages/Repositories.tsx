import React, { useState, useEffect, useContext } from 'react';
import { readdir } from 'fs';
import { useHistory } from 'react-router-dom';
import { RepositoryLocation } from '../types/repositories';
import { buildRepositoryLocationFromPath } from '../utils/utils';
import TerminalContext from '../stores/TerminalContext';
import AppContext from '../stores/AppContext';

const Repositories = () => {
  const [repositories, setRepositories] = useState<RepositoryLocation[]>([]);
  const { dispatch } = useContext(TerminalContext);
  const appContext = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_WORKING_DIRECTORY',
      payload: appContext.state.repositoriesPath,
    });
    dispatch({
      type: 'EXECUTE',
      payload: `cd ${appContext.state.repositoriesPath}`,
    });
    readdir(appContext.state.repositoriesPath, (err, paths) => {
      if (err) throw err;
      const repos = paths.map((x) =>
        buildRepositoryLocationFromPath(appContext.state.repositoriesPath, x)
      );
      setRepositories(repos);
    });
  }, [appContext.state]);

  const repositoryClicked = (x: RepositoryLocation) => {
    appContext.dispatch({ type: 'OPEN_TAB', payload: x });
    history.push(`/repositories/${x.name}`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          <h2>Repositories</h2>
          {repositories.map((x) => (
            <div
              key={x.path}
              onClick={() => repositoryClicked(x)}
              onKeyPress={undefined}
              role="button"
              tabIndex={-1}
              style={{ cursor: 'pointer' }}
            >
              <p>
                <i className="fa fa-folder" style={{ marginRight: '5px' }} />
                <small>{x.name}</small>
              </p>
            </div>
          ))}
        </div>
        <div className="col-9">
          <p>Select a repository ...</p>
        </div>
      </div>
    </div>
  );
};

export default Repositories;
