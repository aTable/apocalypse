import React, { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { buildRepositoryLocationFromName } from '../utils/utils';
import { GitStatusFiles, XY } from '../types/git';
import {
  getGitStatus,
  getFileDiff,
  stageFile,
  stageAllChanges
} from '../utils/git-utils';
import { RepositoryLocation } from '../types/repositories';

export interface RepositoryChangesPageProps {
  id: string;
}

const RepositoryChangesPage = (
  props: RouteComponentProps<RepositoryChangesPageProps>
) => {
  const [gitStatus, setGitStatus] = useState<GitStatusFiles[]>();
  const [selectedFilePath, setSelectedFilePath] = useState<string>();
  const [diff, setDiff] = useState<string>();

  const repositoryLocation = useMemo<RepositoryLocation>(
    () => buildRepositoryLocationFromName(props.match.params.id),
    [props.match.params.id]
  );

  useEffect(() => {
    if (!props.match.params.id) return;
    getGitStatus(repositoryLocation)
      .then(setGitStatus)
      .catch(console.warn);
  }, [props]);

  useEffect(() => {
    if (!selectedFilePath) return;
    getFileDiff(selectedFilePath)
      .then(setDiff)
      .catch(console.warn);
  }, [selectedFilePath]);

  const stageFileChanges = () => {
    if (!selectedFilePath) return;
    stageFile(selectedFilePath);
  };
  const stageAllFileChanges = () => {
    stageAllChanges();
  };

  return (
    <div className="" style={{ display: 'flex' }}>
      <div className="row">
        <div className="">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={stageFileChanges}
          >
            Stage
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={stageAllFileChanges}
          >
            Stage All
          </button>
        </div>
        <div className="col-3">
          <h2>Unstaged</h2>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {gitStatus
                ?.filter(x => x.xy[1] !== XY[' '])
                .map(x => (
                  <tr key={x.path} onClick={() => setSelectedFilePath(x.path)}>
                    <td>{x.path}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h2>Staged</h2>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {gitStatus
                ?.filter(x => x.xy[0] !== XY[' '])
                .map(x => (
                  <tr key={x.path} onClick={() => setSelectedFilePath(x.path)}>
                    <td>{x.path}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="col-9">
          {!selectedFilePath || !diff ? (
            <p>Select a file</p>
          ) : (
            <div>
              <pre>{diff}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryChangesPage;
