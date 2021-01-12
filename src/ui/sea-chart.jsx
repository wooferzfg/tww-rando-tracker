import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ISLANDS from '../data/islands.json';
import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Sector from './sector';

class SeaChart extends React.PureComponent {
  sector(island) {
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

    const {
      chartName,
      chartType,
    } = LogicHelper.chartForIsland(island);

    const chartCount = trackerState.getItemValue(chartName);

    let entrances = [];
    if (LogicHelper.isRandomCaveEntrances()) {
      const cavesForIsland = LogicHelper.cavesForIsland(island);

      entrances = _.map(cavesForIsland, (caveName) => {
        const entryName = LogicHelper.entryName(caveName);
        const entryCount = trackerState.getItemValue(entryName);

        return {
          entryCount,
          entryName,
          locationName: caveName,
        };
      });
    }

    const {
      color,
      numAvailable,
      numRemaining,
    } = logic.locationCounts(island, {
      isDungeon: false,
      onlyProgressLocations,
      disableLogic,
    });

    return (
      <Sector
        chartCount={chartCount}
        chartName={chartName}
        chartType={chartType}
        color={color}
        clearSelectedItem={clearSelectedItem}
        clearSelectedLocation={clearSelectedLocation}
        decrementItem={decrementItem}
        disableLogic={disableLogic}
        entrances={entrances}
        key={island}
        incrementItem={incrementItem}
        island={island}
        numAvailable={numAvailable}
        numRemaining={numRemaining}
        setSelectedExit={setSelectedExit}
        setSelectedItem={setSelectedItem}
        setSelectedLocation={setSelectedLocation}
        unsetExit={unsetExit}
        updateOpenedExit={updateOpenedExit}
        updateOpenedLocation={updateOpenedLocation}
      />
    );
  }

  render() {
    const islands = _.map(ISLANDS, (island) => this.sector(island));

    return (
      <div className="chart-map">
        <div className="chart-map-background">
          <img src={Images.IMAGES.SEA_CHART} alt="" />
        </div>
        <div className="maps">
          {islands}
        </div>
      </div>
    );
  }
}

SeaChart.propTypes = {
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

export default SeaChart;
