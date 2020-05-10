import React, { useState, useEffect, useContext } from 'react';
import { readdir } from 'fs';
import { useHistory } from 'react-router-dom';
import config from '../config';
import { RepositoryLocation } from '../types/repositories';
import { buildRepositoryLocationFromPath } from '../utils/utils';
import TerminalContext from '../stores/TerminalContext';

const Repositories = () => {
  const [repositories, setRepositories] = useState<RepositoryLocation[]>([]);
  const { dispatch } = useContext(TerminalContext);
  const history = useHistory();

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_WORKING_DIRECTORY',
      payload: config.repositoriesPath
    });
    dispatch({
      type: 'EXECUTE',
      payload: `cd ${config.repositoriesPath}`
    });
    readdir(config.repositoriesPath, (err, paths) => {
      if (err) throw err;
      const repos = paths.map(buildRepositoryLocationFromPath);
      setRepositories(repos);
    });
  }, [config]);

  const goToRepository = (x: RepositoryLocation) => {
    history.push(`/repositories/${x.name}`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          <h2>Repositories</h2>
          {repositories.map(x => (
            <div
              key={x.path}
              onClick={() => goToRepository(x)}
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
