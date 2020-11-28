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

  chartItem() {
    const {
      chartCount,
      chartName,
      chartType,
      clearSelectedItem,
      incrementItem,
      setSelectedItem,
    } = this.props;

    const chartImages = _.get(Images.IMAGES, ['CHARTS', chartType]);

    return (
      <div className="treasure-chart">
        <Item
          clearSelectedItem={clearSelectedItem}
          images={chartImages}
          incrementItem={incrementItem}
          itemCount={chartCount}
          itemName={chartName}
          setSelectedItem={setSelectedItem}
        />
      </div>
    );
  }

  entryItems() {
    const {
      clearSelectedExit,
      entrances,
      setSelectedExit,
    } = this.props;

    return _.map(entrances, (entrance) => {
      const {
        entryCount,
        entryName,
        locationName,
      } = entrance;

      const entranceImages = _.get(Images.IMAGES, 'CAVE_ENTRANCE');

      const setSelectedItemFunc = () => setSelectedExit(locationName);

      const incrementItemFunc = () => {};

      return (
        <div className="cave-entry" key={entryName}>
          <Item
            clearSelectedItem={clearSelectedExit}
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
        {this.chartItem()}
        {this.entryItems()}
        {this.chestsCounter()}
      </div>
    );
  }
}

Sector.propTypes = {
  chartCount: PropTypes.number.isRequired,
  chartName: PropTypes.string.isRequired,
  chartType: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  clearSelectedExit: PropTypes.func.isRequired,
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
  incrementItem: PropTypes.func.isRequired,
  island: PropTypes.string.isRequired,
  numAvailable: PropTypes.number.isRequired,
  numRemaining: PropTypes.number.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default Sector;
