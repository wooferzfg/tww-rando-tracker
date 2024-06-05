import PropTypes from 'prop-types';
import React from 'react';
import {
  HashRouter,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';

import Launcher from './launcher';
import Tracker from './tracker';

import '../css/main.scss';

function RenderTracker({ loadProgress }) {
  const { permalink } = useParams();

  return (
    <Tracker permalink={permalink} loadProgress={loadProgress} />
  );
}

RenderTracker.propTypes = {
  loadProgress: PropTypes.bool.isRequired,
};

function App({ hasUpdatePromise }) {
  return (
    <HashRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<Launcher hasUpdatePromise={hasUpdatePromise} />}
        />
        <Route
          exact
          path="/tracker/new/:permalink"
          element={<RenderTracker loadProgress={false} />}
        />
        <Route
          exact
          path="/tracker/load/:permalink"
          element={<RenderTracker loadProgress />}
        />
      </Routes>
    </HashRouter>
  );
}

App.propTypes = {
  hasUpdatePromise: PropTypes.instanceOf(Promise).isRequired,
};

export default App;
