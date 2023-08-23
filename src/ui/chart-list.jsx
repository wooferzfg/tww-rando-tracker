import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import FoundAtTooltip from './found-at-tooltip';
import Images from './images';
import KeyDownWrapper from './key-down-wrapper';
import MapTable from './map-table';
import Tooltip from './tooltip';

class ChartList extends React.PureComponent {
  static NUM_ROWS = 20;

  mapChart(chart) {
    const {
      openedChartForIsland,
      trackerState,
      updateChartMapping,
    } = this.props;

    if (_.isNil(chart)) {
      return null;
    }

    const itemCount = trackerState.getItemValue(chart);

    const mappedIslandForChart = trackerState.getIslandFromChartMapping(chart);
    const isChartMapped = !_.isNil(mappedIslandForChart);

    const notInteractiveClassName = isChartMapped ? 'detail-not-interactive' : '';

    let color;
    if (isChartMapped) {
      color = LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;
    } else if (itemCount === 1) {
      color = LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION;
    } else {
      color = LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION;
    }

    const updateChartMappingFunc = (event) => {
      event.stopPropagation();

      if (!isChartMapped) {
        updateChartMapping(chart, openedChartForIsland);
      }
    };

    const chartElement = (
      <div
        className={`detail-span ${notInteractiveClassName} ${color} font-smallest`}
        onClick={updateChartMappingFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateChartMappingFunc)}
        role="button"
        tabIndex="0"
      >
        {chart}
      </div>
    );

    let chartContent;
    if (isChartMapped) {
      const tooltip = (
        <div className="tooltip">
          <div className="tooltip-title">Chart Leads To</div>
          <div>{mappedIslandForChart}</div>
        </div>
      );

      chartContent = (
        <Tooltip tooltipContent={tooltip}>
          {chartElement}
        </Tooltip>
      );
    } else {
      chartContent = chartElement;
    }

    return <td key={chart}>{chartContent}</td>;
  }

  chart(chartName, showLocationTooltip = true) {
    if (_.isNil(chartName)) {
      return null;
    }

    const {
      incrementItem,
      spheres,
      trackerState,
      trackSpheres,
      unsetChartMapping,
    } = this.props;

    const itemCount = trackerState.getItemValue(chartName);
    const mappedIslandForChart = (
      LogicHelper.isRandomizedChartsSettings()
        ? trackerState.getIslandFromChartMapping(chartName)
        : LogicHelper.islandForChart(chartName)
    );
    const isChartMapped = !_.isNil(mappedIslandForChart);

    const color = itemCount === 1
      ? LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION
      : LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION;

    let locations = [];
    if (showLocationTooltip && trackSpheres) {
      locations = trackerState.getLocationsForItem(chartName);
    }

    const incrementItemFunc = (event) => {
      event.stopPropagation();

      incrementItem(chartName);

      if (LogicHelper.isRandomizedChartsSettings()) {
        if (isChartMapped) {
          unsetChartMapping(LogicHelper.chartForIslandName(mappedIslandForChart), true);
        }
      }
    };

    const chartElement = (
      <div
        className={`detail-span ${color} font-smallest`}
        onClick={incrementItemFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(incrementItemFunc)}
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
    const { clearOpenedMenus, openedChartForIsland } = this.props;

    const chartItemFunc = (chart) => (
      openedChartForIsland
        ? this.mapChart(chart)
        : this.chart(chart)
    );

    const chartRows = MapTable.groupIntoChunks(
      [
        ...LogicHelper.ALL_TREASURE_CHARTS,
        ...LogicHelper.ALL_TRIFORCE_CHARTS,
      ],
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
  trackSpheres: PropTypes.bool.isRequired,
  updateChartMapping: PropTypes.func.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
};

export default ChartList;
