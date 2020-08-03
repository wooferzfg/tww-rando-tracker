import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import TrackerState from '../services/tracker-state';

class DetailedLocationsTable extends React.PureComponent {
  render() {
    const { openedLocation, openedLocationIsDungeon } = this.props;

    return (
      <div>{openedLocation} - {_.toString(openedLocationIsDungeon)}</div>
    );
  }
}

DetailedLocationsTable.propTypes = {
  clearOpenedLocation: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  openedLocation: PropTypes.string.isRequired,
  openedLocationIsDungeon: PropTypes.bool.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default DetailedLocationsTable;
