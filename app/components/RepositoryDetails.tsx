import React, { useState, useEffect } from 'react';
import { exec } from 'child_process';
import { readFile } from 'fs';
import { shell } from 'electron';
import { parseISO, format, differenceInDays } from 'date-fns';
import { Repository } from '../types/repositories';

import {
  executeCommand,
  getListData,
  takeFirstStdOutputResponse,
} from '../utils/utils';
import GitInspectorDetails from './GitInspectorDetails';

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
    readme: '',
  };

  const [
    remotes,
    branches,
    commitCount,
    firstCommit,
    lastCommit,
    readme,
  ] = await Promise.all([
    executeCommand(base.path, `git remote`, getListData),
    executeCommand(base.path, `git branch`, getListData),
    executeCommand(base.path, `git rev-list --all --count`, parseInt),
    executeCommand(
      base.path,
      `git log --reverse --format="%at" | head -1 | xargs -I{} date -d @{} +%Y-%m-%dT%H:%M:%S `,
      (stdout) => parseISO(takeFirstStdOutputResponse(stdout))
    ),
    executeCommand(
      base.path,
      `git log -1 --format="%at" | xargs -I{} date -d @{} +%Y-%m-%dT%H:%M:%S`,
      (stdout) => parseISO(takeFirstStdOutputResponse(stdout))
    ),
    new Promise<string>((resolve, reject) => {
      readFile(`${base.path}/README.md`, { encoding: 'UTF-8' }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }),
  ]);
  base.remotes = remotes;
  base.branches = branches;
  base.commitCount = commitCount;
  base.firstCommit = firstCommit;
  base.lastCommit = lastCommit;
  base.readme = readme;

  return base;
}

export interface RepositoryStatisticsProps {
  path: string | undefined;
}

const RepositoryStatistics = (props: RepositoryStatisticsProps) => {
  const [repository, setRepository] = useState<Repository>();

  useEffect(() => {
    if (!props.path) return;
    const _ = loadRepositoryStatistics(props.path).then((repo) => {
      setRepository(repo);
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
        {repository?.remotes.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <hr />
      <p>
        <strong>Branches</strong>
      </p>
      <ul>
        {repository?.branches.map((r) => (
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

export default RepositoryStatistics;
