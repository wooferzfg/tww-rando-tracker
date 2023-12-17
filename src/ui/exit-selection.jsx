import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import KeyDownWrapper from './key-down-wrapper';
import MapTable from './map-table';
import Tooltip from './tooltip';

class ExitSelection extends React.PureComponent {
  static NUM_ROWS = 15;

  constructor(props) {
    super(props);

    this.exit = this.exit.bind(this);
  }

  entranceTooltip(exitName) {
    const { trackerState } = this.props;

    const entranceName = trackerState.getEntranceForExit(exitName);
    const shortEntranceName = LogicHelper.shortEntranceName(entranceName);

    return (
      <div className="tooltip">
        <div className="tooltip-title">Entrance Leading to Exit</div>
        <div>{shortEntranceName}</div>
      </div>
    );
  }

  exit(exitInfo, numColumns) {
    if (_.isNil(exitInfo)) {
      return null;
    }

    const {
      exit,
      color,
    } = exitInfo;

    const {
      openedEntrance,
      updateExitForEntrance,
    } = this.props;

    const shortExitName = LogicHelper.shortExitName(exit);

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-three-columns';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-two-columns';
    }

    const isExitChecked = color === LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;

    const notInteractiveClassName = isExitChecked ? 'detail-not-interactive' : '';

    const updateExitFunc = () => {
      if (!isExitChecked) {
        updateExitForEntrance(openedEntrance, exit);
      }
    };

    const exitElement = (
      <div
        className={`detail-span ${notInteractiveClassName} ${color} ${fontSizeClassName}`}
        onClick={updateExitFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateExitFunc)}
        role="button"
        tabIndex="0"
      >
        {shortExitName}
      </div>
    );

    let exitContent;
    if (isExitChecked) {
      const entranceTooltip = this.entranceTooltip(exit);

      exitContent = (
        <Tooltip tooltipContent={entranceTooltip}>
          {exitElement}
        </Tooltip>
      );
    } else {
      exitContent = exitElement;
    }

    return (
      <td key={shortExitName}>
        {exitContent}
      </td>
    );
  }

  render() {
    const {
      clearOpenedMenus,
      logic,
      openedEntrance,
    } = this.props;

    const exits = logic.exitsListForEntrance(openedEntrance);

    const exitRows = MapTable.groupIntoChunks(
      exits,
      this.exit,
      ExitSelection.NUM_ROWS,
    );

    return (
      <MapTable
        backgroundImage={Images.IMAGES.EMPTY_BACKGROUND}
        closeFunc={clearOpenedMenus}
        headerCellsBeforeClose={(
          <td>
            <div className="detail-span detail-not-interactive">
              Choose Exit
            </div>
          </td>
        )}
        tableRows={exitRows}
      />
    );
  }
}

ExitSelection.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  openedEntrance: PropTypes.string.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  updateExitForEntrance: PropTypes.func.isRequired,
};

export default ExitSelection;
