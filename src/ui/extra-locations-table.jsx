import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import ExtraLocation from './extra-location';
import Images from './images';

class ExtraLocationsTable extends React.PureComponent {
  extraLocation(locationName) {
    const {
      clearSelectedExit,
      clearSelectedItem,
      clearSelectedLocation,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      setOpenedLocation,
      setSelectedExit,
      setSelectedItem,
      setSelectedLocation,
      trackerState,
    } = this.props;

    const isDungeon = LogicHelper.isDungeon(locationName);
    const isMainDungeon = LogicHelper.isMainDungeon(locationName);

    const {
      color,
      numAvailable,
      numRemaining,
    } = logic.locationCounts(locationName, {
      isDungeon,
      onlyProgressLocations,
      disableLogic,
    });

    let locationIcon;
    if (isDungeon) {
      const isBossDefeated = logic.isBossDefeated(locationName);

      locationIcon = _.get(Images.IMAGES, ['DUNGEONS', locationName, isBossDefeated]);
    } else {
      locationIcon = _.get(Images.IMAGES, ['MISC_LOCATIONS', locationName]);
    }

    if (isMainDungeon) {
      const smallKeyName = LogicHelper.smallKeyName(locationName);
      const smallKeyCount = trackerState.getItemValue(smallKeyName);

      const bigKeyName = LogicHelper.bigKeyName(locationName);
      const bigKeyCount = trackerState.getItemValue(bigKeyName);

      const entranceName = LogicHelper.dungeonEntryName(locationName);
      const entranceCount = trackerState.getItemValue(entranceName);

      return (
        <ExtraLocation
          bigKeyCount={bigKeyCount}
          bigKeyName={bigKeyName}
          clearSelectedExit={clearSelectedExit}
          clearSelectedItem={clearSelectedItem}
          clearSelectedLocation={clearSelectedLocation}
          color={color}
          disableLogic={disableLogic}
          entranceCount={entranceCount}
          entranceName={entranceName}
          key={locationName}
          incrementItem={incrementItem}
          isDungeon={isDungeon}
          isMainDungeon={isMainDungeon}
          locationIcon={locationIcon}
          locationName={locationName}
          numAvailable={numAvailable}
          numRemaining={numRemaining}
          setOpenedLocation={setOpenedLocation}
          setSelectedExit={setSelectedExit}
          setSelectedItem={setSelectedItem}
          setSelectedLocation={setSelectedLocation}
          smallKeyCount={smallKeyCount}
          smallKeyName={smallKeyName}
        />
      );
    }

    return (
      <ExtraLocation
        color={color}
        disableLogic={disableLogic}
        clearSelectedLocation={clearSelectedLocation}
        key={locationName}
        isDungeon={isDungeon}
        isMainDungeon={isMainDungeon}
        locationIcon={locationIcon}
        locationName={locationName}
        numAvailable={numAvailable}
        numRemaining={numRemaining}
        setOpenedLocation={setOpenedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    );
  }

  render() {
    const { singleColorBackground } = this.props;

    return (
      <div className={`extra-locations ${singleColorBackground ? 'single-color' : ''}`}>
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

ExtraLocationsTable.propTypes = {
  clearSelectedExit: PropTypes.func.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  setOpenedLocation: PropTypes.func.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default ExtraLocationsTable;
