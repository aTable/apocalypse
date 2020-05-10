import React, { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { buildRepositoryLocationFromName } from '../utils/utils';
import { GitStatusFile, XY, FileDiff } from '../types/git';
import {
  getGitStatus,
  getFileDiff,
  stageFile,
  stageAllChanges,
  gitCommit,
  isFileStaged,
  isFileUnstaged
} from '../utils/git-utils';
import { RepositoryLocation } from '../types/repositories';
import config from '../config';
import GitDiffHunk from '../components/GitDiffHunk';

export interface RepositoryChangesPageProps {
  id: string;
}

enum FileMode {
  unstaged = 'unstaged',
  staged = 'staged'
}

const RepositoryChangesPage = (
  props: RouteComponentProps<RepositoryChangesPageProps>
) => {
  const [gitStatus, setGitStatus] = useState<GitStatusFile[]>();
  const [selectedFile, setSelectedFile] = useState<GitStatusFile>();
  const [mode, setMode] = useState<FileMode>();
  const [diff, setDiff] = useState<FileDiff>();
  const [linesForContext, setLinesForContext] = useState<number>(
    config.linesForContext
  );
  const [commitMessage, setCommitMessage] = useState('');
  const [isAmendCommit, setIsAmendCommit] = useState(false);
  const [isVerifyCommit, setIsVerifyCommit] = useState(true);

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
    if (!selectedFile) return;
    getFileDiff(selectedFile.path, linesForContext, mode === FileMode.staged)
      .then(setDiff)
      .catch(console.warn);
  }, [selectedFile, linesForContext, mode]);

  const stageFileChanges = () => {
    if (!selectedFile) return;
    stageFile(selectedFile.path)
      .then(() => getGitStatus(repositoryLocation))
      .then(setGitStatus)
      .catch(console.warn);
  };
  const stageAllFileChanges = () => {
    stageAllChanges()
      .then(() => getGitStatus(repositoryLocation))
      .then(setGitStatus)
      .catch(console.warn);
  };

  const commit = () => {
    gitCommit(repositoryLocation, commitMessage, isAmendCommit, isVerifyCommit)
      .then(() => getGitStatus(repositoryLocation))
      .then(setGitStatus)
      .catch(console.warn);
  };

  const fileClicked = (file: GitStatusFile, fileMode: FileMode) => {
    setSelectedFile(file);
    setMode(fileMode);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2" style={{ flexGrow: 1 }}>
          <h1>Navbar</h1>
        </div>

        <div className="col-5">
          <h2>
            Unstaged
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ float: 'right' }}
              onClick={stageAllFileChanges}
            >
              Stage All
            </button>
          </h2>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {gitStatus?.filter(isFileUnstaged).map(x => (
                <tr
                  key={x.path}
                  onClick={() => fileClicked(x, FileMode.unstaged)}
                >
                  <td>{x.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />

          <h2>Staged</h2>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {gitStatus?.filter(isFileStaged).map(x => (
                <tr
                  key={x.path}
                  onClick={() => fileClicked(x, FileMode.staged)}
                >
                  <td>{x.path}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <h2>Commit</h2>
          <label htmlFor="amend-commit">
            <input
              id="amend-commit"
              type="checkbox"
              checked={isAmendCommit}
              onChange={() => setIsAmendCommit(!isAmendCommit)}
            />
            Amend
          </label>
          <label htmlFor="verify-commit">
            <input
              id="verify-commit"
              type="checkbox"
              checked={isVerifyCommit}
              onChange={() => setIsVerifyCommit(!isVerifyCommit)}
            />
            Verify
          </label>
          <textarea
            className="form-control"
            value={commitMessage}
            onChange={e => setCommitMessage(e.target.value)}
          />
          <br />
          <button
            className="btn btn-block btn-primary"
            type="button"
            onClick={commit}
          >
            Commit
          </button>
        </div>
        <div className="col-5">
          <input
            className="form-control"
            type="number"
            value={linesForContext}
            onChange={e => setLinesForContext(e.target.valueAsNumber)}
          />

          <div>
            {!selectedFile || !diff ? (
              <p>Select a file</p>
            ) : (
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={stageFileChanges}
                >
                  Stage All
                </button>

                {diff.hunks.map(x => (
                  <GitDiffHunk
                    key={x.metadata}
                    hunk={x}
                    stage={null}
                    discard={null}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryChangesPage;
