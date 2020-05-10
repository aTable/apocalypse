import React, { useState, useEffect, useContext } from 'react';
import { exec } from 'child_process';
import { readFile } from 'fs';
import { shell } from 'electron';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { parseISO, format, differenceInDays } from 'date-fns';
import { Repository } from '../types/dump';
import {
  executeCommand,
  getListData,
  takeFirstStdOutputResponse,
  buildRepositoryLocationFromName
} from '../utils/utils';
import GitInspectorDetails from '../components/GitInspectorDetails';
import TerminalContext from '../stores/TerminalContext';

async function loadRepositoryStatistics(path: string): Promise<Repository> {
  const base: Repository = {
    name: path.split('/')[path.split('/').length - 1],
    path,
    remotes: [],
    branches: [],
    commitCount: -1,
    firstCommit: new Date(0),
    lastCommit: new Date(0),
    commits: [],
    tags: [],
    readme: ''
  };

  const [
    remotes,
    branches,
    commitCount,
    firstCommit,
    lastCommit,
    readme
  ] = await Promise.all([
    executeCommand(base.path, `git remote`, getListData),
    executeCommand(base.path, `git branch`, getListData),
    executeCommand(base.path, `git rev-list --all --count`, parseInt),
    executeCommand(
      base.path,
      `git log --reverse --format="%at" | head -1 | xargs -I{} date -d @{} +%Y-%m-%dT%H:%M:%S `,
      stdout => parseISO(takeFirstStdOutputResponse(stdout))
    ),
    executeCommand(
      base.path,
      `git log -1 --format="%at" | xargs -I{} date -d @{} +%Y-%m-%dT%H:%M:%S`,
      stdout => parseISO(takeFirstStdOutputResponse(stdout))
    ),
    new Promise<string>((resolve, reject) => {
      readFile(`${base.path}/README.md`, { encoding: 'UTF-8' }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    })
  ]);
  base.remotes = remotes;
  base.branches = branches;
  base.commitCount = commitCount;
  base.firstCommit = firstCommit;
  base.lastCommit = lastCommit;
  base.readme = readme;

  return base;
}

export interface RepositoryPageProps {
  id: string;
}

const RepositoryPage = (props: RouteComponentProps<RepositoryPageProps>) => {
  const [repository, setRepository] = useState<Repository>();
  const { dispatch } = useContext(TerminalContext);
  const history = useHistory();
  useEffect(() => {
    if (!props.match.params.id) return;
    const _ = loadRepositoryStatistics(
      buildRepositoryLocationFromName(props.match.params.id).path
    ).then(repo => {
      setRepository(repo);
      dispatch({
        type: 'SET_CURRENT_WORKING_DIRECTORY',
        payload: `${repo.path}`
      });
      dispatch({ type: 'EXECUTE', payload: `cd ${repo.path}` });
      return repo;
    });
  }, [props]);

  const openRepositoryFolder = (): void => {
    if (!repository) return;
    shell.openItem(repository.path);
  };
  const openRepositoryShell = (): void => {
    if (!repository) return;
    exec(`gnome-terminal -e "bash -c "!!; exec bash""`);
  };
  const goToRepositoryChanges = () =>
    history.push(`/repositories/${repository?.name}/changes`);
  const goToRepositoryHistory = () =>
    history.push(`/repositories/${repository?.name}/history`);

  return (
    <>
      <p>
        <strong>{repository?.name}</strong>
      </p>
      <p>{repository?.path}</p>
      <p>
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={openRepositoryFolder}
        >
          <i className="fa fa-folder" />
        </button>
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={openRepositoryShell}
        >
          <i className="fa fa-terminal" />
        </button>
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={goToRepositoryChanges}
        >
          <i className="fa fa-list" />
        </button>
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={goToRepositoryHistory}
        >
          <i className="fa fa-history" />
        </button>
      </p>

      <p>
        // TODO: insert line chart on repo commits over time, pie chart on
        contributions
      </p>
      <p>
        // TODO: repository suggestions: missing
        <a href="https://gitignore.io">.gitignore</a>, .editorconfig, linting,
        ...
      </p>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Stat</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Commit count</td>
            <td>{repository?.commitCount}</td>
          </tr>
          <tr>
            <td>Last commit</td>
            <td>
              {repository?.lastCommit
                ? format(repository.lastCommit, 'PPpp')
                : ''}
            </td>
          </tr>
          <tr>
            <td>First commit</td>
            <td>
              {repository?.firstCommit
                ? format(repository.firstCommit, 'PPpp')
                : ''}
            </td>
          </tr>
          <tr>
            <td>Alive for</td>
            <td>
              {repository?.firstCommit && repository?.lastCommit
                ? `${differenceInDays(
                    repository.lastCommit,
                    repository.firstCommit
                  )} days`
                : ''}
            </td>
          </tr>
          <tr>
            <td>Commit count</td>
            <td>{repository?.commitCount}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <p>
        <strong>Remotes</strong>
      </p>
      <ul>
        {repository?.remotes.map(r => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <hr />
      <p>
        <strong>Branches</strong>
      </p>
      <ul>
        {repository?.branches.map(r => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <hr />
      <p>
        <strong>Readme</strong>
      </p>
      <pre style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        {repository?.readme}
      </pre>

      <hr />
      <GitInspectorDetails path={repository?.path} />
    </>
  );
};

export default RepositoryPage;
