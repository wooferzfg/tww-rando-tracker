import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import TrackerState from '../services/tracker-state';

import DetailedLocationsTable from './detailed-locations-table';
import EntrancesList from './entrances-list';
import ExtraLocationsTable from './extra-locations-table';
import MapInfo from './map-info';
import SeaChart from './sea-chart';

class LocationsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedExit: null,
      selectedItem: null,
      selectedLocation: null,
      selectedLocationIsDungeon: null,
    };

    this.setSelectedExit = this.setSelectedExit.bind(this);
    this.clearSelectedExit = this.clearSelectedExit.bind(this);
    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
    this.setSelectedLocation = this.setSelectedLocation.bind(this);
    this.clearSelectedLocation = this.clearSelectedLocation.bind(this);
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

  clearSelectedExit() {
    this.setState({ selectedExit: null });
  }

  clearSelectedItem() {
    this.setState({ selectedItem: null });
  }

  clearSelectedLocation() {
    this.setState({ selectedLocation: null });
  }

  chartContainer() {
    const {
      clearOpenedMenus,
      clearRaceModeBannedLocations,
      disableLogic,
      entrancesListOpen,
      incrementItem,
      logic,
      onlyProgressLocations,
      openedLocation,
      openedLocationIsDungeon,
      toggleLocationChecked,
      trackerState,
      updateOpenedLocation,
    } = this.props;

    const {
      selectedExit,
      selectedItem,
      selectedLocation,
      selectedLocationIsDungeon,
    } = this.state;

    let chartElement;
    if (entrancesListOpen) {
      chartElement = (
        <EntrancesList
          clearOpenedMenus={clearOpenedMenus}
          disableLogic={disableLogic}
          logic={logic}
          trackerState={trackerState}
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
          toggleLocationChecked={toggleLocationChecked}
        />
      );
    } else {
      chartElement = (
        <SeaChart
          clearSelectedExit={this.clearSelectedExit}
          clearSelectedItem={this.clearSelectedItem}
          clearSelectedLocation={this.clearSelectedLocation}
          disableLogic={disableLogic}
          incrementItem={incrementItem}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          setSelectedExit={this.setSelectedExit}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
          trackerState={trackerState}
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
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      singleColorBackground,
      trackerState,
      updateOpenedLocation,
    } = this.props;

    return (
      <>
        {this.chartContainer()}
        <ExtraLocationsTable
          clearSelectedExit={this.clearSelectedExit}
          clearSelectedItem={this.clearSelectedItem}
          clearSelectedLocation={this.clearSelectedLocation}
          disableLogic={disableLogic}
          incrementItem={incrementItem}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          setSelectedExit={this.setSelectedExit}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
          singleColorBackground={singleColorBackground}
          trackerState={trackerState}
          updateOpenedLocation={updateOpenedLocation}
        />
      </>
    );
  }
}

LocationsTable.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  clearRaceModeBannedLocations: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  entrancesListOpen: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  openedLocation: PropTypes.string.isRequired,
  openedLocationIsDungeon: PropTypes.bool.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  toggleLocationChecked: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default LocationsTable;
