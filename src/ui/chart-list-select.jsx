import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import CHARTS from '../data/charts.json';
import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import FoundAtTooltip from './found-at-tooltip';
import Images from './images';
import KeyDownWrapper from './key-down-wrapper';
import Tooltip from './tooltip';

class ChartListSelect extends React.PureComponent {
  static NUM_ROWS = 20;

  mapChart(chartName) {
    const {
      openedChart,
      trackerState,
      updateChartMapping,
    } = this.props;

    if (_.isNil(chartName)) {
      return null;
    }

    const itemCount = trackerState.getItemValue(chartName);

    const mappedIslandForChart = trackerState.getIslandsForChart(chartName);
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
        updateChartMapping(chartName, openedChart);
      }
    };

    const chartElement = (
      <div
        className={`detail-span ${notInteractiveClassName} ${color} font-smallest`}
        onClick={updateChartMappingFunc}
        onContextMenu={updateChartMappingFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateChartMappingFunc)}
        role="button"
        tabIndex="0"
      >
        {chartName}
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

    return <td key={chartName}>{chartContent}</td>;
  }

  chart(chartName, showLocationTooltip = true) {
    if (_.isNil(chartName)) {
      return null;
    }

    const {
      decrementItem,
      incrementItem,
      spheres,
      trackerState,
      trackSpheres,
    } = this.props;

    const itemCount = trackerState.getItemValue(chartName);

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
    };

    const decrementItemFunc = (event) => {
      event.preventDefault();

      decrementItem(chartName);
    };

    const chartElement = (
      <div
        className={`detail-span ${color} font-smallest`}
        onClick={incrementItemFunc}
        onContextMenu={decrementItemFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(incrementItemFunc)}
        role="button"
        tabIndex="0"
      >
        {chartName}
      </div>
    );

    const outerChartElement = !_.isEmpty(locations) ? (
      <td key={chartName}>
        <Tooltip
          tooltipContent={
            <FoundAtTooltip locations={locations} spheres={spheres} />
          }
        >
          {chartElement}
        </Tooltip>
      </td>
    ) : (
      <td key={chartName}>{chartElement}</td>
    );

    return outerChartElement;
  }

  render() {
    const { clearOpenedMenus, openedChart } = this.props;
    const treasureCharts = _.sortBy(_.filter(CHARTS, (o) => o.includes('Treasure Chart')), (o) => LogicHelper.parseChartNumber(o));
    const triforceCharts = _.sortBy(_.filter(CHARTS, (o) => o.includes('Triforce Chart')), (o) => LogicHelper.parseChartNumber(o));

    const chartChunks = _.chunk([...treasureCharts, ...triforceCharts], ChartListSelect.NUM_ROWS);
    const arrangedCharts = _.zip(...chartChunks);

    const chartType = (chart) => (openedChart ? this.mapChart(chart) : this.chart(chart));

    const chartRows = _.map(arrangedCharts, (chartsRow, index) => (
      <tr key={index}>
        {_.map(chartsRow, (chart) => chartType(chart))}
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
              {openedChart && (
              <td>
                <div className="detail-span detail-not-interactive">
                  Choose Chart
                </div>
              </td>
              )}
              <td>
                <div
                  className="detail-span"
                  onClick={clearOpenedMenus}
                  onKeyDown={KeyDownWrapper.onSpaceKey(clearOpenedMenus)}
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
          <tbody>{chartRows}</tbody>
        </table>
      </div>
    );
  }
}

ChartListSelect.defaultProps = {
  openedChart: null,
};

ChartListSelect.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  openedChart: PropTypes.string,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  updateChartMapping: PropTypes.func.isRequired,
};

export default ChartListSelect;
