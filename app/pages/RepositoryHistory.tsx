import React, { useEffect, useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';

export interface RepositoryHistoryPageProps {
  id: string;
}

const RepositoryHistoryPage = (
  props: RouteComponentProps<RepositoryHistoryPageProps>
) => {
  useEffect(() => {}, []);

  return (
    <>
      <h1>History</h1>
    </>
  );
};

export default RepositoryHistoryPage;
