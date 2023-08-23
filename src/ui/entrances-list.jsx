import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import MapTable from './map-table';
import RequirementsTooltip from './requirements-tooltip';
import Tooltip from './tooltip';

class EntrancesList extends React.PureComponent {
  static NUM_ROWS = 15;

  constructor(props) {
    super(props);

    this.entrance = this.entrance.bind(this);
  }

  exitTooltip(entranceName) {
    const { trackerState } = this.props;

    const exitName = trackerState.getExitForEntrance(entranceName);
    const shortExitName = LogicHelper.shortEntranceName(exitName);

    return (
      <div className="tooltip">
        <div className="tooltip-title">Entrance Leads To</div>
        <div>{shortExitName}</div>
      </div>
    );
  }

  requirementsTooltip(entranceName) {
    const { logic } = this.props;

    const requirements = logic.formattedRequirementsForEntrance(entranceName);

    return (
      <RequirementsTooltip requirements={requirements} />
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
        className={`detail-span detail-not-interactive ${color} ${fontSizeClassName}`}
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
    } = this.props;

    const entrances = logic.entrancesList({ disableLogic });

    const entranceRows = MapTable.groupIntoChunks(
      entrances,
      this.entrance,
      EntrancesList.NUM_ROWS,
    );

    return (
      <MapTable
        backgroundImage={Images.IMAGES.EMPTY_BACKGROUND}
        closeFunc={clearOpenedMenus}
        tableRows={entranceRows}
      />
    );
  }
}

EntrancesList.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default EntrancesList;
