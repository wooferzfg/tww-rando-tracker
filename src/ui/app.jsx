import React from 'react';
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';

import Launcher from './launcher';
import Tracker from './tracker';

import '../css/main.scss';

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Launcher />
        </Route>
        <Route exact path="/tracker">
          <Tracker />
        </Route>
      </Switch>
    </HashRouter>
  );
}
