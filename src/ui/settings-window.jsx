import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ColorPicker from './color-picker';
import KeyDownWrapper from './key-down-wrapper';

class SettingsWindow extends React.PureComponent {
  static _DEFAULT_EXTRA_LOCATIONS_BACKGROUND = '#a0a0a0';

  static _DEFAULT_ITEMS_TABLE_BACKGROUND = '#69891c';

  static _DEFAULT_STATISTICS_BACKGROUND = '#4f4f4f';

  static _DEFAULT_SPHERE_TRACKING_BACKGROUND = '#dcdcdc';

  colorPickerRow(label, pickedColor, key, defaultValue) {
    const isColorSet = !_.isNil(pickedColor);
    const labelText = `Override ${label} Background Color`;
    const checkboxId = `${key}-checkbox`;

    const updateFunc = (color) => {
      const { updatePreferences } = this.props;

      updatePreferences({
        colors: {
          [key]: color,
        },
      });
    };

    const toggleFunc = () => {
      const newColor = _.isNil(pickedColor) ? defaultValue : null;

      updateFunc(newColor);
    };

    return (
      <div className="settings-window-row">
        <input
          className="settings-window-checkbox"
          checked={isColorSet}
          id={checkboxId}
          onChange={() => toggleFunc()}
          type="checkbox"
        />
        <label
          className="settings-window-label"
          htmlFor={checkboxId}
        >
          {labelText}
        </label>
        {isColorSet && (
          <ColorPicker
            color={pickedColor}
            updateColor={(color) => updateFunc(color)}
          />
        )}
      </div>
    );
  }

  checkboxRow(labelText, pickedValue, key) {
    const checkboxId = `${key}-checkbox`;

    const toggleFunc = () => {
      const { updatePreferences } = this.props;

      updatePreferences({ [key]: !pickedValue });
    };

    return (
      <div className="settings-window-row">
        <input
          className="settings-window-checkbox"
          checked={pickedValue}
          id={checkboxId}
          onChange={() => toggleFunc()}
          type="checkbox"
        />
        <label
          className="settings-window-label"
          htmlFor={checkboxId}
        >
          {labelText}
        </label>
      </div>
    );
  }

  render() {
    const {
      disableLogic,
      extraLocationsBackground,
      itemsTableBackground,
      sphereTrackingBackground,
      statisticsBackground,
      toggleSettingsWindow,
      trackNonProgressCharts,
      trackSpheres,
    } = this.props;

    return (
      <div className="settings-window">
        <div className="settings-window-top-row">
          <div className="settings-window-title">Settings</div>
          <div
            className="close-button"
            onClick={toggleSettingsWindow}
            onKeyDown={KeyDownWrapper.onSpaceKey(toggleSettingsWindow)}
            role="button"
            tabIndex="0"
          >
            X Close
          </div>
        </div>
        {this.colorPickerRow(
          'Locations',
          extraLocationsBackground,
          'extraLocationsBackground',
          SettingsWindow._DEFAULT_EXTRA_LOCATIONS_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Items',
          itemsTableBackground,
          'itemsTableBackground',
          SettingsWindow._DEFAULT_ITEMS_TABLE_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Statistics',
          statisticsBackground,
          'statisticsBackground',
          SettingsWindow._DEFAULT_STATISTICS_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Sphere Tracking',
          sphereTrackingBackground,
          'sphereTrackingBackground',
          SettingsWindow._DEFAULT_SPHERE_TRACKING_BACKGROUND,
        )}
        {this.checkboxRow(
          'Show Location Logic',
          disableLogic,
          'disableLogic',
        )}
        {this.checkboxRow(
          'Track Spheres',
          trackSpheres,
          'trackSpheres',
        )}
        {this.checkboxRow(
          'Track Non-Progress Charts',
          trackNonProgressCharts,
          'trackNonProgressCharts',
        )}
      </div>
    );
  }
}

SettingsWindow.defaultProps = {
  extraLocationsBackground: null,
  itemsTableBackground: null,
  sphereTrackingBackground: null,
  statisticsBackground: null,
};

SettingsWindow.propTypes = {
  disableLogic: PropTypes.bool.isRequired,
  extraLocationsBackground: PropTypes.string,
  itemsTableBackground: PropTypes.string,
  sphereTrackingBackground: PropTypes.string,
  statisticsBackground: PropTypes.string,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  toggleSettingsWindow: PropTypes.func.isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  updatePreferences: PropTypes.func.isRequired,
};

export default SettingsWindow;
