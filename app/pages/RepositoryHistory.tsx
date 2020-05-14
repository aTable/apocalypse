import React, { useEffect, useState, useMemo, useContext } from 'react';

import { RouteComponentProps } from 'react-router-dom';
import { RepositoryLocation } from '../types/repositories';
import { buildRepositoryLocationFromName } from '../utils/utils';
import { getRepositoryHistory } from '../utils/git-utils';
import AppContext from '../stores/AppContext';

export interface RepositoryHistoryPageProps {
  id: string;
}

const RepositoryHistoryPage = (
  props: RouteComponentProps<RepositoryHistoryPageProps>
) => {
  const appContext = useContext(AppContext);
  const [history, setHistory] = useState<string[]>();
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
    getRepositoryHistory(repositoryLocation)
      .then(setHistory)
      .catch(console.warn);
  }, [props]);

  return (
    <>
      <h1>History</h1>

      <ul>
        {history?.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      <h2>Commit</h2>
      <h2>Changes</h2>
      <h2>File Tree</h2>
    </>
  );
};

export default RepositoryHistoryPage;
