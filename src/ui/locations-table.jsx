import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import TrackerState from '../services/tracker-state';

import SeaChart from './sea-chart';

class LocationsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
      selectedLocation: null,
    };

    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
    this.setSelectedLocation = this.setSelectedLocation.bind(this);
    this.clearSelectedLocation = this.clearSelectedLocation.bind(this);
  }

  setSelectedItem(itemName) {
    this.setState({ selectedItem: itemName });
  }

  setSelectedLocation(locationName) {
    this.setState({ selectedLocation: locationName });
  }

  clearSelectedItem() {
    this.setState({ selectedItem: null });
  }

  clearSelectedLocation() {
    this.setState({ selectedLocation: null });
  }

  render() {
    const {
      disableLogic,
      incrementItem,
      logic,
      onlyProgressLocations,
      trackerState,
    } = this.props;

    const {
      selectedItem,
      selectedLocation,
    } = this.state;

    return (
      <SeaChart
        clearSelectedItem={this.clearSelectedItem}
        clearSelectedLocation={this.clearSelectedLocation}
        disableLogic={disableLogic}
        incrementItem={incrementItem}
        logic={logic}
        onlyProgressLocations={onlyProgressLocations}
        selectedItem={selectedItem}
        selectedLocation={selectedLocation}
        setSelectedItem={this.setSelectedItem}
        setSelectedLocation={this.setSelectedLocation}
        trackerState={trackerState}
      />
    );
  }
}

LocationsTable.propTypes = {
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default LocationsTable;
