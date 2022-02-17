import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import KeyDownWrapper from './key-down-wrapper';

class SphereTracking extends React.PureComponent {
  render() {
    const {
      backgroundColor,
      lastLocation,
      trackerState,
      unsetLastLocation,
    } = this.props;

    if (_.isNil(lastLocation)) {
      return null;
    }

    const {
      generalLocation,
      detailedLocation,
    } = lastLocation;

    const lastItem = trackerState.getItemForLocation(generalLocation, detailedLocation);

    let itemSelection;
    if (_.isNil(lastItem)) {
      itemSelection = (
        <div className="no-item last-item">No Item Selected</div>
      );
    } else {
      const prettyItemName = LogicHelper.prettyNameForItem(lastItem, null);

      itemSelection = (
        <div className="last-item">{prettyItemName}</div>
      );
    }

    return (
      <div
        className="sphere-tracking"
        style={{ backgroundColor }}
      >
        <div className="last-location-and-item">
          <div className="last-location">{`${generalLocation} | ${detailedLocation}`}</div>
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
  backgroundColor: null,
  lastLocation: null,
};

SphereTracking.propTypes = {
  backgroundColor: PropTypes.string,
  lastLocation: PropTypes.exact({
    generalLocation: PropTypes.string,
    detailedLocation: PropTypes.string,
  }),
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  unsetLastLocation: PropTypes.func.isRequired,
};

export default SphereTracking;
