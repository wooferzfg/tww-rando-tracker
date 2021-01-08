import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Images from './images';
import Item from './item';

class Sector extends React.PureComponent {
  chestsCounter() {
    const {
      color,
      disableLogic,
      numAvailable,
      numRemaining,
    } = this.props;

    const className = `chests-counter ${color}`;
    const chestCounts = disableLogic ? numRemaining : `${numAvailable}/${numRemaining}`;

    return (
      <div className={className}>
        {chestCounts}
      </div>
    );
  }

  entryItems() {
    const {
      clearSelectedItem,
      clearSelectedLocation,
      entrances,
      setSelectedExit,
      unsetExit,
      updateOpenedExit,
    } = this.props;

    return _.map(entrances, (entrance) => {
      const {
        entryCount,
        entryName,
        locationName,
      } = entrance;

      const entranceImages = _.get(Images.IMAGES, 'CAVE_ENTRANCE');

      const setSelectedItemFunc = () => setSelectedExit(locationName);

      const incrementItemFunc = () => {
        if (entryCount > 0) {
          unsetExit(locationName);
        } else {
          clearSelectedItem();
          clearSelectedLocation();

          updateOpenedExit(locationName);
        }
      };

      return (
        <div className="cave-entry" key={entryName}>
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
    });
  }

  render() {
    const {
      clearSelectedLocation,
      island,
      setSelectedLocation,
      updateOpenedLocation,
    } = this.props;

    const updateOpenedLocationFunc = () => {
      clearSelectedLocation();

      updateOpenedLocation({
        isDungeon: false,
        locationName: island,
      });
    };

    const setSelectedLocationFunc = () => setSelectedLocation({
      isDungeon: false,
      locationName: island,
    });

    return (
      <div
        className="sea-sector"
        onBlur={clearSelectedLocation}
        onClick={updateOpenedLocationFunc}
        onFocus={setSelectedLocationFunc}
        onKeyDown={updateOpenedLocationFunc}
        onMouseOver={setSelectedLocationFunc}
        onMouseOut={clearSelectedLocation}
        role="button"
        tabIndex="0"
      >
        {this.entryItems()}
        {this.chestsCounter()}
      </div>
    );
  }
}

Sector.propTypes = {
  color: PropTypes.string.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  entrances: PropTypes.arrayOf(
    PropTypes.shape({
      entryCount: PropTypes.number,
      entryName: PropTypes.string,
      locationName: PropTypes.string,
    }),
  ).isRequired,
  island: PropTypes.string.isRequired,
  numAvailable: PropTypes.number.isRequired,
  numRemaining: PropTypes.number.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default Sector;
