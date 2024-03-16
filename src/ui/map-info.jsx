import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

class MapInfo extends React.PureComponent {
  static entranceExitItemInfo(entrance, exit) {
    const shortEntranceName = LogicHelper.shortEntranceName(entrance);
    const shortExitName = LogicHelper.shortExitName(exit);
    return `${shortEntranceName} → ${shortExitName}`;
  }

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
      onlyProgressLocations,
      disableLogic,
    });

    return (
      <div className="map-info-container">
        <div className="map-info">{selectedLocation}</div>
        <div className="chest-counts">
          {!disableLogic && (
            <>
              <span className="chests-available">{numAvailable}</span>
              <span> Accessible, </span>
            </>
          )}
          <span className="chests-total">{numRemaining}</span>
          <span> Remaining</span>
        </div>
      </div>
    );
  }

  mapItemInfo() {
    const {
      selectedChartForIsland,
      selectedEntrance,
      selectedExit,
      selectedItem,
      trackerState,
    } = this.props;

    let itemInfoText;

    if (!_.isNil(selectedEntrance)) {
      const exitForEntrance = trackerState.getExitForEntrance(selectedEntrance);

      if (!_.isNil(exitForEntrance)) {
        itemInfoText = MapInfo.entranceExitItemInfo(selectedEntrance, exitForEntrance);
      } else {
        itemInfoText = LogicHelper.shortEntranceName(selectedEntrance);
      }
    }

    if (!_.isNil(selectedExit)) {
      const entranceForExit = trackerState.getEntranceForExit(selectedExit);

      if (!_.isNil(entranceForExit)) {
        itemInfoText = MapInfo.entranceExitItemInfo(entranceForExit, selectedExit);
      } else {
        itemInfoText = LogicHelper.entryName(selectedExit);
      }
    }

    if (!_.isNil(selectedChartForIsland)) {
      const island = LogicHelper.islandFromChartForIsland(selectedChartForIsland);
      const chart = trackerState.getChartFromChartMapping(island);
      if (chart) {
        itemInfoText = `${chart} → ${island}`;
      } else {
        itemInfoText = selectedChartForIsland;
      }
    }

    if (!_.isNil(selectedItem)) {
      const itemCount = trackerState.getItemValue(selectedItem);
      itemInfoText = LogicHelper.prettyNameForItem(selectedItem, itemCount);
    }

    if (_.isNil(itemInfoText)) {
      return null;
    }

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
  selectedChartForIsland: null,
  selectedEntrance: null,
  selectedExit: null,
  selectedItem: null,
  selectedLocation: null,
};

MapInfo.propTypes = {
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  selectedChartForIsland: PropTypes.string,
  selectedEntrance: PropTypes.string,
  selectedExit: PropTypes.string,
  selectedItem: PropTypes.string,
  selectedLocation: PropTypes.string,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default MapInfo;
