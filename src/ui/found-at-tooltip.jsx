import PropTypes from 'prop-types';
import React from 'react';

import Spheres from '../services/spheres';

class FoundAtTooltip extends React.PureComponent {
  render() {
    const { locations, spheres } = this.props;

    const locationsSorted = locations.sort((a, b) => (
      spheres.sphereForLocation(a.generalLocation, a.detailedLocation)
      - spheres.sphereForLocation(b.generalLocation, b.detailedLocation)
    ));

    return (
      <div className="tooltip item-location">
        <div className="tooltip-title">Found At</div>
        <ul>
          {locationsSorted.map(({ generalLocation, detailedLocation }) => (
            <li key={`${generalLocation}-${detailedLocation}`}>
              {`${generalLocation} | ${detailedLocation}`}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

FoundAtTooltip.propTypes = {
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    generalLocation: PropTypes.string.isRequired,
    detailedLocation: PropTypes.string.isRequired,
  })).isRequired,
};

export default FoundAtTooltip;
