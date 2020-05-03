import React, { FC } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Terminal from './components/Terminal';
import Repository from './pages/Repository';
import RepositoryChanges from './pages/RepositoryChanges';
import RepositoryHistory from './pages/RepositoryHistory';
import Repositories from './pages/Repositories';
import { AuthContextProvider } from './stores/AuthContext';

interface AppProps {
  _?: string;
}

const App: FC<AppProps> = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
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
        <Terminal />
      </Router>
    </AuthContextProvider>
  );
};

export default App;
