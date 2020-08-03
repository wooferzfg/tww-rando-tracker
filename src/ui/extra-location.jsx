import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Images from './images';
import Item from './item';

class ExtraLocation extends React.PureComponent {
  smallKeyItem() {
    const {
      clearSelectedItem,
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
      incrementItem,
      setSelectedItem,
    } = this.props;

    const bigKeyImages = _.get(Images.IMAGES, 'BIG_KEYS');

    return (
      <div className="dungeon-item big-key">
        <Item
          clearSelectedItem={clearSelectedItem}
          images={bigKeyImages}
          incrementItem={incrementItem}
          itemCount={bigKeyCount}
          itemName={bigKeyName}
          setSelectedItem={setSelectedItem}
        />
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
        <img src={locationIcon} alt={locationName} />
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
      isMainDungeon,
      locationName,
      setOpenedLocation,
      setSelectedLocation,
    } = this.props;

    const setOpenedLocationFunc = () => setOpenedLocation({
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
        onClick={setOpenedLocationFunc}
        onFocus={setSelectedLocationFunc}
        onKeyDown={setOpenedLocationFunc}
        onMouseOver={setSelectedLocationFunc}
        onMouseOut={clearSelectedLocation}
        role="button"
        tabIndex="0"
      >
        {isMainDungeon && (
          <div className="dungeon-items">
            {this.smallKeyItem()}
            {this.bigKeyItem()}
          </div>
        )}
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
  incrementItem: null,
  setSelectedItem: null,
  smallKeyCount: null,
  smallKeyName: null,
};

ExtraLocation.propTypes = {
  bigKeyCount: PropTypes.number,
  bigKeyName: PropTypes.string,
  clearSelectedItem: PropTypes.func,
  color: PropTypes.string.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  incrementItem: PropTypes.func,
  isDungeon: PropTypes.bool.isRequired,
  isMainDungeon: PropTypes.bool.isRequired,
  locationIcon: PropTypes.string.isRequired,
  locationName: PropTypes.string.isRequired,
  numAvailable: PropTypes.number.isRequired,
  numRemaining: PropTypes.number.isRequired,
  setOpenedLocation: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func,
  setSelectedLocation: PropTypes.func.isRequired,
  smallKeyCount: PropTypes.number,
  smallKeyName: PropTypes.string,
};

export default ExtraLocation;
