import React from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Repositories from './components/views/Repositories/Repositories';
import styles from './App.module.css';

const REPOS_PATH = '/repositories';

const App: React.FC = () => (
  <div className={styles.wrapper}>
    <main className={styles.page}>
      <Router>
        <Switch>
          <Route path={REPOS_PATH}>
            <Repositories />
          </Route>
          <Redirect to={REPOS_PATH} />
        </Switch>
      </Router>
    </main>
  </div>
);

export default App;
