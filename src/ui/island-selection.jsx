import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ISLANDS from '../data/islands.json';
import LogicCalculation from '../services/logic-calculation';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Tooltip from './tooltip';

class IslandSelection extends React.PureComponent {
  static NUM_ROWS = 17;

  islandTooltip(islandName) {
    const { trackerState } = this.props;

    const chartName = trackerState.getChartForIsland(islandName);

    return (
      <div className="item-requirements">
        {chartName}
      </div>
    );
  }

  island(islandName, numColumns) {
    if (_.isNil(islandName)) {
      return null;
    }

    const {
      openedChart,
      trackerState,
      updateIslandForChart,
    } = this.props;

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-smallest';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-small';
    }

    let color;
    let isIslandChecked;
    if (_.isNil(trackerState.getChartForIsland(islandName))) {
      color = LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION;
      isIslandChecked = false;
    } else {
      color = LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;
      isIslandChecked = true;
    }

    const notInteractiveClassName = isIslandChecked ? 'detail-not-interactive' : '';

    const updateIslandFunc = () => {
      if (!isIslandChecked) {
        updateIslandForChart(openedChart, islandName);
      }
    };

    const islandElement = (
      <div
        className={`detail-span ${notInteractiveClassName} ${color} ${fontSizeClassName}`}
        onClick={updateIslandFunc}
        onKeyDown={updateIslandFunc}
        role="button"
        tabIndex="0"
      >
        {islandName}
      </div>
    );

    let islandContent = islandElement;
    if (isIslandChecked) {
      const islandTooltip = this.islandTooltip(islandName);

      islandContent = (
        <Tooltip tooltipContent={islandTooltip}>
          {islandElement}
        </Tooltip>
      );
    }

    return (
      <td key={islandName}>
        {islandContent}
      </td>
    );
  }

  render() {
    const {
      clearOpenedMenus,
      openedChart,
    } = this.props;

    const islandChunks = _.chunk(ISLANDS, IslandSelection.NUM_ROWS);
    const arrangedIslands = _.zip(...islandChunks);
    const numColumns = _.size(islandChunks);

    const islandRows = _.map(arrangedIslands, (islandsRow, index) => (
      <tr key={index}>
        {_.map(islandsRow, (islandName) => this.island(islandName, numColumns))}
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
                  {openedChart}
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
            {islandRows}
          </tbody>
        </table>
      </div>
    );
  }
}

IslandSelection.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  openedChart: PropTypes.string.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  updateIslandForChart: PropTypes.func.isRequired,
};

export default IslandSelection;
