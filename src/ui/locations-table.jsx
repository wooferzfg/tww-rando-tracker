import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import ChartList from './chart-list';
import ChartListSelect from './chart-list-select';
import DetailedLocationsTable from './detailed-locations-table';
import EntranceSelection from './entrance-selection';
import EntrancesList from './entrances-list';
import ExtraLocationsTable from './extra-locations-table';
import MapInfo from './map-info';
import SeaChart from './sea-chart';

class LocationsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedChart: null,
      selectedExit: null,
      selectedItem: null,
      selectedLocation: null,
      selectedLocationIsDungeon: null,
    };

    this.setSelectedChart = this.setSelectedChart.bind(this);
    this.setSelectedExit = this.setSelectedExit.bind(this);
    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.setSelectedLocation = this.setSelectedLocation.bind(this);
    this.clearSelectedChart = this.clearSelectedChart.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
    this.clearSelectedLocation = this.clearSelectedLocation.bind(this);
  }

  setSelectedChart(chartName) {
    this.setState({ selectedChart: chartName });
  }

  setSelectedExit(exitName) {
    this.setState({ selectedExit: exitName });
  }

  setSelectedItem(itemName) {
    this.setState({ selectedItem: itemName });
  }

  setSelectedLocation({ locationName, isDungeon }) {
    this.setState({
      selectedLocation: locationName,
      selectedLocationIsDungeon: isDungeon,
    });
  }

  clearSelectedChart() {
    this.setState({
      selectedChart: null,
    });
  }

  clearSelectedItem() {
    this.setState({
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
      chartListSelect,
      clearOpenedMenus,
      clearRaceModeBannedLocations,
      decrementFakeTreasureChart,
      decrementItem,
      disableLogic,
      entrancesListOpen,
      incrementFakeTreasureChart,
      incrementItem,
      logic,
      onlyProgressLocations,
      openedChart,
      openedExit,
      openedLocation,
      openedLocationIsDungeon,
      spheres,
      toggleLocationChecked,
      trackerState,
      trackSpheres,
      unsetChartMapping,
      unsetExit,
      updateChartMapping,
      updateEntranceForExit,
      updateOpenedChart,
      updateOpenedExit,
      updateOpenedLocation,
    } = this.props;

    const {
      selectedChart,
      selectedExit,
      selectedItem,
      selectedLocation,
      selectedLocationIsDungeon,
    } = this.state;

    let chartElement;
    if (openedChart || chartListSelect) {
      chartElement = (
        <ChartListSelect
          clearOpenedMenus={clearOpenedMenus}
          decrementFakeTreasureChart={decrementFakeTreasureChart}
          decrementItem={decrementItem}
          incrementFakeTreasureChart={incrementFakeTreasureChart}
          incrementItem={incrementItem}
          openedChart={openedChart}
          spheres={spheres}
          trackerState={trackerState}
          trackSpheres={trackSpheres}
          updateChartMapping={updateChartMapping}
        />
      );
    } else if (chartListOpen) {
      chartElement = (
        <ChartList
          clearOpenedMenus={clearOpenedMenus}
          spheres={spheres}
          trackerState={trackerState}
          trackSpheres={trackSpheres}
        />
      );
    } else if (entrancesListOpen) {
      chartElement = (
        <EntrancesList
          clearOpenedMenus={clearOpenedMenus}
          disableLogic={disableLogic}
          logic={logic}
          trackerState={trackerState}
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
          updateEntranceForExit={updateEntranceForExit}
        />
      );
    } else if (!_.isNil(openedLocation)) {
      chartElement = (
        <DetailedLocationsTable
          clearOpenedMenus={clearOpenedMenus}
          clearRaceModeBannedLocations={clearRaceModeBannedLocations}
          disableLogic={disableLogic}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          openedLocation={openedLocation}
          openedLocationIsDungeon={openedLocationIsDungeon}
          spheres={spheres}
          trackerState={trackerState}
          trackSpheres={trackSpheres}
          toggleLocationChecked={toggleLocationChecked}
        />
      );
    } else {
      chartElement = (
        <SeaChart
          clearSelectedChart={this.clearSelectedChart}
          clearSelectedItem={this.clearSelectedItem}
          clearSelectedLocation={this.clearSelectedLocation}
          decrementFakeTreasureChart={decrementFakeTreasureChart}
          decrementItem={decrementItem}
          disableLogic={disableLogic}
          incrementFakeTreasureChart={incrementFakeTreasureChart}
          incrementItem={incrementItem}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          setSelectedChart={this.setSelectedChart}
          setSelectedExit={this.setSelectedExit}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
          spheres={spheres}
          trackerState={trackerState}
          trackSpheres={trackSpheres}
          unsetChartMapping={unsetChartMapping}
          unsetExit={unsetExit}
          updateOpenedChart={updateOpenedChart}
          updateOpenedExit={updateOpenedExit}
          updateOpenedLocation={updateOpenedLocation}
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
          selectedChart={selectedChart}
          selectedExit={selectedExit}
          selectedItem={selectedItem}
          selectedLocation={selectedLocation}
          selectedLocationIsDungeon={selectedLocationIsDungeon}
          trackerState={trackerState}
        />
      </div>
    );
  }

  render() {
    const {
      backgroundColor,
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      spheres,
      trackerState,
      trackSpheres,
      unsetExit,
      updateOpenedExit,
      updateOpenedLocation,
    } = this.props;

    return (
      <>
        {this.chartContainer()}
        <ExtraLocationsTable
          backgroundColor={backgroundColor}
          clearSelectedItem={this.clearSelectedItem}
          clearSelectedLocation={this.clearSelectedLocation}
          decrementItem={decrementItem}
          disableLogic={disableLogic}
          incrementItem={incrementItem}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          setSelectedExit={this.setSelectedExit}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
          spheres={spheres}
          trackerState={trackerState}
          trackSpheres={trackSpheres}
          unsetExit={unsetExit}
          updateOpenedExit={updateOpenedExit}
          updateOpenedLocation={updateOpenedLocation}
        />
      </>
    );
  }
}

LocationsTable.defaultProps = {
  backgroundColor: null,
  openedChart: null,
  openedExit: null,
  openedLocation: null,
  openedLocationIsDungeon: null,
};

LocationsTable.propTypes = {
  backgroundColor: PropTypes.string,
  chartListOpen: PropTypes.bool.isRequired,
  chartListSelect: PropTypes.bool.isRequired,
  clearOpenedMenus: PropTypes.func.isRequired,
  clearRaceModeBannedLocations: PropTypes.func.isRequired,
  decrementFakeTreasureChart: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  entrancesListOpen: PropTypes.bool.isRequired,
  incrementFakeTreasureChart: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  openedChart: PropTypes.string,
  openedExit: PropTypes.string,
  openedLocation: PropTypes.string,
  openedLocationIsDungeon: PropTypes.bool,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  toggleLocationChecked: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetExit: PropTypes.func.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
  updateChartMapping: PropTypes.func.isRequired,
  updateOpenedChart: PropTypes.func.isRequired,
  updateEntranceForExit: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default LocationsTable;
