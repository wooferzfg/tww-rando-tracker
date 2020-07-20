import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ISLANDS from '../data/islands.json';
import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Sector from './sector';

class SeaChart extends React.PureComponent {
  mapInfo() {
    const {
      disableLogic,
      logic,
      onlyProgressLocations,
      selectedLocation,
    } = this.props;

    if (_.isNil(selectedLocation)) {
      return null;
    }

    const {
      numAvailable,
      numRemaining,
    } = logic.locationCounts(selectedLocation, {
      isDungeon: false,
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
    const {
      clearSelectedItem,
      clearSelectedLocation,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      setSelectedItem,
      setSelectedLocation,
      trackerState,
    } = this.props;

    const islands = _.map(ISLANDS, (islandName) => (
      <Sector
        disableLogic={disableLogic}
        clearSelectedItem={clearSelectedItem}
        clearSelectedLocation={clearSelectedLocation}
        key={islandName}
        incrementItem={incrementItem}
        island={islandName}
        logic={logic}
        onlyProgressLocations={onlyProgressLocations}
        setSelectedItem={setSelectedItem}
        setSelectedLocation={setSelectedLocation}
        trackerState={trackerState}
      />
    ));

    return (
      <div className="chart-map-container">
        <div className="chart-map">
          <div className="chart-map-background">
            <img src={Images.IMAGES.SEA_CHART} alt="" />
          </div>
          <div className="maps">
            {islands}
          </div>
        </div>
        {this.mapInfo()}
        {this.mapItemInfo()}
      </div>
    );
  }
}

SeaChart.defaultProps = {
  selectedItem: null,
  selectedLocation: null,
};

SeaChart.propTypes = {
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  selectedItem: PropTypes.string,
  selectedLocation: PropTypes.string,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default SeaChart;
