import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ColorPicker from './color-picker';
import KeyDownWrapper from './key-down-wrapper';

class ColorPickerWindow extends React.PureComponent {
  static _DEFAULT_EXTRA_LOCATIONS_BACKGROUND = '#a0a0a0';

  static _DEFAULT_ITEMS_TABLE_BACKGROUND = '#69891c';

  static _DEFAULT_STATISTICS_BACKGROUND = '#4f4f4f';

  static _DEFAULT_SPHERE_TRACKING_BACKGROUND = '#dcdcdc';

  colorPickerRow(label, pickedColor, key, defaultValue) {
    const isColorSet = !_.isNil(pickedColor);
    const labelText = `Override ${label} Background Color`;
    const checkboxId = `${key}-checkbox`;

    const updateFunc = (color) => {
      const { updateColors } = this.props;

      updateColors({ [key]: color });
    };

    const toggleFunc = () => {
      const newColor = _.isNil(pickedColor) ? defaultValue : null;

      updateFunc(newColor);
    };

    return (
      <div className="color-picker-row">
        <input
          className="color-picker-checkbox"
          checked={isColorSet}
          id={checkboxId}
          onChange={() => toggleFunc()}
          type="checkbox"
        />
        <label
          className="color-picker-label"
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

  render() {
    const {
      extraLocationsBackground,
      itemsTableBackground,
      sphereTrackingBackground,
      statisticsBackground,
      toggleColorPicker,
    } = this.props;

    return (
      <div className="color-picker-window">
        <div className="color-picker-top-row">
          <div className="color-picker-title">Color Picker</div>
          <div
            className="close-button"
            onClick={toggleColorPicker}
            onKeyDown={KeyDownWrapper.onSpaceKey(toggleColorPicker)}
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
          ColorPickerWindow._DEFAULT_EXTRA_LOCATIONS_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Items',
          itemsTableBackground,
          'itemsTableBackground',
          ColorPickerWindow._DEFAULT_ITEMS_TABLE_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Statistics',
          statisticsBackground,
          'statisticsBackground',
          ColorPickerWindow._DEFAULT_STATISTICS_BACKGROUND,
        )}
        {this.colorPickerRow(
          'Sphere Tracking',
          sphereTrackingBackground,
          'sphereTrackingBackground',
          ColorPickerWindow._DEFAULT_SPHERE_TRACKING_BACKGROUND,
        )}
      </div>
    );
  }
}

ColorPickerWindow.defaultProps = {
  extraLocationsBackground: null,
  itemsTableBackground: null,
  sphereTrackingBackground: null,
  statisticsBackground: null,
};

ColorPickerWindow.propTypes = {
  extraLocationsBackground: PropTypes.string,
  itemsTableBackground: PropTypes.string,
  sphereTrackingBackground: PropTypes.string,
  statisticsBackground: PropTypes.string,
  toggleColorPicker: PropTypes.func.isRequired,
  updateColors: PropTypes.func.isRequired,
};

export default ColorPickerWindow;
