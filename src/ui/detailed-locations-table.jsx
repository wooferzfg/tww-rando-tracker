import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';

import Images from './images';
import Tooltip from './tooltip';

class DetailedLocationsTable extends React.PureComponent {
  static NUM_ROWS = 13;

  requirementsTooltip(generalLocation, detailedLocation) {
    const { logic } = this.props;

    const requirements = logic.formattedRequirementsForLocation(generalLocation, detailedLocation);

    const requirementsList = _.map(requirements, (elements) => (
      <li>
        {
          _.map(elements, ({ color, text }) => (
            <span className={color}>
              {` ${text} `}
            </span>
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
      openedLocation,
      toggleLocationChecked,
    } = this.props;

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-smallest';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-small';
    }

    const requirementsTooltip = this.requirementsTooltip(openedLocation, location);

    const toggleLocationFunc = () => toggleLocationChecked(openedLocation, location);

    return (
      <td key={location}>
        <Tooltip tooltipContent={requirementsTooltip}>
          <div
            className={`detail-span ${color} ${fontSizeClassName}`}
            onClick={toggleLocationFunc}
            onKeyDown={toggleLocationFunc}
            role="button"
            tabIndex="0"
          >
            {location}
          </div>
        </Tooltip>
      </td>
    );
  }

  render() {
    const {
      clearOpenedLocation,
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

    return (
      <div className="zoom-map">
        <div className="zoom-map-cover" />
        <div className="zoom-map-background">
          <img src={backgroundImage} alt="" />
        </div>
        <table>
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
            </tr>
            {locationRows}
          </tbody>
        </table>
      </div>
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
  toggleLocationChecked: PropTypes.func.isRequired,
};

export default DetailedLocationsTable;
