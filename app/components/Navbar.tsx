import React, { FC } from 'react';
import { withRouter, Link } from 'react-router-dom';
import NavItem from './NavItem';

export interface NavBarProps {}
const NavBar: FC<NavBarProps> = () => {
  return (
    <nav className="navbar navbar-expand-sm">
      <Link className="navbar-brand" to="/repositories">
        Apocalypse
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          {/* <NavItem to="/">Home</NavItem> */}
          <NavItem to="/repositories">Repositories</NavItem>
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(NavBar);
