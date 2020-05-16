import React, { FC } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import Toolbar from './components/Toolbar';
import Tabs from './components/Tabs';
import Terminal from './components/Terminal';
import Repository from './pages/Repository';
import RepositoryChanges from './pages/RepositoryChanges';
import RepositoryHistory from './pages/RepositoryHistory';
import Repositories from './pages/Repositories';
import { AuthContextProvider } from './stores/AuthContext';
import { TerminalContextProvider } from './stores/TerminalContext';
import { AppContextProvider } from './stores/AppContext';
import styles from './css/main.scss';

interface AppProps {
  _?: string;
}

const App: FC<AppProps> = () => {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <TerminalContextProvider>
          <Router>
            <Toolbar />
            <Tabs />
            <div className={styles.contentContainer}>
              <Switch>
                <Route
                  path="/repositories/:id/changes"
                  component={RepositoryChanges}
                />
                <Route
                  path="/repositories/:id/history"
                  component={RepositoryHistory}
                />
                <Route path="/repositories/:id" component={Repository} />
                <Route path="/repositories" component={Repositories} />
                <Route path="/" component={Repositories} />
              </Switch>
            </div>
            <Terminal />
          </Router>
        </TerminalContextProvider>
      </AppContextProvider>
    </AuthContextProvider>
  );
};

export default App;
