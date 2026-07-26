import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Hints from '../services/hints';
import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import ContextMenuWrapper from './context-menu-wrapper';
import Images from './images';
import Item from './item';
import KeyDownWrapper from './key-down-wrapper';
import MiddleClickWrapper from './middle-click-wrapper';
import RequirementsTooltip from './requirements-tooltip';
import Tooltip from './tooltip';

class ExtraLocation extends React.PureComponent {
  static NUM_CONSISTENT_ITEMS = 4;

  static ITEM_WIDTH = 24;

  static EXTRA_WIDTH = 10;

  static MIN_WIDTH = 120;

  static #COLOR_TO_COUNT_MAPPING = {
    [LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION]: 0,
    [LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION]: 1,
    [LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION]: 2,
  };

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
      selectHintItem,
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
          selectHintItem={selectHintItem}
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
      selectHintItem,
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
          selectHintItem={selectHintItem}
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
      selectHintItem,
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
          selectHintItem={selectHintItem}
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
      selectHintItem,
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
          selectHintItem={selectHintItem}
          setSelectedItem={setSelectedItem}
          spheres={spheres}
        />
      </div>
    );
  }

  dungeonEntrance(entranceInfo) {
    const {
      entrance,
      color,
    } = entranceInfo;

    const {
      clearSelectedItem,
      disableLogic,
      logic,
      setSelectedEntrance,
      trackerState,
      unsetEntrance,
      updateOpenedEntrance,
    } = this.props;

    const itemCount = ExtraLocation.#COLOR_TO_COUNT_MAPPING[color];
    const shortEntranceName = LogicHelper.shortEntranceName(entrance);

    const setSelectedItemFunc = () => setSelectedEntrance(entrance);

    const incrementItemFunc = () => {
      const isEntranceChecked = trackerState.isEntranceChecked(entrance);

      if (isEntranceChecked) {
        unsetEntrance(entrance);
      } else {
        updateOpenedEntrance(entrance);
      }
    };

    let entranceElement = (
      <Item
        clearSelectedItem={clearSelectedItem}
        images={Images.IMAGES.DUNGEON_ENTRANCE}
        incrementItem={incrementItemFunc}
        itemCount={itemCount}
        itemName={shortEntranceName}
        setSelectedItem={setSelectedItemFunc}
      />
    );

    if (!disableLogic && color !== LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION) {
      const requirements = logic.formattedRequirementsForEntrance(entrance);
      const requirementsTooltip = (
        <RequirementsTooltip requirements={requirements} />
      );
      entranceElement = (
        <Tooltip tooltipContent={requirementsTooltip}>
          {entranceElement}
        </Tooltip>
      );
    }

    return (
      <div className="dungeon-item dungeon-entry" key={entrance}>
        {entranceElement}
      </div>
    );
  }

  dungeonExit(exitName) {
    const {
      clearSelectedItem,
      setSelectedExit,
      trackerState,
      unsetExit,
      updateOpenedExit,
    } = this.props;

    const entryName = LogicHelper.entryName(exitName);
    const entryCount = trackerState.getItemValue(entryName);

    const setSelectedItemFunc = () => setSelectedExit(exitName);

    const incrementItemFunc = () => {
      if (entryCount > 0) {
        unsetExit(exitName);
      } else {
        updateOpenedExit(exitName);
      }
    };

    return (
      <div className="dungeon-item dungeon-entry" key={exitName}>
        <Item
          clearSelectedItem={clearSelectedItem}
          images={Images.IMAGES.DUNGEON_EXIT}
          incrementItem={incrementItemFunc}
          itemCount={entryCount}
          itemName={entryName}
          setSelectedItem={setSelectedItemFunc}
        />
      </div>
    );
  }

  entranceExitItems() {
    const {
      disableLogic,
      locationName,
      logic,
      viewingEntrances,
    } = this.props;

    if (viewingEntrances) {
      const dungeonEntrances = logic.entrancesListForDungeon(locationName, { disableLogic });
      return _.map(dungeonEntrances, (dungeonEntrance) => this.dungeonEntrance(dungeonEntrance));
    }

    const dungeonExits = LogicHelper.exitsForDungeon(locationName);
    return _.map(dungeonExits, (dungeonExit) => this.dungeonExit(dungeonExit));
  }

  dungeonItems() {
    const { locationName } = this.props;

    const isMainDungeon = LogicHelper.isMainDungeon(locationName);
    const isRequiredBossesModeDungeon = LogicHelper.isRequiredBossesModeDungeon(locationName);

    return (
      <div className="dungeon-items">
        {this.entranceExitItems()}
        { isMainDungeon && (
          <>
            {this.smallKeyItem()}
            {this.bigKeyItem()}
          </>
        )}
        { isRequiredBossesModeDungeon && (
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
      selectHintGoal,
      selectingHintGoal,
    } = this.props;

    let locationIcon;
    if (isDungeon) {
      const isBossDefeated = logic.isBossDefeated(locationName);

      locationIcon = _.get(Images.IMAGES, ['DUNGEONS', locationName, isBossDefeated]);
    } else {
      locationIcon = _.get(Images.IMAGES, ['MISC_LOCATIONS', locationName]);
    }

    const image = <img src={locationIcon} alt={locationName} draggable={false} />;

    // In hint mode, the boss picture selects the goal of a path hint, while the
    // rest of the tile still opens the location.
    if (!selectingHintGoal || !Hints.isGoal(locationName)) {
      return (
        <div className="dungeon-icon">
          {image}
        </div>
      );
    }

    const selectHintGoalFunc = (event) => {
      event.stopPropagation();

      selectHintGoal(locationName);
    };

    return (
      <div
        className="dungeon-icon hint-goal"
        onClick={selectHintGoalFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(selectHintGoalFunc)}
        role="button"
        tabIndex="0"
      >
        {image}
      </div>
    );
  }

  chestsCounter() {
    const {
      disableLogic,
      locationName,
      logic,
      onlyProgressLocations,
    } = this.props;

    const {
      color,
      numAvailable,
      numRemaining,
    } = logic.locationCounts(locationName, {
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
      clearAllLocations,
      clearSelectedLocation,
      isDungeon,
      locationName,
      rightClickToClearAll,
      selectHintGoal,
      selectHintLocation,
      setSelectedLocation,
      updateOpenedLocation,
    } = this.props;

    const updateOpenedLocationFunc = () => updateOpenedLocation({
      isDungeon,
      locationName,
    });

    // Middle clicking a dungeon picks its boss, so that a path hint can be
    // started without entering hint mode first.
    const selectHintFunc = () => {
      if (Hints.isGoal(locationName)) {
        selectHintGoal(locationName, true);
      } else {
        selectHintLocation(locationName, null, true);
      }
    };

    const setSelectedLocationFunc = () => setSelectedLocation({ locationName });

    const clearAllLocationsFunc = (event) => {
      event.preventDefault();

      if (rightClickToClearAll) {
        clearAllLocations(locationName);
      }
    };

    return (
      <div
        className="extra-location"
        onAuxClick={MiddleClickWrapper.onMiddleClick(selectHintFunc)}
        onBlur={clearSelectedLocation}
        onClick={updateOpenedLocationFunc}
        onContextMenu={ContextMenuWrapper.onRightClick(clearAllLocationsFunc)}
        onFocus={setSelectedLocationFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateOpenedLocationFunc)}
        onMouseDown={MiddleClickWrapper.preventAutoScroll}
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
  clearAllLocations: PropTypes.func.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  isDungeon: PropTypes.bool.isRequired,
  locationName: PropTypes.string.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  rightClickToClearAll: PropTypes.bool.isRequired,
  setSelectedEntrance: PropTypes.func.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  selectHintGoal: PropTypes.func.isRequired,
  selectHintItem: PropTypes.func.isRequired,
  selectHintLocation: PropTypes.func.isRequired,
  selectingHintGoal: PropTypes.bool.isRequired,
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

export default ExtraLocation;
