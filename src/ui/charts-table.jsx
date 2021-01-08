import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import TREASURE_CHARTS from '../data/treasure-charts.json';
import TRIFORCE_CHARTS from '../data/triforce-charts.json';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Item from './item';

class ChartsTable extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  chartItem(chartName, index) {
    const {
      incrementItem,
      trackerState,
      unsetChart,
    } = this.props;

    const chartType = _.includes(chartName, 'Treasure') ? LogicHelper.CHART_TYPES.TREASURE : LogicHelper.CHART_TYPES.TRIFORCE;
    const chartImages = _.get(Images.IMAGES, ['CHARTS', chartType]);
    const chartCount = trackerState.getItemValue(chartName);

    const incrementChartFunc = () => {
      if (LogicHelper.isRandomCharts() && chartCount > 0) {
        unsetChart(chartName);
      } else {
        incrementItem(chartName);
      }
    };

    return (
      <div className="treasure-chart">
        <Item
          clearSelectedItem={this.clearSelectedChart}
          images={chartImages}
          incrementItem={incrementChartFunc}
          itemCount={chartCount}
          itemName={chartName}
          setSelectedItem={this.setSelectedChart}
        />
        {index}
      </div>
    );
  }

  chartLocation(chartName) {
    const {
      trackerState,
      updateOpenedChart,
    } = this.props;

    const chartCount = trackerState.getItemValue(chartName);
    const islandName = trackerState.getIslandForChart(chartName);

    const updateIslandFunc = () => {
      updateOpenedChart(chartName);
    };

    if (!LogicHelper.isRandomCharts() || chartCount === 1) {
      if (islandName) {
        return islandName;
      }

      return (
        <div
          className="detail-span select-location"
          onClick={updateIslandFunc}
          onKeyDown={updateIslandFunc}
          role="button"
          tabIndex="0"
        >
          Select...
        </div>
      );
    }

    return '';
  }

  render() {
    const { singleColorBackground } = this.props;

    const triforceCharts = _.map(TRIFORCE_CHARTS, (chartName, index) => (
      <tr key={`triforce-${index + 1}`}>
        <td>
          {this.chartItem(chartName, index + 1)}
        </td>
        <td>&#10230;</td>
        <td>{this.chartLocation(chartName)}</td>
      </tr>
    ));
    const treasureCharts = _.map(TREASURE_CHARTS, (chartName, index) => (
      <tr key={`treasure-${index + 1}`}>
        <td>
          {this.chartItem(chartName, index + 1)}
        </td>
        <td>&#10230;</td>
        <td>{this.chartLocation(chartName)}</td>
      </tr>
    ));

    return (
      <div className={`chart-tracker ${singleColorBackground ? 'single-color' : ''}`}>
        <div className="chart-tracker-background">
          <img src={Images.IMAGES.ITEMS_TABLE_BACKGROUND} alt="" />
        </div>
        <table className="charts">
          <tbody>
            {triforceCharts}
            {treasureCharts}
          </tbody>
        </table>
      </div>
    );
  }
}

ChartsTable.propTypes = {
  incrementItem: PropTypes.func.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  unsetChart: PropTypes.func.isRequired,
  updateOpenedChart: PropTypes.func.isRequired,
};

export default ChartsTable;
