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
      clearAllLocations,
      clearSelectedChartForIsland,
      clearSelectedItem,
      clearSelectedLocation,
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      rightClickToClearAll,
      setSelectedChartForIsland,
      setSelectedEntrance,
      setSelectedExit,
      setSelectedItem,
      setSelectedLocation,
      spheres,
      trackerState,
      trackNonProgressCharts,
      trackSpheres,
      unsetChartMapping,
      unsetEntrance,
      unsetExit,
      updateOpenedChartForIsland,
      updateOpenedEntrance,
      updateOpenedExit,
      updateOpenedLocation,
      viewingEntrances,
    } = this.props;

    return (
      <Sector
        clearAllLocations={clearAllLocations}
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
        rightClickToClearAll={rightClickToClearAll}
        setSelectedChartForIsland={setSelectedChartForIsland}
        setSelectedEntrance={setSelectedEntrance}
        setSelectedExit={setSelectedExit}
        setSelectedItem={setSelectedItem}
        setSelectedLocation={setSelectedLocation}
        spheres={spheres}
        trackerState={trackerState}
        trackNonProgressCharts={trackNonProgressCharts}
        trackSpheres={trackSpheres}
        unsetChartMapping={unsetChartMapping}
        unsetEntrance={unsetEntrance}
        unsetExit={unsetExit}
        updateOpenedChartForIsland={updateOpenedChartForIsland}
        updateOpenedEntrance={updateOpenedEntrance}
        updateOpenedExit={updateOpenedExit}
        updateOpenedLocation={updateOpenedLocation}
        viewingEntrances={viewingEntrances}
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
  clearAllLocations: PropTypes.func.isRequired,
  clearSelectedChartForIsland: PropTypes.func.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  rightClickToClearAll: PropTypes.bool.isRequired,
  setSelectedChartForIsland: PropTypes.func.isRequired,
  setSelectedEntrance: PropTypes.func.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
  unsetEntrance: PropTypes.func.isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedChartForIsland: PropTypes.func.isRequired,
  updateOpenedEntrance: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
  viewingEntrances: PropTypes.bool.isRequired,
};

export default SeaChart;
