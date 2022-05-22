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

class ChartList extends React.PureComponent {
  static NUM_ROWS = 20;

  mapFakeChart(chartName) {
    const {
      trackerState,
    } = this.props;

    if (_.isNil(chartName)) {
      return null;
    }
    const fakeChartName = `Fake ${chartName}`;

    const { value, item } = trackerState.getFakeChartInfo(fakeChartName);
    const mappedChartValue = trackerState.getItemValue(item);

    let color;
    if (mappedChartValue === 1) {
      color = LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION;
    } else if (value === 1) {
      color = LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION;
    } else {
      color = LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION;
    }

    const chartElement = (
      <div
        className={`detail-span ${color} font-smallest`}
        role="button"
        tabIndex="0"
      >
        {chartName}
      </div>
    );

    let chartContent;
    if (mappedChartValue === 1) {
      const island = LogicHelper.islandForChart(chartName);

      const tooltip = (
        <div className="tooltip">
          <div className="tooltip-title">Chart Leads To</div>
          <div>{island}</div>
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

    const chartElement = (
      <div
        className={`detail-span ${color} font-smallest`}
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
    const { clearOpenedMenus } = this.props;
    const treasureCharts = _.sortBy(_.filter(CHARTS, (o) => o.includes('Treasure Chart')), (o) => LogicHelper.parseChartNumber(o));
    const triforceCharts = _.sortBy(_.filter(CHARTS, (o) => o.includes('Triforce Chart')), (o) => LogicHelper.parseChartNumber(o));

    const chartChunks = _.chunk([...treasureCharts, ...triforceCharts], ChartList.NUM_ROWS);
    const arrangedCharts = _.zip(...chartChunks);

    const chartRows = _.map(arrangedCharts, (chartsRow, index) => (
      <tr key={index}>
        {_.map(chartsRow, (chart) => (LogicHelper.isRandomizedCharts()
          ? this.mapFakeChart(chart)
          : this.chart(chart)))}
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

ChartList.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
};

export default ChartList;
