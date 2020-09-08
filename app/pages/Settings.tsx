import React, { useContext } from 'react';
import AppContext from '../stores/AppContext';

const Settings = () => {
  const { state, dispatch } = useContext(AppContext);

  const linesForContextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: 'SET_LINES_FOR_CONTEXT',
      payload: e.target.valueAsNumber,
    });
  const isFetchAllRemotesChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: 'SET_FETCH_ALL_REMOTES',
      payload: e.target.checked,
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1>Settings</h1>
        </div>
        <div className="col-12">
          <h2>General</h2>
          <h3>Diffs</h3>
          <label htmlFor="lines-for-context-input">
            <input
              id="lines-for-context-input"
              type="number"
              value={state.linesForContext}
              onChange={linesForContextChange}
            />{' '}
            Lines for context
          </label>

          <h3>Fetch</h3>
          <label htmlFor="fetch-all-remotes-input">
            <input
              id="fetch-all-remotes-input"
              type="checkbox"
              checked={state.isFetchAllRemotes}
              onChange={isFetchAllRemotesChange}
            />{' '}
            Fetch all remotes
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
