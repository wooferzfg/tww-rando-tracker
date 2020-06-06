import PropTypes from 'prop-types';
import React from 'react';

import TrackerController from '../services/tracker-controller';

import Images from './images';

class Tracker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: true };
  }

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    const {
      match: {
        params: { permalink },
      },
    } = this.props;

    const {
      logic,
      trackerState,
    } = await TrackerController.initialize(permalink);

    await Images.importImages();

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

    return (
      <div>{`TRACKER: ${isLoading} ${logic} ${trackerState}`}</div>
    );
  }
}

Tracker.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      permalink: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Tracker;
