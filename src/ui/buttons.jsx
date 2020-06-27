import PropTypes from 'prop-types';
import React from 'react';

import Storage from './storage';

class Buttons extends React.Component {
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
      singleColorBackground,
      toggleSingleColorBackground,
    } = this.props;

    const singleColorBackgroundText = singleColorBackground
      ? 'Hide Single Color Background'
      : 'Show Single Color Background';

    return (
      <div className="buttons">
        <button
          onClick={this.exportProgress}
          type="button"
        >
          Export Progress
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
  saveData: PropTypes.string.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  toggleSingleColorBackground: PropTypes.func.isRequired,
};

export default Buttons;
