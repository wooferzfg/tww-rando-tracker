import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Item from './item';

class Sector extends React.Component {
  chestsCounter() {
    const {
      disableLogic,
      island,
      logic,
      onlyProgressLocations,
    } = this.props;

    const {
      color,
      numAvailable,
      numRemaining,
    } = logic.locationCounts(island, {
      isDungeon: false,
      onlyProgressLocations,
      disableLogic,
    });

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
      clearSelectedItem,
      incrementItem,
      island,
      setSelectedItem,
      trackerState,
    } = this.props;

    const {
      chartName,
      chartType,
    } = LogicHelper.chartForIsland(island);

    const chartImages = _.get(Images.IMAGES, ['CHARTS', chartType]);

    return (
      <div className="treasure-chart">
        <Item
          clearSelectedItem={clearSelectedItem}
          images={chartImages}
          incrementItem={incrementItem}
          itemName={chartName}
          setSelectedItem={setSelectedItem}
          trackerState={trackerState}
        />
      </div>
    );
  }

  render() {
    const {
      clearSelectedLocation,
      island,
      setSelectedLocation,
    } = this.props;

    const setSelectedLocationFunc = () => setSelectedLocation(island);

    return (
      <div
        className="sea-sector"
        onBlur={clearSelectedLocation}
        onFocus={setSelectedLocationFunc}
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
  disableLogic: PropTypes.bool.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  island: PropTypes.string.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default Sector;
