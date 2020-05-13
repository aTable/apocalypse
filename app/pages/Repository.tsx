import React, { useState, useEffect, useContext } from 'react';
import { exec } from 'child_process';
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { shell } from 'electron';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import {
  LineChart,
  XAxis,
  CartesianGrid,
  Line,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { parseISO, format, differenceInDays } from 'date-fns';
import { RepositoryContribution } from '../types/repositories';
import {
  executeCommand,
  getListData,
  takeFirstStdOutputResponse,
  buildRepositoryLocationFromName,
} from '../utils/utils';
import TerminalContext from '../stores/TerminalContext';
import { RepositoryLocation } from '../types/repositories';

export interface RepositoryPageProps {
  id: string;
}

const RepositoryPage = (props: RouteComponentProps<RepositoryPageProps>) => {
  const { dispatch } = useContext(TerminalContext);
  const history = useHistory();
  const [repo, setRepository] = useState<RepositoryLocation>();
  const [remotes, setRemotes] = useState<string[]>();
  const [branches, setBranches] = useState<string[]>();
  const [commitCount, setCommitCount] = useState<number>();
  const [firstCommit, setFirstCommit] = useState<Date>();
  const [lastCommit, setLastCommit] = useState<Date>();
  //const [commits, setCommits] = useState<string[]>();
  //const [tags, setTags] = useState<string[]>();
  const [readme, setReadme] = useState<string>();
  const [contributions, setContributions] = useState<
    RepositoryContribution[]
  >();

  useEffect(() => {
    if (!props.match.params.id) return;
    setRepository(buildRepositoryLocationFromName(props.match.params.id));
  }, [props]);

  useEffect(() => {
    if (!repo) return;
    dispatch({
      type: 'SET_CURRENT_WORKING_DIRECTORY',
      payload: `${repo.path}`,
    });
    dispatch({ type: 'EXECUTE', payload: `cd ${repo.path}` });

    executeCommand(repo.path, `git remote`, getListData).then(setRemotes);
    executeCommand(repo.path, `git branch`, getListData).then(setBranches);
    executeCommand(repo.path, `git rev-list --all --count`, parseInt).then(
      setCommitCount
    );
    executeCommand(
      repo.path,
      `git log --reverse --format="%at" | head -1 | xargs -I{} date -d @{} +%Y-%m-%dT%H:%M:%S `,
      (stdout) => parseISO(takeFirstStdOutputResponse(stdout))
    ).then(setFirstCommit);
    executeCommand(
      repo.path,
      `git log -1 --format="%at" | xargs -I{} date -d @{} +%Y-%m-%dT%H:%M:%S`,
      (stdout) => parseISO(takeFirstStdOutputResponse(stdout))
    ).then(setLastCommit);
    new Promise<string>((resolve, reject) => {
      readFile(`${repo.path}/README.md`, { encoding: 'UTF-8' }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }).then(setReadme);

    executeCommand(
      repo.path,
      `git shortlog HEAD --email --summary --numbered`,
      (stdout) => {
        const contribs = stdout
          .split('\n')
          .map((x) => x.trim())
          .filter((x) => x)
          .map<RepositoryContribution>((x) => {
            const [countRaw, contactDetails] = x.split('\t');
            const email = /<[\s\S]*>/.exec(contactDetails);
            const author = /^(.*?)\ </.exec(contactDetails);
            const c = {
              count: parseInt(countRaw, 10),
              author: author ? author[1] : '',
              email: email ? email[0] : '',
            };
            return c;
          });
        return contribs;
      }
    ).then(setContributions);
  }, [repo]);

  const openRepositoryFolder = (): void => {
    if (!repo) return;
    shell.openItem(repo.path);
  };
  const openRepositoryShell = (): void => {
    if (!repo) return;
    exec(`gnome-terminal -e "bash -c "!!; exec bash""`);
  };
  const goToRepositoryChanges = () =>
    history.push(`/repositories/${repo?.name}/changes`);
  const goToRepositoryHistory = () =>
    history.push(`/repositories/${repo?.name}/history`);
  const createReadme = () => {
    if (!repo) return;
    const createFilePath = join(repo.path, 'README.md');
    const defaultReadmeContents = `# ${repo.name}\n\n`;
    new Promise<string>((resolve) => {
      writeFile(createFilePath, defaultReadmeContents, () => {
        resolve(defaultReadmeContents);
      });
    }).then(() => setReadme(defaultReadmeContents));
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <p>
            <strong>{repo?.name}</strong>
          </p>
          <p>{repo?.path}</p>
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
        </div>
        <div className="col-md-6">
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
                <td>{commitCount}</td>
              </tr>
              <tr>
                <td>Last commit</td>
                <td>{lastCommit ? format(lastCommit, 'PPpp') : ''}</td>
              </tr>
              <tr>
                <td>First commit</td>
                <td>{firstCommit ? format(firstCommit, 'PPpp') : ''}</td>
              </tr>
              <tr>
                <td>Alive for</td>
                <td>
                  {firstCommit && lastCommit
                    ? `${differenceInDays(lastCommit, firstCommit)} days`
                    : ''}
                </td>
              </tr>
              <tr>
                <td>Commit count</td>
                <td>{commitCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          {contributions && (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="count"
                    nameKey="email"
                    data={contributions}
                    fill="#82ca9d"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="col-12">
          <p>
            <strong>Checklist</strong>
          </p>
          <ul>
            <li>
              {readme ? (
                <span>
                  <i className="text-success fa fa-check-circle" /> README.md
                </span>
              ) : (
                <span>
                  <i className="text-warning fa fa-times-circle" /> Missing{' '}
                  <a href="https://en.wikipedia.org/wiki/README">README.md</a>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={createReadme}
                  >
                    Create
                  </button>
                </span>
              )}
            </li>
            <li>.gitignore</li>
            <li>.editorconfig</li>
            <li>linting</li>
          </ul>
          <p>// TODO: insert line chart on repo commits over time</p>
          <hr />
          <p>
            <strong>Remotes</strong>
          </p>
          <ul>
            {remotes?.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <hr />
          <p>
            <strong>Branches</strong>
          </p>
          <ul>
            {branches?.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <hr />
          {readme && (
            <>
              <p>
                <strong>Readme</strong>
              </p>
              <pre style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                {readme}
              </pre>
            </>
          )}

          <hr />
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;
