import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import ChartList from './chart-list';
import DetailedLocationsTable from './detailed-locations-table';
import EntranceSelection from './entrance-selection';
import ExitSelection from './exit-selection';
import ExtraLocationsTable from './extra-locations-table';
import MapInfo from './map-info';
import SeaChart from './sea-chart';

class LocationsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedChartForIsland: null,
      selectedEntrance: null,
      selectedExit: null,
      selectedItem: null,
      selectedLocation: null,
    };

    this.setSelectedChartForIsland = this.setSelectedChartForIsland.bind(this);
    this.clearSelectedChartForIsland = this.clearSelectedChartForIsland.bind(this);
    this.setSelectedEntrance = this.setSelectedEntrance.bind(this);
    this.setSelectedExit = this.setSelectedExit.bind(this);
    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
    this.setSelectedLocation = this.setSelectedLocation.bind(this);
    this.clearSelectedLocation = this.clearSelectedLocation.bind(this);
  }

  setSelectedChartForIsland(chartForIsland) {
    this.setState({ selectedChartForIsland: chartForIsland });
  }

  setSelectedEntrance(entranceName) {
    this.setState({ selectedEntrance: entranceName });
  }

  setSelectedExit(exitName) {
    this.setState({ selectedExit: exitName });
  }

  setSelectedItem(itemName) {
    this.setState({ selectedItem: itemName });
  }

  setSelectedLocation({ locationName }) {
    this.setState({
      selectedLocation: locationName,
    });
  }

  clearSelectedChartForIsland() {
    this.setState({
      selectedChartForIsland: null,
    });
  }

  clearSelectedItem() {
    this.setState({
      selectedEntrance: null,
      selectedExit: null,
      selectedItem: null,
    });
  }

  clearSelectedLocation() {
    this.setState({ selectedLocation: null });
  }

  chartContainer() {
    const {
      chartListOpen,
      clearAllLocations,
      clearOpenedMenus,
      toggleRequiredBoss,
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      openedChartForIsland,
      openedEntrance,
      openedExit,
      openedLocation,
      openedLocationIsDungeon,
      rightClickToClearAll,
      spheres,
      toggleLocationChecked,
      trackerState,
      trackNonProgressCharts,
      trackSpheres,
      unsetChartMapping,
      unsetEntrance,
      unsetExit,
      updateChartMapping,
      updateExitForEntrance,
      updateOpenedChartForIsland,
      updateOpenedEntrance,
      updateOpenedExit,
      updateOpenedLocation,
      viewingEntrances,
    } = this.props;

    const {
      selectedChartForIsland,
      selectedEntrance,
      selectedExit,
      selectedItem,
      selectedLocation,
    } = this.state;

    let chartElement;
    if (openedChartForIsland || chartListOpen) {
      chartElement = (
        <ChartList
          clearOpenedMenus={clearOpenedMenus}
          incrementItem={incrementItem}
          openedChartForIsland={openedChartForIsland}
          spheres={spheres}
          trackerState={trackerState}
          trackNonProgressCharts={trackNonProgressCharts}
          trackSpheres={trackSpheres}
          updateChartMapping={updateChartMapping}
          unsetChartMapping={unsetChartMapping}
        />
      );
    } else if (!_.isNil(openedEntrance)) {
      chartElement = (
        <ExitSelection
          clearOpenedMenus={clearOpenedMenus}
          logic={logic}
          openedEntrance={openedEntrance}
          trackerState={trackerState}
          updateExitForEntrance={updateExitForEntrance}
        />
      );
    } else if (!_.isNil(openedExit)) {
      chartElement = (
        <EntranceSelection
          clearOpenedMenus={clearOpenedMenus}
          disableLogic={disableLogic}
          logic={logic}
          openedExit={openedExit}
          trackerState={trackerState}
          updateExitForEntrance={updateExitForEntrance}
        />
      );
    } else if (!_.isNil(openedLocation)) {
      chartElement = (
        <DetailedLocationsTable
          clearAllLocations={clearAllLocations}
          clearOpenedMenus={clearOpenedMenus}
          disableLogic={disableLogic}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          openedLocation={openedLocation}
          openedLocationIsDungeon={openedLocationIsDungeon}
          spheres={spheres}
          toggleRequiredBoss={toggleRequiredBoss}
          trackerState={trackerState}
          trackSpheres={trackSpheres}
          toggleLocationChecked={toggleLocationChecked}
        />
      );
    } else {
      chartElement = (
        <SeaChart
          clearAllLocations={clearAllLocations}
          clearSelectedChartForIsland={this.clearSelectedChartForIsland}
          clearSelectedItem={this.clearSelectedItem}
          clearSelectedLocation={this.clearSelectedLocation}
          decrementItem={decrementItem}
          disableLogic={disableLogic}
          incrementItem={incrementItem}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          rightClickToClearAll={rightClickToClearAll}
          setSelectedChartForIsland={this.setSelectedChartForIsland}
          setSelectedEntrance={this.setSelectedEntrance}
          setSelectedExit={this.setSelectedExit}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
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

    return (
      <div className="chart-map-container">
        {chartElement}
        <MapInfo
          disableLogic={disableLogic}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          selectedChartForIsland={selectedChartForIsland}
          selectedEntrance={selectedEntrance}
          selectedExit={selectedExit}
          selectedItem={selectedItem}
          selectedLocation={selectedLocation}
          trackerState={trackerState}
        />
      </div>
    );
  }

  render() {
    const {
      backgroundColor,
      clearAllLocations,
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      rightClickToClearAll,
      spheres,
      trackerState,
      trackSpheres,
      unsetEntrance,
      unsetExit,
      updateOpenedEntrance,
      updateOpenedExit,
      updateOpenedLocation,
      viewingEntrances,
    } = this.props;

    return (
      <>
        {this.chartContainer()}
        <ExtraLocationsTable
          backgroundColor={backgroundColor}
          clearAllLocations={clearAllLocations}
          clearSelectedItem={this.clearSelectedItem}
          clearSelectedLocation={this.clearSelectedLocation}
          decrementItem={decrementItem}
          disableLogic={disableLogic}
          incrementItem={incrementItem}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          rightClickToClearAll={rightClickToClearAll}
          setSelectedEntrance={this.setSelectedEntrance}
          setSelectedExit={this.setSelectedExit}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
          spheres={spheres}
          trackerState={trackerState}
          trackSpheres={trackSpheres}
          unsetEntrance={unsetEntrance}
          unsetExit={unsetExit}
          updateOpenedEntrance={updateOpenedEntrance}
          updateOpenedExit={updateOpenedExit}
          updateOpenedLocation={updateOpenedLocation}
          viewingEntrances={viewingEntrances}
        />
      </>
    );
  }
}

LocationsTable.defaultProps = {
  backgroundColor: null,
  openedChartForIsland: null,
  openedEntrance: null,
  openedExit: null,
  openedLocation: null,
  openedLocationIsDungeon: null,
};

LocationsTable.propTypes = {
  backgroundColor: PropTypes.string,
  chartListOpen: PropTypes.bool.isRequired,
  clearAllLocations: PropTypes.func.isRequired,
  clearOpenedMenus: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  openedChartForIsland: PropTypes.string,
  openedEntrance: PropTypes.string,
  openedExit: PropTypes.string,
  openedLocation: PropTypes.string,
  openedLocationIsDungeon: PropTypes.bool,
  rightClickToClearAll: PropTypes.bool.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  toggleLocationChecked: PropTypes.func.isRequired,
  toggleRequiredBoss: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetEntrance: PropTypes.func.isRequired,
  unsetExit: PropTypes.func.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
  updateChartMapping: PropTypes.func.isRequired,
  updateOpenedChartForIsland: PropTypes.func.isRequired,
  updateExitForEntrance: PropTypes.func.isRequired,
  updateOpenedEntrance: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
  viewingEntrances: PropTypes.bool.isRequired,
};

export default LocationsTable;
