import React, { FC } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import styles from '../css/main.scss';

export interface NavBarProps {}
const NavBar: FC<NavBarProps> = () => {
  const history = useHistory();
  const goToRepositories = () => history.push(`/repositories`);

  return (
    <div className={styles.toolbar}>
      <button className="btn" onClick={goToRepositories}>
        Repositories
      </button>
      <button className="btn">Fetch</button>
      <button className="btn">Pull</button>
      <button className="btn">Push</button>
    </div>
  );
};

export default withRouter(NavBar);
