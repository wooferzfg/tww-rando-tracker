import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import KeyDownWrapper from './key-down-wrapper';

class SphereTracking extends React.PureComponent {
  render() {
    const {
      lastItem,
      lastLocation,
      unsetLastLocation,
    } = this.props;

    if (_.isNil(lastLocation)) {
      return null;
    }

    const {
      generalLocation,
      detailedLocation,
    } = lastLocation;

    let itemSelection;
    if (_.isNil(lastItem)) {
      itemSelection = (
        <div className="no-item last-item">No Item Selected</div>
      );
    } else {
      itemSelection = (
        <div className="last-item">{lastItem}</div>
      );
    }

    return (
      <div className="sphere-tracking">
        <div className="last-location-and-item">
          <div className="last-location">{`${generalLocation} - ${detailedLocation}`}</div>
          {itemSelection}
        </div>
        <div
          className="close-button"
          onClick={unsetLastLocation}
          onKeyDown={KeyDownWrapper.onSpaceKey(unsetLastLocation)}
          role="button"
          tabIndex="0"
        >
          X Close
        </div>
      </div>
    );
  }
}

SphereTracking.defaultProps = {
  lastItem: null,
  lastLocation: null,
};

SphereTracking.propTypes = {
  lastItem: PropTypes.string,
  lastLocation: PropTypes.exact({
    generalLocation: PropTypes.string,
    detailedLocation: PropTypes.string,
  }),
  unsetLastLocation: PropTypes.func.isRequired,
};

export default SphereTracking;
