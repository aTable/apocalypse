import React, { useState, useEffect, useContext } from 'react';
import { readdir } from 'fs';
import { useHistory } from 'react-router-dom';
import { RepositoryLocation } from '../types/repositories';
import { buildRepositoryLocationFromPath } from '../utils/utils';
import AppContext from '../stores/AppContext';

const RepositoryList = () => {
  const [repositories, setRepositories] = useState<RepositoryLocation[]>([]);
  const appContext = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
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
    appContext.dispatch({ type: 'SET_CURRENT_TAB', payload: x });
    history.push(`/repositories/${x.name}`);
  };

  return (
    <>
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
    </>
  );
};

export default RepositoryList;
