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
      clearSelectedItem,
      clearSelectedLocation,
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      setSelectedExit,
      setSelectedItem,
      setSelectedLocation,
      trackerState,
      unsetExit,
      updateOpenedExit,
      updateOpenedLocation,
    } = this.props;

    const isDungeon = LogicHelper.isDungeon(locationName);
    const isMainDungeon = LogicHelper.isMainDungeon(locationName);
    const isRaceModeDungeon = LogicHelper.isRaceModeDungeon(locationName);

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

    if (isRaceModeDungeon) {
      let smallKeyName;
      let smallKeyCount;
      let bigKeyName;
      let bigKeyCount;
      let entryName;
      let entryCount;

      if (isMainDungeon) {
        smallKeyName = LogicHelper.smallKeyName(locationName);
        smallKeyCount = trackerState.getItemValue(smallKeyName);

        bigKeyName = LogicHelper.bigKeyName(locationName);
        bigKeyCount = trackerState.getItemValue(bigKeyName);

        entryName = LogicHelper.entryName(locationName);
        entryCount = trackerState.getItemValue(entryName);
      }

      const dungeonMapName = LogicHelper.dungeonMapName(locationName);
      const dungeonMapCount = trackerState.getItemValue(dungeonMapName);

      const compassName = LogicHelper.compassName(locationName);
      const compassCount = trackerState.getItemValue(compassName);

      return (
        <ExtraLocation
          bigKeyCount={bigKeyCount}
          bigKeyName={bigKeyName}
          clearSelectedItem={clearSelectedItem}
          clearSelectedLocation={clearSelectedLocation}
          color={color}
          compassCount={compassCount}
          compassName={compassName}
          decrementItem={decrementItem}
          disableLogic={disableLogic}
          dungeonMapCount={dungeonMapCount}
          dungeonMapName={dungeonMapName}
          entryCount={entryCount}
          entryName={entryName}
          key={locationName}
          incrementItem={incrementItem}
          isDungeon={isDungeon}
          isMainDungeon={isMainDungeon}
          isRaceModeDungeon={isRaceModeDungeon}
          locationIcon={locationIcon}
          locationName={locationName}
          numAvailable={numAvailable}
          numRemaining={numRemaining}
          setSelectedExit={setSelectedExit}
          setSelectedItem={setSelectedItem}
          setSelectedLocation={setSelectedLocation}
          smallKeyCount={smallKeyCount}
          smallKeyName={smallKeyName}
          unsetExit={unsetExit}
          updateOpenedExit={updateOpenedExit}
          updateOpenedLocation={updateOpenedLocation}
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
        isRaceModeDungeon={isRaceModeDungeon}
        locationIcon={locationIcon}
        locationName={locationName}
        numAvailable={numAvailable}
        numRemaining={numRemaining}
        setSelectedLocation={setSelectedLocation}
        updateOpenedLocation={updateOpenedLocation}
      />
    );
  }

  render() {
    const { backgroundColor } = this.props;

    return (
      <div
        className="extra-locations"
        style={{ backgroundColor }}
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
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default ExtraLocationsTable;
