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
      disableLogic,
      entrancesListOpen,
      itemTrackerOpen,
      onlyProgressLocations,
      singleColorBackground,
      toggleDisableLogic,
      toggleEntrancesList,
      toggleItemTracker,
      toggleOnlyProgressLocations,
      toggleSingleColorBackground,
    } = this.props;

    const disableLogicText = disableLogic
      ? 'Show Location Logic'
      : 'Hide Location Logic';

    const itemTrackerText = itemTrackerOpen
      ? 'Show Chart Tracker'
      : 'Show Item Tracker';

    const onlyProgressLocationsText = onlyProgressLocations
      ? 'Show Non-Progress Locations'
      : 'Hide Non-Progress Locations';

    const singleColorBackgroundText = singleColorBackground
      ? 'Hide Single Color Background'
      : 'Show Single Color Background';

    const entrancesListText = entrancesListOpen
      ? 'Close Entrances'
      : 'View Entrances';
    const isRandomEntrances = LogicHelper.isRandomEntrances();

    return (
      <div className="buttons">
        <button
          onClick={this.exportProgress}
          type="button"
        >
          Export Progress
        </button>
        <button
          onClick={toggleItemTracker}
          type="button"
        >
          {itemTrackerText}
        </button>
        <button
          onClick={toggleOnlyProgressLocations}
          type="button"
        >
          {onlyProgressLocationsText}
        </button>
        {
          isRandomEntrances && (
            <button
              onClick={toggleEntrancesList}
              type="button"
            >
              {entrancesListText}
            </button>
          )
        }
        <button
          onClick={toggleDisableLogic}
          type="button"
        >
          {disableLogicText}
        </button>
        <button
          onClick={toggleSingleColorBackground}
          type="button"
        >
          {singleColorBackgroundText}
        </button>
      </div>
    );
  }
}

Buttons.propTypes = {
  disableLogic: PropTypes.bool.isRequired,
  entrancesListOpen: PropTypes.bool.isRequired,
  itemTrackerOpen: PropTypes.bool.isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  saveData: PropTypes.string.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  toggleDisableLogic: PropTypes.func.isRequired,
  toggleEntrancesList: PropTypes.func.isRequired,
  toggleItemTracker: PropTypes.func.isRequired,
  toggleOnlyProgressLocations: PropTypes.func.isRequired,
  toggleSingleColorBackground: PropTypes.func.isRequired,
};

export default Buttons;
