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

  render() {
    const {
      clearSelectedLocation,
      island,
      setOpenedLocation,
      setSelectedLocation,
    } = this.props;

    const setOpenedLocationFunc = () => setOpenedLocation({
      isDungeon: false,
      locationName: island,
    });

    const setSelectedLocationFunc = () => setSelectedLocation({
      isDungeon: false,
      locationName: island,
    });

    return (
      <div
        className="sea-sector"
        onBlur={clearSelectedLocation}
        onClick={setOpenedLocationFunc}
        onFocus={setSelectedLocationFunc}
        onKeyDown={setOpenedLocationFunc}
        onMouseOver={setSelectedLocationFunc}
        onMouseOut={clearSelectedLocation}
        role="button"
        tabIndex="0"
      >
        {this.chartItem()}
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
  disableLogic: PropTypes.bool.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  island: PropTypes.string.isRequired,
  numAvailable: PropTypes.number.isRequired,
  numRemaining: PropTypes.number.isRequired,
  setOpenedLocation: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
};

export default Sector;
