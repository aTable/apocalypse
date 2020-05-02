import React, { FC } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

export interface NavItemProps extends RouteComponentProps {
  isDisabled?: boolean;
  to: string;
}

const NavItem: FC<NavItemProps> = props => {
  const isActive = () => props.location.pathname === props.to;

  const linkClicked = (e: any) => {
    if (props.isDisabled || isActive()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  const activeClassName = isActive() ? 'active' : '';

  return (
    <li className={`nav-item ${activeClassName}`}>
      <Link
        to={props.to}
        className={`nav-link ${props.isDisabled ? 'disabled' : ''}`}
        onClick={linkClicked}
      >
        {props.children}{' '}
        {isActive() ? <span className="sr-only">(current)</span> : null}
      </Link>
    </li>
  );
};

export default withRouter(NavItem);
