import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';

import Images from './images';
import Tooltip from './tooltip';

class DetailedLocationsTable extends React.PureComponent {
  static NUM_ROWS = 13;

  requirementsTooltip(generalLocation, detailedLocation) {
    const { logic } = this.props;

    const requirements = logic.formattedRequirementsForLocation(generalLocation, detailedLocation);

    const requirementsList = _.map(requirements, (elements, rowIndex) => (
      <li key={rowIndex}>
        {
          _.map(elements, ({ color, text }, elementIndex) => (
            <span className={color} key={elementIndex}>{text}</span>
          ))
        }
      </li>
    ));

    return (
      <div className="item-requirements">
        <div className="item-requirements-title">Items Required</div>
        <ul>
          {requirementsList}
        </ul>
      </div>
    );
  }

  detailedLocation(locationInfo, numColumns) {
    if (_.isNil(locationInfo)) {
      return null;
    }

    const {
      location,
      color,
    } = locationInfo;

    const {
      disableLogic,
      openedLocation,
      toggleLocationChecked,
    } = this.props;

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-smallest';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-small';
    }

    const toggleLocationFunc = () => toggleLocationChecked(openedLocation, location);

    const locationElement = (
      <div
        className={`detail-span ${color} ${fontSizeClassName}`}
        onClick={toggleLocationFunc}
        onKeyDown={toggleLocationFunc}
        role="button"
        tabIndex="0"
      >
        {location}
      </div>
    );

    const isLocationChecked = color === LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;

    let locationContent;
    if (disableLogic || isLocationChecked) {
      locationContent = locationElement;
    } else {
      const requirementsTooltip = this.requirementsTooltip(openedLocation, location);

      locationContent = (
        <Tooltip tooltipContent={requirementsTooltip}>
          {locationElement}
        </Tooltip>
      );
    }

    return (
      <td key={location}>
        {locationContent}
      </td>
    );
  }

  render() {
    const {
      clearOpenedLocation,
      clearRaceModeBannedLocations,
      disableLogic,
      logic,
      onlyProgressLocations,
      openedLocation,
      openedLocationIsDungeon,
    } = this.props;

    const backgroundImage = _.get(Images.IMAGES, [
      openedLocationIsDungeon ? 'DUNGEON_CHART_BACKGROUNDS' : 'ISLAND_CHART_BACKGROUNDS',
      openedLocation,
    ]);

    const detailedLocations = logic.locationsList(
      openedLocation,
      {
        disableLogic,
        isDungeon: openedLocationIsDungeon,
        onlyProgressLocations,
      },
    );

    const locationChunks = _.chunk(detailedLocations, DetailedLocationsTable.NUM_ROWS);
    const arrangedLocations = _.zip(...locationChunks);
    const numColumns = _.size(locationChunks);

    const locationRows = _.map(arrangedLocations, (locationsRow, index) => (
      <tr key={index}>
        {_.map(locationsRow, (locationInfo) => this.detailedLocation(locationInfo, numColumns))}
      </tr>
    ));

    let clearAllElement;
    if (
      Settings.getOptionValue(Permalink.OPTIONS.RACE_MODE)
      && LogicHelper.isRaceModeDungeon(openedLocation)
    ) {
      const clearRaceModeBannedLocationsFunc = () => clearRaceModeBannedLocations(openedLocation);

      clearAllElement = (
        <td>
          <div
            className="detail-span"
            onClick={clearRaceModeBannedLocationsFunc}
            onKeyDown={clearRaceModeBannedLocationsFunc}
            role="button"
            tabIndex="0"
          >
            ✓ Clear All
          </div>
        </td>
      );
    }

    return (
      <div className="zoom-map">
        <div className="zoom-map-cover" />
        <div className="zoom-map-background">
          <img src={backgroundImage} alt="" />
        </div>
        <table className="header-table">
          <tbody>
            <tr>
              <td>
                <div
                  className="detail-span"
                  onClick={clearOpenedLocation}
                  onKeyDown={clearOpenedLocation}
                  role="button"
                  tabIndex="0"
                >
                  X Close
                </div>
              </td>
              {clearAllElement}
            </tr>
          </tbody>
        </table>
        <table className="detailed-locations-table">
          <tbody>
            {locationRows}
          </tbody>
        </table>
      </div>
    );
  }
}

DetailedLocationsTable.propTypes = {
  clearOpenedLocation: PropTypes.func.isRequired,
  clearRaceModeBannedLocations: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  openedLocation: PropTypes.string.isRequired,
  openedLocationIsDungeon: PropTypes.bool.isRequired,
  toggleLocationChecked: PropTypes.func.isRequired,
};

export default DetailedLocationsTable;
