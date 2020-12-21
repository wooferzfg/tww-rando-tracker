import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
} from 'react-router-dom';

import Launcher from './launcher';
import Tracker from './tracker';

import '../css/main.scss';

export default () => {
  const renderTracker = (loadProgress) => (routerComponentProps) => {
    const { match } = routerComponentProps;

    return (
      <Tracker match={match} loadProgress={loadProgress} />
    );
  };

  return (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={Launcher}
        />
        <Route
          exact
          path="/tracker/new/:permalink"
          render={renderTracker(false)}
        />
        <Route
          exact
          path="/tracker/load/:permalink"
          render={renderTracker(true)}
        />
      </Switch>
    </HashRouter>
  );
};
