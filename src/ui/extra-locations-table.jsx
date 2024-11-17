import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import ExtraLocation from './extra-location';

class ExtraLocationsTable extends React.PureComponent {
  static NUM_EXTRA_LOCATIONS = 5;

  static EXTRA_WIDTH = 30;

  static getWidth() {
    return this.NUM_EXTRA_LOCATIONS * ExtraLocation.getWidth() + this.EXTRA_WIDTH;
  }

  extraLocation(locationName) {
    const {
      clearAllLocations,
      clearSelectedItem,
      clearSelectedLocation,
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      rightClickToClearAll,
      setSelectedEntrance,
      setSelectedExit,
      setSelectedItem,
      setSelectedLocation,
      spheres,
      trackerState,
      trackSpheres,
      unsetEntrance,
      unsetExit,
      updateOpenedEntrance,
      updateOpenedExit,
      updateOpenedLocation,
      viewingEntrances,
    } = this.props;

    const isDungeon = LogicHelper.isDungeon(locationName);

    return (
      <ExtraLocation
        clearAllLocations={clearAllLocations}
        clearSelectedItem={clearSelectedItem}
        clearSelectedLocation={clearSelectedLocation}
        decrementItem={decrementItem}
        disableLogic={disableLogic}
        key={locationName}
        incrementItem={incrementItem}
        isDungeon={isDungeon}
        locationName={locationName}
        logic={logic}
        onlyProgressLocations={onlyProgressLocations}
        rightClickToClearAll={rightClickToClearAll}
        setSelectedEntrance={setSelectedEntrance}
        setSelectedExit={setSelectedExit}
        setSelectedItem={setSelectedItem}
        setSelectedLocation={setSelectedLocation}
        spheres={spheres}
        trackerState={trackerState}
        trackSpheres={trackSpheres}
        unsetEntrance={unsetEntrance}
        unsetExit={unsetExit}
        updateOpenedEntrance={updateOpenedEntrance}
        updateOpenedExit={updateOpenedExit}
        updateOpenedLocation={updateOpenedLocation}
        viewingEntrances={viewingEntrances}
      />
    );
  }

  render() {
    const { backgroundColor } = this.props;

    return (
      <div
        className="extra-locations"
        style={{ backgroundColor, width: ExtraLocationsTable.getWidth() }}
      >
        {this.extraLocation(LogicHelper.DUNGEONS.DRAGON_ROOST_CAVERN)}
        {this.extraLocation(LogicHelper.DUNGEONS.FORBIDDEN_WOODS)}
        {this.extraLocation(LogicHelper.DUNGEONS.TOWER_OF_THE_GODS)}
        {this.extraLocation(LogicHelper.DUNGEONS.EARTH_TEMPLE)}
        {this.extraLocation(LogicHelper.DUNGEONS.WIND_TEMPLE)}
        {this.extraLocation(LogicHelper.MISC_LOCATIONS.MAILBOX)}
        {this.extraLocation(LogicHelper.MISC_LOCATIONS.THE_GREAT_SEA)}
        {this.extraLocation(LogicHelper.DUNGEONS.FORSAKEN_FORTRESS)}
        {this.extraLocation(LogicHelper.MISC_LOCATIONS.HYRULE)}
        {this.extraLocation(LogicHelper.DUNGEONS.GANONS_TOWER)}
      </div>
    );
  }
}

ExtraLocationsTable.defaultProps = {
  backgroundColor: null,
};

ExtraLocationsTable.propTypes = {
  backgroundColor: PropTypes.string,
  clearAllLocations: PropTypes.func.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  rightClickToClearAll: PropTypes.bool.isRequired,
  setSelectedEntrance: PropTypes.func.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetEntrance: PropTypes.func.isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedEntrance: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
  viewingEntrances: PropTypes.bool.isRequired,
};

export default ExtraLocationsTable;
