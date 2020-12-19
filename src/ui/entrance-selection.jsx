import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Tooltip from './tooltip';

class EntranceSelection extends React.PureComponent {
  static NUM_ROWS = 13;

  exitTooltip(entranceName) {
    const { trackerState } = this.props;

    const exitName = trackerState.getExitForEntrance(entranceName);
    const shortExitName = LogicHelper.shortEntranceName(exitName);

    return (
      <div className="item-requirements">
        <div className="item-requirements-title">Entrance Leads To</div>
        <div>{shortExitName}</div>
      </div>
    );
  }

  requirementsTooltip(entranceName) {
    const { logic } = this.props;

    const requirements = logic.formattedRequirementsForEntrance(entranceName);

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

  entrance(entranceInfo, numColumns) {
    if (_.isNil(entranceInfo)) {
      return null;
    }

    const {
      entrance,
      color,
    } = entranceInfo;

    const { disableLogic } = this.props;

    const shortEntranceName = LogicHelper.shortEntranceName(entrance);

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-smallest';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-small';
    }

    const entranceElement = (
      <div
        className={`detail-span ${color} ${fontSizeClassName}`}
        role="button"
        tabIndex="0"
      >
        {shortEntranceName}
      </div>
    );

    const isEntranceChecked = color === LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;

    let entranceContent;
    if (isEntranceChecked) {
      const exitTooltip = this.exitTooltip(entrance);

      entranceContent = (
        <Tooltip tooltipContent={exitTooltip}>
          {entranceElement}
        </Tooltip>
      );
    } else if (disableLogic) {
      entranceContent = entranceElement;
    } else {
      const requirementsTooltip = this.requirementsTooltip(entrance);

      entranceContent = (
        <Tooltip tooltipContent={requirementsTooltip}>
          {entranceElement}
        </Tooltip>
      );
    }

    return (
      <td key={shortEntranceName}>
        {entranceContent}
      </td>
    );
  }

  render() {
    const {
      clearOpenedMenus,
      disableLogic,
      logic,
      openedExit,
    } = this.props;

    const entrances = logic.entrancesListForExit(openedExit, { disableLogic });

    const entranceChunks = _.chunk(entrances, EntranceSelection.NUM_ROWS);
    const arrangedEntrances = _.zip(...entranceChunks);
    const numColumns = _.size(entranceChunks);

    const entranceRows = _.map(arrangedEntrances, (locationsRow, index) => (
      <tr key={index}>
        {_.map(locationsRow, (entranceInfo) => this.entrance(entranceInfo, numColumns))}
      </tr>
    ));

    return (
      <div className="zoom-map">
        <div className="zoom-map-cover" />
        <div className="zoom-map-background">
          <img src={Images.IMAGES.EMPTY_BACKGROUND} alt="" />
        </div>
        <table className="header-table">
          <tbody>
            <tr>
              <td>
                <div className="detail-span detail-not-interactive">
                  Choose Entrance
                </div>
              </td>
              <td>
                <div
                  className="detail-span"
                  onClick={clearOpenedMenus}
                  onKeyDown={clearOpenedMenus}
                  role="button"
                  tabIndex="0"
                >
                  X Close
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="detailed-locations-table">
          <tbody>
            {entranceRows}
          </tbody>
        </table>
      </div>
    );
  }
}

EntranceSelection.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  openedExit: PropTypes.string.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default EntranceSelection;
