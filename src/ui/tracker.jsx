import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

import TrackerController from '../services/tracker-controller';

import Images from './images';
import Storage from './storage';

class Tracker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: true };

    this.initialize();
  }

  async initialize() {
    await Images.importImages();

    const {
      loadProgress,
      match: {
        params: { permalink },
      },
    } = this.props;

    let initialData;

    if (loadProgress) {
      const saveData = Storage.loadFromStorage();

      if (!_.isNil(saveData)) {
        try {
          initialData = TrackerController.initializeFromSaveData(saveData);
        } catch (err) {
          TrackerController.reset();
        }
      }

      if (_.isNil(initialData)) {
        toast.error('Could not load progress from save data!');
      }
    }

    if (_.isNil(initialData)) {
      initialData = await TrackerController.initializeFromPermalink(permalink);
    }

    const { logic, trackerState } = initialData;

    this.setState({
      isLoading: false,
      logic,
      trackerState,
    });
  }

  render() {
    const {
      isLoading,
      logic,
      trackerState,
    } = this.state;

    let content;

    if (isLoading) {
      content = (
        <div className="loading-spinner">
          <Loader color="white" type="Oval" />
        </div>
      );
    } else {
      content = (
        <div>{`TRACKER: ${logic} ${trackerState}`}</div>
      );
    }

    return (
      <>
        {content}
        <ToastContainer />
      </>
    );
  }
}

Tracker.propTypes = {
  loadProgress: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      permalink: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Tracker;
