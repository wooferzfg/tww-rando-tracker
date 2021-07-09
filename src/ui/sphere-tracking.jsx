import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

class SphereTracking extends React.PureComponent {
  render() {
    const {
      lastItem,
      lastLocation,
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
        <div className="last-location">{`${generalLocation} - ${detailedLocation}`}</div>
        {itemSelection}
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
};

export default SphereTracking;
