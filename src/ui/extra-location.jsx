import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Item from './item';
import KeyDownWrapper from './key-down-wrapper';

class ExtraLocation extends React.PureComponent {
  static NUM_CONSISTENT_ITEMS = 4;

  static ITEM_WIDTH = 24;

  static EXTRA_WIDTH = 10;

  static MIN_WIDTH = 120;

  static getWidth() {
    const numItems = this.NUM_CONSISTENT_ITEMS
      + (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES) ? 1 : 0)
      + (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES) ? 1 : 0)
      + (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES) ? 1 : 0);

    return Math.max(this.ITEM_WIDTH * numItems + this.EXTRA_WIDTH, this.MIN_WIDTH);
  }

  compassItem() {
    const {
      clearSelectedItem,
      decrementItem,
      incrementItem,
      locationName,
      setSelectedItem,
      spheres,
      trackerState,
      trackSpheres,
    } = this.props;

    const compassName = LogicHelper.compassName(locationName);
    const compassCount = trackerState.getItemValue(compassName);

    let locations = [];
    if (trackSpheres) {
      locations = trackerState.getLocationsForItem(compassName);
    }

    return (
      <div className="dungeon-item compass">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={Images.IMAGES.COMPASSES}
          incrementItem={incrementItem}
          itemCount={compassCount}
          itemName={compassName}
          locations={locations}
          setSelectedItem={setSelectedItem}
          spheres={spheres}
        />
      </div>
    );
  }

  dungeonMapItem() {
    const {
      clearSelectedItem,
      decrementItem,
      incrementItem,
      locationName,
      setSelectedItem,
      spheres,
      trackerState,
      trackSpheres,
    } = this.props;

    const dungeonMapName = LogicHelper.dungeonMapName(locationName);
    const dungeonMapCount = trackerState.getItemValue(dungeonMapName);

    let locations = [];
    if (trackSpheres) {
      locations = trackerState.getLocationsForItem(dungeonMapName);
    }

    return (
      <div className="dungeon-item dungeon-map">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={Images.IMAGES.DUNGEON_MAPS}
          incrementItem={incrementItem}
          itemCount={dungeonMapCount}
          itemName={dungeonMapName}
          locations={locations}
          setSelectedItem={setSelectedItem}
          spheres={spheres}
        />
      </div>
    );
  }

  smallKeyItem() {
    const {
      clearSelectedItem,
      decrementItem,
      incrementItem,
      locationName,
      setSelectedItem,
      spheres,
      trackerState,
      trackSpheres,
    } = this.props;

    const smallKeyName = LogicHelper.smallKeyName(locationName);
    const smallKeyCount = trackerState.getItemValue(smallKeyName);

    let locations = [];
    if (trackSpheres) {
      locations = trackerState.getLocationsForItem(smallKeyName);
    }

    return (
      <div className="dungeon-item small-key">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={Images.IMAGES.SMALL_KEYS}
          incrementItem={incrementItem}
          itemCount={smallKeyCount}
          itemName={smallKeyName}
          locations={locations}
          setSelectedItem={setSelectedItem}
          spheres={spheres}
        />
      </div>
    );
  }

  bigKeyItem() {
    const {
      clearSelectedItem,
      decrementItem,
      incrementItem,
      locationName,
      setSelectedItem,
      spheres,
      trackerState,
      trackSpheres,
    } = this.props;

    const bigKeyName = LogicHelper.bigKeyName(locationName);
    const bigKeyCount = trackerState.getItemValue(bigKeyName);

    let locations = [];
    if (trackSpheres) {
      locations = trackerState.getLocationsForItem(bigKeyName);
    }

    return (
      <div className="dungeon-item big-key">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={Images.IMAGES.BIG_KEYS}
          incrementItem={incrementItem}
          itemCount={bigKeyCount}
          itemName={bigKeyName}
          locations={locations}
          setSelectedItem={setSelectedItem}
          spheres={spheres}
        />
      </div>
    );
  }

  entrance(zoneName) {
    const {
      clearSelectedItem,
      setSelectedExit,
      trackerState,
      unsetExit,
      updateOpenedExit,
    } = this.props;

    const entryName = LogicHelper.entryName(zoneName);
    const entryCount = trackerState.getItemValue(entryName);

    const setSelectedItemFunc = () => setSelectedExit(zoneName);

    const incrementItemFunc = () => {
      if (entryCount > 0) {
        unsetExit(zoneName);
      } else {
        updateOpenedExit(zoneName);
      }
    };

    return (
      <div className="dungeon-item dungeon-entry" key={zoneName}>
        <Item
          clearSelectedItem={clearSelectedItem}
          images={Images.IMAGES.DUNGEON_ENTRANCE}
          incrementItem={incrementItemFunc}
          itemCount={entryCount}
          itemName={entryName}
          setSelectedItem={setSelectedItemFunc}
        />
      </div>
    );
  }

  dungeonItems() {
    const { locationName } = this.props;

    const entrances = LogicHelper.entrancesForDungeon(locationName);
    const entranceElements = _.map(entrances, (entrance) => this.entrance(entrance));

    const isMainDungeon = LogicHelper.isMainDungeon(locationName);
    const isRaceModeDungeon = LogicHelper.isRaceModeDungeon(locationName);

    return (
      <div className="dungeon-items">
        {entranceElements}
        { isMainDungeon && (
          <>
            {this.smallKeyItem()}
            {this.bigKeyItem()}
          </>
        )}
        { isRaceModeDungeon && (
          <>
            {this.dungeonMapItem()}
            {this.compassItem()}
          </>
        )}
      </div>
    );
  }

  locationIcon() {
    const {
      isDungeon,
      locationName,
      logic,
    } = this.props;

    let locationIcon;
    if (isDungeon) {
      const isBossDefeated = logic.isBossDefeated(locationName);

      locationIcon = _.get(Images.IMAGES, ['DUNGEONS', locationName, isBossDefeated]);
    } else {
      locationIcon = _.get(Images.IMAGES, ['MISC_LOCATIONS', locationName]);
    }

    return (
      <div className="dungeon-icon">
        <img src={locationIcon} alt={locationName} draggable={false} />
      </div>
    );
  }

  chestsCounter() {
    const {
      disableLogic,
      isDungeon,
      locationName,
      logic,
      onlyProgressLocations,
    } = this.props;

    const {
      color,
      numAvailable,
      numRemaining,
    } = logic.locationCounts(locationName, {
      isDungeon,
      onlyProgressLocations,
      disableLogic,
    });

    const className = `extra-location-chests ${color}`;
    const chestCounts = disableLogic ? numRemaining : `${numAvailable}/${numRemaining}`;

    return (
      <div className={className}>
        {chestCounts}
      </div>
    );
  }

  render() {
    const {
      clearSelectedLocation,
      isDungeon,
      locationName,
      setSelectedLocation,
      updateOpenedLocation,
    } = this.props;

    const updateOpenedLocationFunc = () => updateOpenedLocation({
      isDungeon,
      locationName,
    });

    const setSelectedLocationFunc = () => setSelectedLocation({ locationName });

    return (
      <div
        className="extra-location"
        onBlur={clearSelectedLocation}
        onClick={updateOpenedLocationFunc}
        onFocus={setSelectedLocationFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateOpenedLocationFunc)}
        onMouseOver={setSelectedLocationFunc}
        onMouseOut={clearSelectedLocation}
        role="button"
        tabIndex="0"
        style={{ width: ExtraLocation.getWidth() }}
      >
        {this.dungeonItems()}
        {this.locationIcon()}
        {this.chestsCounter()}
      </div>
    );
  }
}

ExtraLocation.propTypes = {
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  isDungeon: PropTypes.bool.isRequired,
  locationName: PropTypes.string.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default ExtraLocation;
