import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import KeyDownWrapper from './key-down-wrapper';
import MapTable from './map-table';
import RequirementsTooltip from './requirements-tooltip';
import Tooltip from './tooltip';

class EntranceSelection extends React.PureComponent {
  static NUM_ROWS = 15;

  constructor(props) {
    super(props);

    this.entrance = this.entrance.bind(this);
  }

  exitTooltip(entranceName) {
    const { trackerState } = this.props;

    const exitName = trackerState.getExitForEntrance(entranceName);
    const shortExitName = LogicHelper.shortExitName(exitName);

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

    const {
      disableLogic,
      openedExit,
      updateExitForEntrance,
    } = this.props;

    const shortEntranceName = LogicHelper.shortEntranceName(entrance);

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-three-columns';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-two-columns';
    }

    const isEntranceChecked = color === LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;

    const notInteractiveClassName = isEntranceChecked ? 'detail-not-interactive' : '';

    const updateEntranceFunc = () => {
      if (!isEntranceChecked) {
        updateExitForEntrance(entrance, openedExit);
      }
    };

    const entranceElement = (
      <div
        className={`detail-span ${notInteractiveClassName} ${color} ${fontSizeClassName}`}
        onClick={updateEntranceFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateEntranceFunc)}
        role="button"
        tabIndex="0"
      >
        {shortEntranceName}
      </div>
    );

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

    const entranceRows = MapTable.groupIntoChunks(
      entrances,
      this.entrance,
      EntranceSelection.NUM_ROWS,
    );

    return (
      <MapTable
        backgroundImage={Images.IMAGES.EMPTY_BACKGROUND}
        closeFunc={clearOpenedMenus}
        headerCellsBeforeClose={(
          <td>
            <div className="detail-span detail-not-interactive">
              Choose Entrance
            </div>
          </td>
        )}
        tableRows={entranceRows}
      />
    );
  }
}

EntranceSelection.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  openedExit: PropTypes.string.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  updateExitForEntrance: PropTypes.func.isRequired,
};

export default EntranceSelection;
