import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Permalink from '../services/permalink';
import Settings from '../services/settings';

import ColorPicker from './color-picker';
import KeyDownWrapper from './key-down-wrapper';

class SettingsWindow extends React.PureComponent {
  static #DEFAULT_EXTRA_LOCATIONS_BACKGROUND = '#a0a0a0';

  static #DEFAULT_ITEMS_TABLE_BACKGROUND = '#69891c';

  static #DEFAULT_STATISTICS_BACKGROUND = '#4f4f4f';

  static #DEFAULT_SPHERE_TRACKING_BACKGROUND = '#dcdcdc';

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'general',
      dragging: false,
      dragOffset: {
        x: 0,
        y: 0,
      },
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown(event) {
    const {
      settingsWindowPosition,
    } = this.props;

    this.setState({
      dragging: true,
      dragOffset: {
        x: event.clientX - settingsWindowPosition.x,
        y: event.clientY - settingsWindowPosition.y,
      },
    });
  }

  handleMouseMove(event) {
    const {
      dragging,
      dragOffset,
    } = this.state;

    if (!dragging) {
      return;
    }

    const {
      updateSettingsWindowPosition,
    } = this.props;

    updateSettingsWindowPosition({
      x: event.clientX - dragOffset.x,
      y: event.clientY - dragOffset.y,
    });
  }

  handleMouseUp() {
    this.setState({
      dragging: false,
    });
  }

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

  checkboxRow(
    labelText,
    pickedValue,
    key,
    getCheckedValue = (value) => value,
  ) {
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
    const { activeTab } = this.state;

    const {
      clearAllIncludesBoss,
      clearAllIncludesMail,
      disableLogic,
      enableItemCycling,
      extraLocationsBackground,
      itemsTableBackground,
      rightClickToClearAll,
      settingsWindowPosition,
      showBeedleLocations,
      showClearAll,
      showCyclosLocations,
      showDungeonMapsAndCompasses,
      showGhostShipLocations,
      showRequiredBossToggle,
      showResetAll,
      showSalvageCorpLocations,
      sphereTrackingBackground,
      statisticsBackground,
      toggleSettingsWindow,
      trackNonProgressBlueChuJelly,
      trackNonProgressCharts,
      trackSpheres,
    } = this.props;

    return (
      <div
        className="settings-window"
        style={{
          left: `${settingsWindowPosition.x}px`,
          top: `${settingsWindowPosition.y}px`,
        }}
      >
        <div
          className="settings-window-top-row"
          onMouseDown={this.handleMouseDown}
        >
          <div className="settings-window-title">
            Settings
          </div>
          <div
            className="close-button"
            onClick={toggleSettingsWindow}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={KeyDownWrapper.onSpaceKey(toggleSettingsWindow)}
            role="button"
            tabIndex="0"
          >
            X Close
          </div>
        </div>
        <div className="settings-tabs">
          <button
            onClick={() => this.setState({ activeTab: 'general' })}
            type="button"
          >
            General
          </button>
          <button
            onClick={() => this.setState({ activeTab: 'display' })}
            type="button"
          >
            Display
          </button>
          <button
            onClick={() => this.setState({ activeTab: 'colors' })}
            type="button"
          >
            Colors
          </button>
        </div>
        {activeTab === 'general' && (
          <>
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
              'Track Non-Progress Blue Chu Jelly',
              trackNonProgressBlueChuJelly,
              'trackNonProgressBlueChuJelly',
            )}
            {this.checkboxRow(
              'Enable Item Cycling',
              enableItemCycling,
              'enableItemCycling',
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
            {this.checkboxRow(
              'Clear All Includes Boss Heart Container',
              clearAllIncludesBoss,
              'clearAllIncludesBoss',
            )}
          </>
        )}
        {activeTab === 'display' && (
          <>
            {this.checkboxRow(
              'Show Location Logic',
              disableLogic,
              'disableLogic',
              (value) => !value,
            )}
            {this.checkboxRow(
              'Show 20 Rupee Beedle Locations',
              showBeedleLocations,
              'showBeedleLocations',
            )}
            {this.checkboxRow(
              'Show Salvage Corp Locations',
              showSalvageCorpLocations,
              'showSalvageCorpLocations',
            )}
            {this.checkboxRow(
              'Show Cyclos Locations',
              showCyclosLocations,
              'showCyclosLocations',
            )}
            {this.checkboxRow(
              'Show Ghost Ship Locations',
              showGhostShipLocations,
              'showGhostShipLocations',
            )}
            {this.checkboxRow(
              'Show Dungeon Maps and Compasses',
              showDungeonMapsAndCompasses,
              'showDungeonMapsAndCompasses',
            )}

            {this.checkboxRow(
              'Show Clear All Button',
              showClearAll,
              'showClearAll',
            )}
            {this.checkboxRow(
              'Show Reset All Button',
              showResetAll,
              'showResetAll',
            )}
            {Settings.getOptionValue(Permalink.OPTIONS.REQUIRED_BOSSES)
              && this.checkboxRow(
              'Show Required Boss Toggle',
              showRequiredBossToggle,
              'showRequiredBossToggle',
            )}
          </>
        )}

        {activeTab === 'colors' && (
          <>
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
          </>
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
  settingsWindowPosition: {
    x: 20,
    y: 300,
  },
};

SettingsWindow.propTypes = {
  clearAllIncludesBoss: PropTypes.bool.isRequired,
  clearAllIncludesMail: PropTypes.bool.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  enableItemCycling: PropTypes.bool.isRequired,
  extraLocationsBackground: PropTypes.string,
  itemsTableBackground: PropTypes.string,
  rightClickToClearAll: PropTypes.bool.isRequired,
  settingsWindowPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  showBeedleLocations: PropTypes.bool.isRequired,
  showClearAll: PropTypes.bool.isRequired,
  showCyclosLocations: PropTypes.bool.isRequired,
  showDungeonMapsAndCompasses: PropTypes.bool.isRequired,
  showGhostShipLocations: PropTypes.bool.isRequired,
  showRequiredBossToggle: PropTypes.bool.isRequired,
  showResetAll: PropTypes.bool.isRequired,
  showSalvageCorpLocations: PropTypes.bool.isRequired,
  sphereTrackingBackground: PropTypes.string,
  statisticsBackground: PropTypes.string,
  toggleSettingsWindow: PropTypes.func.isRequired,
  trackNonProgressBlueChuJelly: PropTypes.bool.isRequired,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  updateSettingsWindowPosition: PropTypes.func.isRequired,
};

export default SettingsWindow;