import React, { useState, useEffect } from 'react';
import { readdir } from 'fs';
import { join } from 'path';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import config from '../config';
import RepositoryDetails from './RepositoryDetails';

const Home = () => {
  const [repositories, setRepositories] = useState<string[]>([]);
  const [selectedRepositoryPath, setSelectedRepositoryPath] = useState<
    string
  >();

  useEffect(() => {
    readdir(config.repositoriesPath, (err, paths) => {
      if (err) throw err;
      setRepositories(paths.map(x => join(config.repositoriesPath, x)));
    });
  }, [config]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          <h2>Repositories</h2>
          {repositories.map(x => (
            <div
              key={x}
              onClick={() => setSelectedRepositoryPath(x)}
              onKeyPress={undefined}
              role="button"
              tabIndex={-1}
              style={{ cursor: 'pointer' }}
            >
              <p>
                <i className="fa fa-folder" style={{ marginRight: '5px' }} />
                <small>{x}</small>
              </p>
            </div>
          ))}
        </div>
        <div className="col-9">
          <RepositoryDetails path={selectedRepositoryPath} />
        </div>
      </div>
    </div>
  );
};

export default Home;
