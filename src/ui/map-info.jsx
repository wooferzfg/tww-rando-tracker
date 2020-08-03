import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

class MapInfo extends React.PureComponent {
  mapInfo() {
    const {
      disableLogic,
      logic,
      onlyProgressLocations,
      selectedLocation,
      selectedLocationIsDungeon,
    } = this.props;

    if (_.isNil(selectedLocation)) {
      return null;
    }

    const {
      numAvailable,
      numRemaining,
    } = logic.locationCounts(selectedLocation, {
      isDungeon: selectedLocationIsDungeon,
      onlyProgressLocations,
      disableLogic,
    });

    return (
      <div className="map-info-container">
        <div className="map-info">{selectedLocation}</div>
        <div className="chest-counts">
          <span className="chests-available">{numAvailable}</span>
          <span> Accessible, </span>
          <span className="chests-total">{numRemaining}</span>
          <span> Remaining</span>
        </div>
      </div>
    );
  }

  mapItemInfo() {
    const {
      selectedItem,
      trackerState,
    } = this.props;

    if (_.isNil(selectedItem)) {
      return null;
    }

    const itemCount = trackerState.getItemValue(selectedItem);
    const itemInfoText = LogicHelper.prettyNameForItem(selectedItem, itemCount);

    return (
      <div className="map-item-info-container">
        <span className="map-item-info">{itemInfoText}</span>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.mapInfo()}
        {this.mapItemInfo()}
      </>
    );
  }
}

MapInfo.defaultProps = {
  selectedItem: null,
  selectedLocation: null,
  selectedLocationIsDungeon: null,
};

MapInfo.propTypes = {
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  selectedItem: PropTypes.string,
  selectedLocation: PropTypes.string,
  selectedLocationIsDungeon: PropTypes.bool,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default MapInfo;
