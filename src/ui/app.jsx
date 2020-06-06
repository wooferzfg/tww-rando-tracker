import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
} from 'react-router-dom';

import Launcher from './launcher';
import Tracker from './tracker';

import '../css/main.scss';

export default () => (
  <HashRouter>
    <Switch>
      <Route
        exact
        path="/"
        component={Launcher}
      />
      <Route
        exact
        path="/tracker/:permalink"
        component={Tracker}
      />
    </Switch>
  </HashRouter>
);
