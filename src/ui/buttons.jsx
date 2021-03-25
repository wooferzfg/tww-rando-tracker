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
      onlyProgressLocations,
      singleColorBackground,
      toggleDisableLogic,
      toggleEntrancesList,
      toggleOnlyProgressLocations,
      toggleSingleColorBackground,
    } = this.props;

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
          onClick={toggleOnlyProgressLocations}
          type="button"
        >
          <input type="checkbox" className="button-checkbox" checked={!onlyProgressLocations} />
          Show Non-Progress Locations
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
          <input type="checkbox" className="button-checkbox" checked={!disableLogic} />
          Show Location Logic
        </button>
        <button
          onClick={toggleSingleColorBackground}
          type="button"
        >
          <input type="checkbox" className="button-checkbox" checked={singleColorBackground} />
          Single Color Background
        </button>
      </div>
    );
  }
}

Buttons.propTypes = {
  disableLogic: PropTypes.bool.isRequired,
  entrancesListOpen: PropTypes.bool.isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  saveData: PropTypes.string.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  toggleDisableLogic: PropTypes.func.isRequired,
  toggleEntrancesList: PropTypes.func.isRequired,
  toggleOnlyProgressLocations: PropTypes.func.isRequired,
  toggleSingleColorBackground: PropTypes.func.isRequired,
};

export default Buttons;
