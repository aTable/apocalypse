import React, { useState, useEffect } from 'react';
import { readdir } from 'fs';
import { useHistory } from 'react-router-dom';
import config from '../config';
import { RepositoryLocation } from '../types/repositories';
import { buildRepositoryLocationFromPath } from '../utils/utils';

const Repositories = () => {
  const [repositories, setRepositories] = useState<RepositoryLocation[]>([]);
  const history = useHistory();

  useEffect(() => {
    readdir(config.repositoriesPath, (err, paths) => {
      if (err) throw err;
      const repos = paths.map(buildRepositoryLocationFromPath);
      setRepositories(repos);
    });
  }, [config]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          <h2>Repositories</h2>
          {repositories.map(x => (
            <div
              key={x.path}
              onClick={() => history.push(`/repositories/${x.name}`)}
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
