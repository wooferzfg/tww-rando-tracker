import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

import TrackerController from '../services/tracker-controller';

import Buttons from './buttons';
import Images from './images';
import ItemsTable from './items-table';
import Storage from './storage';

import 'react-toastify/dist/ReactToastify.css';

class Tracker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      singleColorBackground: false,
    };

    this.initialize();

    this.toggleSingleColorBackground = this.toggleSingleColorBackground.bind(this);
    this.updateTrackerState = this.updateTrackerState.bind(this);
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

          toast.success('Progress loaded!');
        } catch (err) {
          TrackerController.reset();
        }
      }

      if (_.isNil(initialData)) {
        toast.error('Could not load progress from save data!');
      }
    }

    if (_.isNil(initialData)) {
      try {
        initialData = await TrackerController.initializeFromPermalink(permalink);
      } catch (err) {
        toast.error('Tracker could not be initialized!');

        throw err;
      }
    }

    const {
      logic,
      saveData,
      trackerState,
    } = initialData;

    this.setState({
      isLoading: false,
      logic,
      saveData,
      trackerState,
    });
  }

  updateTrackerState(newTrackerState) {
    const {
      logic,
      saveData,
      trackerState,
    } = TrackerController.refreshState(newTrackerState);

    Storage.saveToStorage(saveData);

    this.setState({
      logic,
      trackerState,
    });
  }

  toggleSingleColorBackground() {
    const { singleColorBackground } = this.state;

    this.setState({
      singleColorBackground: !singleColorBackground,
    });
  }

  render() {
    const {
      isLoading,
      logic,
      saveData,
      singleColorBackground,
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
        <div className="tracker-container">
          <div className="tracker">
            <ItemsTable
              singleColorBackground={singleColorBackground}
              trackerState={trackerState}
              updateTrackerState={this.updateTrackerState}
            />
          </div>
          <Buttons
            saveData={saveData}
            singleColorBackground={singleColorBackground}
            toggleSingleColorBackground={this.toggleSingleColorBackground}
          />
        </div>
      );
    }

    return (
      <>
        {content}
        <div style={{ display: 'none' }}>{`${logic}`}</div>
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
