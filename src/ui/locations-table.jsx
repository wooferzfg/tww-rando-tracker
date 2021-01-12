import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import TrackerState from '../services/tracker-state';

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
      selectedExit: null,
      selectedItem: null,
      selectedLocation: null,
      selectedLocationIsDungeon: null,
    };

    this.setSelectedExit = this.setSelectedExit.bind(this);
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
      clearOpenedMenus,
      clearRaceModeBannedLocations,
      decrementItem,
      disableLogic,
      entrancesListOpen,
      incrementItem,
      logic,
      onlyProgressLocations,
      openedExit,
      openedLocation,
      openedLocationIsDungeon,
      toggleLocationChecked,
      trackerState,
      unsetExit,
      updateEntranceForExit,
      updateOpenedExit,
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
          toggleLocationChecked={toggleLocationChecked}
        />
      );
    } else {
      chartElement = (
        <SeaChart
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
          trackerState={trackerState}
          unsetExit={unsetExit}
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
      decrementItem,
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      singleColorBackground,
      trackerState,
      unsetExit,
      updateOpenedExit,
      updateOpenedLocation,
    } = this.props;

    return (
      <>
        {this.chartContainer()}
        <ExtraLocationsTable
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
          singleColorBackground={singleColorBackground}
          trackerState={trackerState}
          unsetExit={unsetExit}
          updateOpenedExit={updateOpenedExit}
          updateOpenedLocation={updateOpenedLocation}
        />
      </>
    );
  }
}

LocationsTable.defaultProps = {
  openedExit: null,
  openedLocation: null,
  openedLocationIsDungeon: null,
};

LocationsTable.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  clearRaceModeBannedLocations: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  entrancesListOpen: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  openedExit: PropTypes.string,
  openedLocation: PropTypes.string,
  openedLocationIsDungeon: PropTypes.bool,
  singleColorBackground: PropTypes.bool.isRequired,
  toggleLocationChecked: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateEntranceForExit: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
};

export default LocationsTable;
