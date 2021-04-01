import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';

import Images from './images';
import Item from './item';
import KeyDownWrapper from './key-down-wrapper';

class ExtraLocation extends React.PureComponent {
  compassItem() {
    const {
      clearSelectedItem,
      compassCount,
      compassName,
      decrementItem,
      incrementItem,
      setSelectedItem,
    } = this.props;

    const dungeonMapImages = _.get(Images.IMAGES, 'COMPASSES');

    return (
      <div className="dungeon-item compass">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={dungeonMapImages}
          incrementItem={incrementItem}
          itemCount={compassCount}
          itemName={compassName}
          setSelectedItem={setSelectedItem}
        />
      </div>
    );
  }

  dungeonMapItem() {
    const {
      clearSelectedItem,
      decrementItem,
      dungeonMapCount,
      dungeonMapName,
      incrementItem,
      setSelectedItem,
    } = this.props;

    const dungeonMapImages = _.get(Images.IMAGES, 'DUNGEON_MAPS');

    return (
      <div className="dungeon-item dungeon-map">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={dungeonMapImages}
          incrementItem={incrementItem}
          itemCount={dungeonMapCount}
          itemName={dungeonMapName}
          setSelectedItem={setSelectedItem}
        />
      </div>
    );
  }

  smallKeyItem() {
    const {
      clearSelectedItem,
      decrementItem,
      incrementItem,
      setSelectedItem,
      smallKeyCount,
      smallKeyName,
    } = this.props;

    const smallKeyImages = _.get(Images.IMAGES, 'SMALL_KEYS');

    return (
      <div className="dungeon-item small-key">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={smallKeyImages}
          incrementItem={incrementItem}
          itemCount={smallKeyCount}
          itemName={smallKeyName}
          setSelectedItem={setSelectedItem}
        />
      </div>
    );
  }

  bigKeyItem() {
    const {
      bigKeyCount,
      bigKeyName,
      clearSelectedItem,
      decrementItem,
      incrementItem,
      setSelectedItem,
    } = this.props;

    const bigKeyImages = _.get(Images.IMAGES, 'BIG_KEYS');

    return (
      <div className="dungeon-item big-key">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={bigKeyImages}
          incrementItem={incrementItem}
          itemCount={bigKeyCount}
          itemName={bigKeyName}
          setSelectedItem={setSelectedItem}
        />
      </div>
    );
  }

  entrance() {
    const {
      clearSelectedItem,
      entryCount,
      entryName,
      locationName,
      setSelectedExit,
      unsetExit,
      updateOpenedExit,
    } = this.props;

    const entranceImages = _.get(Images.IMAGES, 'DUNGEON_ENTRANCE');

    const setSelectedItemFunc = () => setSelectedExit(locationName);

    const incrementItemFunc = () => {
      if (entryCount > 0) {
        unsetExit(locationName);
      } else {
        updateOpenedExit(locationName);
      }
    };

    return (
      <div className="dungeon-item dungeon-entry">
        <Item
          clearSelectedItem={clearSelectedItem}
          images={entranceImages}
          incrementItem={incrementItemFunc}
          itemCount={entryCount}
          itemName={entryName}
          setSelectedItem={setSelectedItemFunc}
        />
      </div>
    );
  }

  dungeonItems() {
    const {
      isMainDungeon,
      isRaceModeDungeon,
    } = this.props;

    return (
      <div className="dungeon-items">
        { isMainDungeon && (
          <>
            {this.smallKeyItem()}
            { LogicHelper.isRandomDungeonEntrances() && this.entrance() }
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
      locationIcon,
      locationName,
    } = this.props;

    return (
      <div className="dungeon-icon">
        <img src={locationIcon} alt={locationName} draggable={false} />
      </div>
    );
  }

  chestsCounter() {
    const {
      color,
      disableLogic,
      numAvailable,
      numRemaining,
    } = this.props;

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

    const setSelectedLocationFunc = () => setSelectedLocation({
      isDungeon,
      locationName,
    });

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
      >
        {this.dungeonItems()}
        {this.locationIcon()}
        {this.chestsCounter()}
      </div>
    );
  }
}

ExtraLocation.defaultProps = {
  bigKeyCount: null,
  bigKeyName: null,
  clearSelectedItem: null,
  compassCount: null,
  compassName: null,
  decrementItem: null,
  dungeonMapCount: null,
  dungeonMapName: null,
  entryCount: null,
  entryName: null,
  incrementItem: null,
  setSelectedExit: null,
  setSelectedItem: null,
  smallKeyCount: null,
  smallKeyName: null,
  unsetExit: null,
  updateOpenedExit: null,
};

ExtraLocation.propTypes = {
  bigKeyCount: PropTypes.number,
  bigKeyName: PropTypes.string,
  clearSelectedItem: PropTypes.func,
  clearSelectedLocation: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  compassCount: PropTypes.number,
  compassName: PropTypes.string,
  decrementItem: PropTypes.func,
  disableLogic: PropTypes.bool.isRequired,
  dungeonMapCount: PropTypes.number,
  dungeonMapName: PropTypes.string,
  entryCount: PropTypes.number,
  entryName: PropTypes.string,
  incrementItem: PropTypes.func,
  isDungeon: PropTypes.bool.isRequired,
  isMainDungeon: PropTypes.bool.isRequired,
  isRaceModeDungeon: PropTypes.bool.isRequired,
  locationIcon: PropTypes.string.isRequired,
  locationName: PropTypes.string.isRequired,
  numAvailable: PropTypes.number.isRequired,
  numRemaining: PropTypes.number.isRequired,
  setSelectedExit: PropTypes.func,
  setSelectedItem: PropTypes.func,
  setSelectedLocation: PropTypes.func.isRequired,
  smallKeyCount: PropTypes.number,
  smallKeyName: PropTypes.string,
  unsetExit: PropTypes.func,
  updateOpenedExit: PropTypes.func,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default ExtraLocation;
