import React, { useState, useEffect, useMemo, useContext } from 'react';
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
  isFileUnstaged,
  discardFile,
} from '../utils/git-utils';
import { RepositoryLocation } from '../types/repositories';
import GitDiffHunk from '../components/GitDiffHunk';
import AppContext from '../stores/AppContext';

export interface RepositoryChangesPageProps {
  id: string;
}

enum FileMode {
  unstaged = 'unstaged',
  staged = 'staged',
}

const RepositoryChangesPage = (
  props: RouteComponentProps<RepositoryChangesPageProps>
) => {
  const appContext = useContext(AppContext);
  const [gitStatus, setGitStatus] = useState<GitStatusFile[]>();
  const [selectedFile, setSelectedFile] = useState<GitStatusFile>();
  const [mode, setMode] = useState<FileMode>();
  const [diff, setDiff] = useState<FileDiff>();
  const [commitMessage, setCommitMessage] = useState('');
  const [isAmendCommit, setIsAmendCommit] = useState(false);
  const [isVerifyCommit, setIsVerifyCommit] = useState(true);

  const repositoryLocation = useMemo<RepositoryLocation>(
    () =>
      buildRepositoryLocationFromName(
        appContext.state.repositoriesPath,
        props.match.params.id
      ),
    [props.match.params.id]
  );

  useEffect(() => {
    if (!props.match.params.id) return;
    getGitStatus(repositoryLocation).then(setGitStatus).catch(console.warn);
  }, [props]);

  useEffect(() => {
    if (!selectedFile) return;
    getFileDiff(
      selectedFile.path,
      appContext.state.linesForContext,
      mode === FileMode.staged
    )
      .then(setDiff)
      .catch(console.warn);
  }, [selectedFile, appContext.state.linesForContext, mode]);

  const linesForContextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    appContext.dispatch({
      type: 'SET_LINES_FOR_CONTEXT',
      payload: e.target.valueAsNumber,
    });
  const discardFileChanges = () => {
    if (!selectedFile) return;
    discardFile(selectedFile.path)
      .then(() => getGitStatus(repositoryLocation))
      .then(setGitStatus)
      .then(() => setDiff(undefined))
      .catch(console.warn);
  };
  const stageFileChanges = () => {
    if (!selectedFile) return;
    stageFile(selectedFile.path)
      .then(() => getGitStatus(repositoryLocation))
      .then(setGitStatus)
      .then(() => setDiff(undefined))
      .catch(console.warn);
  };
  const stageAllFileChanges = () => {
    stageAllChanges()
      .then(() => getGitStatus(repositoryLocation))
      .then(setGitStatus)
      .then(() => setDiff(undefined))
      .catch(console.warn);
  };

  const commit = () => {
    gitCommit(repositoryLocation, commitMessage, isAmendCommit, isVerifyCommit)
      .then(() => getGitStatus(repositoryLocation))
      .then(setGitStatus)
      .then(() => setCommitMessage(''))
      .catch(console.warn);
  };

  const fileClicked = (file: GitStatusFile, fileMode: FileMode) => {
    setSelectedFile(file);
    setMode(fileMode);
  };

  return (
    <div className="container-fluid" style={{ height: 'inherit' }}>
      <div className="row" style={{ height: 'inherit', overflowY: 'scroll' }}>
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
              {gitStatus?.filter(isFileUnstaged).map((x) => (
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
              {gitStatus?.filter(isFileStaged).map((x) => (
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
            onChange={(e) => setCommitMessage(e.target.value)}
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
            value={appContext.state.linesForContext}
            onChange={linesForContextChange}
          />

          <div>
            {!selectedFile || !diff ? (
              <p>Select a file</p>
            ) : (
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={discardFileChanges}
                >
                  Discard File
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={stageFileChanges}
                >
                  Stage File
                </button>

                {diff.hunks.map((x) => (
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
