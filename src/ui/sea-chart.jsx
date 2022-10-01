import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Sector from './sector';

class SeaChart extends React.PureComponent {
  sector(island) {
    const {
      clearSelectedChartForIsland,
      clearSelectedItem,
      clearSelectedLocation,
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      setSelectedChartForIsland,
      setSelectedExit,
      setSelectedItem,
      setSelectedLocation,
      spheres,
      trackerState,
      trackSpheres,
      unsetChartMapping,
      unsetExit,
      updateOpenedChartForIsland,
      updateOpenedExit,
      updateOpenedLocation,
    } = this.props;

    return (
      <Sector
        clearSelectedChartForIsland={clearSelectedChartForIsland}
        clearSelectedItem={clearSelectedItem}
        clearSelectedLocation={clearSelectedLocation}
        decrementItem={decrementItem}
        disableLogic={disableLogic}
        key={island}
        incrementItem={incrementItem}
        island={island}
        logic={logic}
        onlyProgressLocations={onlyProgressLocations}
        setSelectedChartForIsland={setSelectedChartForIsland}
        setSelectedExit={setSelectedExit}
        setSelectedItem={setSelectedItem}
        setSelectedLocation={setSelectedLocation}
        spheres={spheres}
        trackerState={trackerState}
        trackSpheres={trackSpheres}
        unsetChartMapping={unsetChartMapping}
        unsetExit={unsetExit}
        updateOpenedChartForIsland={updateOpenedChartForIsland}
        updateOpenedExit={updateOpenedExit}
        updateOpenedLocation={updateOpenedLocation}
      />
    );
  }

  render() {
    const islands = _.map(LogicHelper.ISLANDS, (island) => this.sector(island));

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
  clearSelectedChartForIsland: PropTypes.func.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  setSelectedChartForIsland: PropTypes.func.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedChartForIsland: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default SeaChart;
