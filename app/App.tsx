import React, { FC } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Repository from './pages/Repository';
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
          <Route path="/repositories/:id" component={Repository} />
          <Route path="/repositories" component={Repositories} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
