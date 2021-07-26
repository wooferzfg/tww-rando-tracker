import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Spheres from '../services/spheres';

class FoundAtTooltip extends React.PureComponent {
  render() {
    const { locations, spheres } = this.props;

    const sortedLocations = _.sortBy(
      locations,
      ({ generalLocation, detailedLocation }) => {
        const sphereForLocation = spheres.sphereForLocation(generalLocation, detailedLocation);

        return _.isNil(sphereForLocation) ? Number.MAX_SAFE_INTEGER : sphereForLocation;
      },
    );

    const locationsList = _.map(sortedLocations, ({ generalLocation, detailedLocation }) => {
      const sphere = spheres.sphereForLocation(generalLocation, detailedLocation);
      const sphereText = _.isNil(sphere) ? '?' : sphere;
      const locationName = `${generalLocation} | ${detailedLocation}`;

      return (
        <li key={locationName}>
          {`[${sphereText}] ${locationName}`}
        </li>
      );
    });

    return (
      <div className="tooltip item-location">
        <div className="tooltip-title">Locations Found At</div>
        <ul>{locationsList}</ul>
      </div>
    );
  }
}

FoundAtTooltip.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.exact({
    generalLocation: PropTypes.string.isRequired,
    detailedLocation: PropTypes.string.isRequired,
  })).isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
};

export default FoundAtTooltip;
