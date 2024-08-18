import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ColorPicker from './color-picker';
import KeyDownWrapper from './key-down-wrapper';

class SettingsWindow extends React.PureComponent {
  static #DEFAULT_EXTRA_LOCATIONS_BACKGROUND = '#a0a0a0';

  static #DEFAULT_ITEMS_TABLE_BACKGROUND = '#69891c';

  static #DEFAULT_STATISTICS_BACKGROUND = '#4f4f4f';

  static #DEFAULT_SPHERE_TRACKING_BACKGROUND = '#dcdcdc';

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

  checkboxRow(labelText, pickedValue, key, getCheckedValue = (value) => value) {
    const checkboxId = `${key}-checkbox`;

    const toggleFunc = () => {
      const { updatePreferences } = this.props;

      updatePreferences({ [key]: !pickedValue });
    };

    return (
      <div className="settings-window-row">
        <input
          className="settings-window-checkbox"
          checked={getCheckedValue(pickedValue)}
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
      clearAllIncludesMail,
      disableLogic,
      extraLocationsBackground,
      itemsTableBackground,
      rightClickToClearAll,
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
          SettingsWindow.#DEFAULT_EXTRA_LOCATIONS_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Items',
          itemsTableBackground,
          'itemsTableBackground',
          SettingsWindow.#DEFAULT_ITEMS_TABLE_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Statistics',
          statisticsBackground,
          'statisticsBackground',
          SettingsWindow.#DEFAULT_STATISTICS_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Sphere Tracking',
          sphereTrackingBackground,
          'sphereTrackingBackground',
          SettingsWindow.#DEFAULT_SPHERE_TRACKING_BACKGROUND,
        )}
        {this.checkboxRow(
          'Show Location Logic',
          disableLogic,
          'disableLogic',
          (value) => !value,
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
        {this.checkboxRow(
          'Right Click to Clear All',
          rightClickToClearAll,
          'rightClickToClearAll',
        )}
        {this.checkboxRow(
          'Clear All Includes Dungeon Mail',
          clearAllIncludesMail,
          'clearAllIncludesMail',
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
  clearAllIncludesMail: PropTypes.bool.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  extraLocationsBackground: PropTypes.string,
  itemsTableBackground: PropTypes.string,
  rightClickToClearAll: PropTypes.bool.isRequired,
  sphereTrackingBackground: PropTypes.string,
  statisticsBackground: PropTypes.string,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  toggleSettingsWindow: PropTypes.func.isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  updatePreferences: PropTypes.func.isRequired,
};

export default SettingsWindow;
