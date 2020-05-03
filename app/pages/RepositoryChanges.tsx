import React, { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { buildRepositoryLocationFromName } from '../utils/utils';
import { GitStatusFiles, XY } from '../types/git';
import { getGitStatus, getFileDiff, stageFile } from '../utils/git-utils';
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

  return (
    <>
      <div className="row">
        <div className="col-12">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={stageFileChanges}
          >
            Stage
          </button>
        </div>
        <div className="col-3">
          <h2>Unstaged</h2>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Path</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {gitStatus
                ?.filter(x => x.xy[1])
                .map(x => (
                  <tr key={x.path} onClick={() => setSelectedFilePath(x.path)}>
                    <td>{x.path}</td>
                    <td>{x.xy}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h2>Staged</h2>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Path</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {gitStatus
                ?.filter(x => x.xy[0])
                .map(x => (
                  <tr key={x.path} onClick={() => setSelectedFilePath(x.path)}>
                    <td>{x.path}</td>
                    <td>{x.xy}</td>
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
    </>
  );
};

export default RepositoryChangesPage;
