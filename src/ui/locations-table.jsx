import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";

import LogicCalculation from "../services/logic-calculation";
import TrackerState from "../services/tracker-state";

import DetailedLocationsTable from "./detailed-locations-table";
import ExtraLocationsTable from "./extra-locations-table";
import MapInfo from "./map-info";
import SeaChart from "./sea-chart";

class LocationsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openedLocation: null,
      openedLocationIsDungeon: null,
      selectedExit: null,
      selectedItem: null,
      selectedLocation: null,
      selectedLocationIsDungeon: null,
    };

    this.setOpenedLocation = this.setOpenedLocation.bind(this);
    this.clearOpenedLocation = this.clearOpenedLocation.bind(this);
    this.setSelectedExit = this.setSelectedExit.bind(this);
    this.clearSelectedExit = this.clearSelectedExit.bind(this);
    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
    this.setSelectedLocation = this.setSelectedLocation.bind(this);
    this.clearSelectedLocation = this.clearSelectedLocation.bind(this);
  }

  setOpenedLocation({ locationName, isDungeon }) {
    this.setState({
      openedLocation: locationName,
      openedLocationIsDungeon: isDungeon,
    });
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

  clearOpenedLocation() {
    this.setState({ openedLocation: null });
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
      clearRaceModeBannedLocations,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      toggleLocationChecked,
      trackerState,
    } = this.props;

    const {
      openedLocation,
      openedLocationIsDungeon,
      selectedExit,
      selectedItem,
      selectedLocation,
      selectedLocationIsDungeon,
    } = this.state;

    let chartElement;
    if (!_.isNil(openedLocation)) {
      chartElement = (
        <DetailedLocationsTable
          clearOpenedLocation={this.clearOpenedLocation}
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
          clearSelectedItem={this.clearSelectedItem}
          clearSelectedLocation={this.clearSelectedLocation}
          disableLogic={disableLogic}
          incrementItem={incrementItem}
          logic={logic}
          onlyProgressLocations={onlyProgressLocations}
          setOpenedLocation={this.setOpenedLocation}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
          trackerState={trackerState}
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
          setOpenedLocation={this.setOpenedLocation}
          setSelectedExit={this.setSelectedExit}
          setSelectedItem={this.setSelectedItem}
          setSelectedLocation={this.setSelectedLocation}
          singleColorBackground={singleColorBackground}
          trackerState={trackerState}
        />
      </>
    );
  }
}

LocationsTable.propTypes = {
  clearRaceModeBannedLocations: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  toggleLocationChecked: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default LocationsTable;
