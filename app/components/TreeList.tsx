import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export interface TreeListProps {
  [key: string]: string[];
}

const TreeList: FC<TreeListProps> = (props) => {
  const history = useHistory();

  const goToRepositories = () => history.push(`/repositories`);

  return Object.entries(props).map((x, i) => <ul>{}</ul>);
};

export default TreeList;
