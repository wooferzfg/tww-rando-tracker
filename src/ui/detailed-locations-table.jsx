import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import Images from './images';
import KeyDownWrapper from './key-down-wrapper';
import MapTable from './map-table';
import RequirementsTooltip from './requirements-tooltip';
import Tooltip from './tooltip';

class DetailedLocationsTable extends React.PureComponent {
  static NUM_ROWS = 13;

  constructor(props) {
    super(props);

    this.detailedLocation = this.detailedLocation.bind(this);
  }

  requirementsTooltip(generalLocation, detailedLocation) {
    const { logic } = this.props;

    const requirements = logic.formattedRequirementsForLocation(generalLocation, detailedLocation);

    return (
      <RequirementsTooltip requirements={requirements} />
    );
  }

  itemTooltip(generalLocation, detailedLocation) {
    const { trackerState } = this.props;

    const itemForLocation = trackerState.getItemForLocation(generalLocation, detailedLocation);

    if (_.isNil(itemForLocation)) {
      return null;
    }

    const prettyItemName = LogicHelper.prettyNameForItem(itemForLocation, null);

    let chartLeadsTo;
    if (LogicHelper.isRandomizedChart(itemForLocation)) {
      const mappedIslandForChart = trackerState.getIslandFromChartMapping(itemForLocation);
      chartLeadsTo = !_.isNil(mappedIslandForChart) ? (
        <>
          <div className="tooltip-title">Chart Leads To</div>
          <div>{mappedIslandForChart}</div>
        </>
      ) : null;
    }

    return (
      <div className="tooltip">
        <div className="tooltip-title">Item at Location</div>
        <div>{prettyItemName}</div>
        {chartLeadsTo}
      </div>
    );
  }

  detailedLocation(locationInfo, numColumns, numRows) {
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
      spheres,
      trackSpheres,
      toggleLocationChecked,
    } = this.props;

    let fontSizeClassName = '';
    if (numRows > 13) {
      fontSizeClassName = 'font-three-columns less-padding';
    } else if (numColumns === 3) {
      fontSizeClassName = 'font-three-columns';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-two-columns';
    }

    const toggleLocationFunc = () => toggleLocationChecked(openedLocation, location);

    let locationText;
    if (trackSpheres) {
      const sphere = spheres.sphereForLocation(openedLocation, location);
      const sphereText = _.isNil(sphere) ? '?' : sphere;

      locationText = `[${sphereText}] ${location}`;
    } else {
      locationText = location;
    }

    const locationElement = (
      <div
        className={`detail-span ${color} ${fontSizeClassName}`}
        onClick={toggleLocationFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(toggleLocationFunc)}
        role="button"
        tabIndex="0"
      >
        {locationText}
      </div>
    );

    const isLocationChecked = color === LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;

    let locationContent;
    if (disableLogic || isLocationChecked) {
      let itemTooltip = null;
      if (trackSpheres) {
        itemTooltip = this.itemTooltip(openedLocation, location);
      }

      locationContent = (
        <Tooltip tooltipContent={itemTooltip}>
          {locationElement}
        </Tooltip>
      );
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
      clearAllLocations,
      clearOpenedMenus,
      toggleRequiredBoss,
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
        onlyProgressLocations,
      },
    );

    const locationRows = MapTable.groupIntoChunks(
      detailedLocations,
      this.detailedLocation,
      DetailedLocationsTable.NUM_ROWS,
    );

    const clearAllLocationsFunc = () => clearAllLocations(openedLocation);

    const clearAllElement = (
      <td>
        <div
          className="detail-span"
          onClick={clearAllLocationsFunc}
          onKeyDown={KeyDownWrapper.onSpaceKey(clearAllLocationsFunc)}
          role="button"
          tabIndex="0"
        >
          ✓ Clear All
        </div>
      </td>
    );

    let requiredBossElement = null;
    if (
      Settings.getOptionValue(Permalink.OPTIONS.REQUIRED_BOSSES)
      && openedLocationIsDungeon
      && LogicHelper.isRequiredBossesModeDungeon(openedLocation)
    ) {
      const isBossRequired = LogicHelper.isBossRequired(openedLocation);
      const isDisabled = isBossRequired && !LogicHelper.anyNonRequiredBossesRemaining();

      const toggleRequiredBossFunc = () => {
        if (!isDisabled) {
          toggleRequiredBoss(openedLocation);
        }
      };

      const className = `detail-span ${isDisabled ? 'detail-disabled' : ''}`;

      requiredBossElement = (
        <td className="extra-width-header">
          <div
            className={className}
            onClick={toggleRequiredBossFunc}
            onKeyDown={KeyDownWrapper.onSpaceKey(toggleRequiredBossFunc)}
            role="button"
            tabIndex="0"
          >
            <input
              type="checkbox"
              className="button-checkbox"
              checked={isBossRequired}
              disabled={isDisabled}
              readOnly
            />
            <span>Required Boss</span>
          </div>
        </td>
      );
    }

    return (
      <MapTable
        backgroundImage={backgroundImage}
        closeFunc={clearOpenedMenus}
        headerCellsAfterClose={(
          <>
            {clearAllElement}
            {requiredBossElement}
          </>
        )}
        tableRows={locationRows}
      />
    );
  }
}

DetailedLocationsTable.propTypes = {
  clearAllLocations: PropTypes.func.isRequired,
  clearOpenedMenus: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  openedLocation: PropTypes.string.isRequired,
  openedLocationIsDungeon: PropTypes.bool.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  toggleRequiredBoss: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  toggleLocationChecked: PropTypes.func.isRequired,
};

export default DetailedLocationsTable;
