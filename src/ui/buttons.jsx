import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';

import Storage from './storage';

class Buttons extends React.PureComponent {
  constructor(props) {
    super(props);

    this.exportProgress = this.exportProgress.bind(this);
  }

  async exportProgress() {
    const { saveData } = this.props;

    await Storage.exportFile(saveData);
  }

  render() {
    const {
      chartListOpen,
      isStartingItemMode,
      onlyProgressLocations,
      settingsWindowOpen,
      toggleChartList,
      toggleEntrances,
      toggleOnlyProgressLocations,
      toggleSettingsWindow,
      toggleStartingItemMode,
      trackNonProgressCharts,
      viewingEntrances,
    } = this.props;

    const settingsWindowText = settingsWindowOpen
      ? 'Close Settings'
      : 'Open Settings';
    const chartListText = chartListOpen
      ? 'Close Chart List'
      : 'View Charts';
    const isRandomEntrances = LogicHelper.isRandomEntrances();
    const showChartsButton = (
      trackNonProgressCharts
      || LogicHelper.anyProgressItemCharts()
    );

    return (
      <div className="buttons">
        <button
          onClick={toggleOnlyProgressLocations}
          type="button"
        >
          <input
            type="checkbox"
            className="button-checkbox"
            checked={!onlyProgressLocations}
            readOnly
          />
          Show Non-Progress Locations
        </button>
        {isRandomEntrances && (
          <button
            onClick={toggleEntrances}
            type="button"
          >
            <input
              type="radio"
              className="button-radio"
              checked={viewingEntrances}
              readOnly
            />
            View Entrances
            <input
              type="radio"
              className="button-radio second-button-radio"
              checked={!viewingEntrances}
              readOnly
            />
            View Exits
          </button>
        )}
        {showChartsButton && (
          <button
            onClick={toggleChartList}
            type="button"
          >
            {chartListText}
          </button>
        )}
        <button
          onClick={toggleStartingItemMode}
          type="button"
        >
          <input
            type="checkbox"
            className="button-checkbox"
            checked={isStartingItemMode}
            readOnly
          />
          Edit Starting Items
        </button>
        <br />
        <button
          onClick={this.exportProgress}
          type="button"
        >
          Export Progress
        </button>
        <button
          onClick={toggleSettingsWindow}
          type="button"
        >
          {settingsWindowText}
        </button>
      </div>
    );
  }
}

Buttons.propTypes = {
  chartListOpen: PropTypes.bool.isRequired,
  isStartingItemMode: PropTypes.bool.isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  saveData: PropTypes.string.isRequired,
  settingsWindowOpen: PropTypes.bool.isRequired,
  toggleChartList: PropTypes.func.isRequired,
  toggleEntrances: PropTypes.func.isRequired,
  toggleOnlyProgressLocations: PropTypes.func.isRequired,
  toggleSettingsWindow: PropTypes.func.isRequired,
  toggleStartingItemMode: PropTypes.func.isRequired,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  viewingEntrances: PropTypes.bool.isRequired,
};

export default Buttons;
