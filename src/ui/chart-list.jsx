import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import FoundAtTooltip from './found-at-tooltip';
import Images from './images';
import KeyDownWrapper from './key-down-wrapper';
import MapTable from './map-table';
import Tooltip from './tooltip';

class ChartList extends React.PureComponent {
  static NUM_ROWS = 20;

  chart(chartName, numColumns, isMapping) {
    const {
      incrementItem,
      openedChartForIsland,
      spheres,
      trackSpheres,
      trackerState,
      unsetChartMapping,
      updateChartMapping,
    } = this.props;

    if (_.isNil(chartName)) {
      return null;
    }

    const itemCount = trackerState.getItemValue(chartName);

    const mappedIslandForChart = (
      Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)
        ? trackerState.getIslandFromChartMapping(chartName)
        : LogicHelper.islandForChart(chartName)
    );
    const isChartMapped = !_.isNil(mappedIslandForChart);

    const notInteractiveClassName = (isChartMapped && isMapping) ? 'detail-not-interactive' : '';

    let color;
    if ((isMapping && isChartMapped) || (!isMapping && itemCount === 1)) {
      color = LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;
    } else if ((isMapping && itemCount === 1) || (!isMapping)) {
      color = LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION;
    } else {
      color = LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION;
    }

    let locations = [];
    if (trackSpheres && isMapping) {
      locations = trackerState.getLocationsForItem(chartName);
    }

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-three-columns';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-two-columns';
    }

    const updateChartFunc = (event) => {
      event.stopPropagation();

      if (isMapping) {
        if (!isChartMapped) {
          updateChartMapping(chartName, openedChartForIsland);
        }
      } else {
        incrementItem(chartName);

        if (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
          if (isChartMapped) {
            unsetChartMapping(LogicHelper.randomizedChartForIsland(mappedIslandForChart), true);
          }
        }
      }
    };

    const chartElement = (
      <div
        className={`detail-span ${notInteractiveClassName} ${color} ${fontSizeClassName}`}
        onClick={updateChartFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateChartFunc)}
        role="button"
        tabIndex="0"
      >
        {chartName}
      </div>
    );

    const foundAtTooltipContent = !_.isEmpty(locations)
      ? <FoundAtTooltip locations={locations} spheres={spheres} />
      : null;

    const chartLeadsTo = isChartMapped ? (
      <div className="tooltip">
        <div className="tooltip-title">Chart Leads To</div>
        <div>{mappedIslandForChart}</div>
      </div>
    ) : null;

    let outerChartElement;
    if (foundAtTooltipContent || chartLeadsTo) {
      const tooltipContent = (
        <>
          {foundAtTooltipContent}
          {foundAtTooltipContent && chartLeadsTo && (
            <div className="tooltip-spacer" />
          )}
          {chartLeadsTo}
        </>
      );
      outerChartElement = (
        <td key={chartName}>
          <Tooltip
            tooltipContent={tooltipContent}
          >
            {chartElement}
          </Tooltip>
        </td>
      );
    } else {
      outerChartElement = <td key={chartName}>{chartElement}</td>;
    }

    return outerChartElement;
  }

  render() {
    const {
      clearOpenedMenus,
      openedChartForIsland,
      trackNonProgressCharts,
    } = this.props;

    const chartItemFunc = (chart, numColumns) => (
      this.chart(chart, numColumns, openedChartForIsland)
    );

    const chartRows = MapTable.groupIntoChunks(
      LogicHelper.allCharts({ includeNonProgressCharts: trackNonProgressCharts }),
      chartItemFunc,
      ChartList.NUM_ROWS,
    );

    return (
      <MapTable
        backgroundImage={Images.IMAGES.EMPTY_BACKGROUND}
        closeFunc={clearOpenedMenus}
        headerCellsBeforeClose={openedChartForIsland && (
          <td>
            <div className="detail-span detail-not-interactive">
              Choose Chart
            </div>
          </td>
        )}
        tableRows={chartRows}
      />
    );
  }
}

ChartList.defaultProps = {
  openedChartForIsland: null,
};

ChartList.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  openedChartForIsland: PropTypes.string,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  updateChartMapping: PropTypes.func.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
};

export default ChartList;
