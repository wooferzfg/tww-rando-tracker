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

  constructor(props) {
    super(props);

    this.settingsWindowRef = React.createRef();

    this.state = {
      activeTab: 'general',
      dragging: false,
      dragOffset: null,
      dragPosition: props.settingsWindowPosition,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.keepInBounds = this.keepInBounds.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('resize', this.keepInBounds);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.keepInBounds);
  }

  handleMouseDown(event) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    const {
      dragPosition,
    } = this.state;

    this.setState({
      dragging: true,
      dragOffset: {
        x: event.clientX - dragPosition.x,
        y: event.clientY - dragPosition.y,
      },
    });
  }

  handleMouseMove(event) {
    const {
      dragging,
      dragOffset,
    } = this.state;

    if (!dragging || !dragOffset) {
      return;
    }

    const windowElement = this.settingsWindowRef.current;

    if (!windowElement) {
      return;
    }

    const width = windowElement.offsetWidth;
    const height = windowElement.offsetHeight;

    const maxX = Math.max(window.innerWidth - width, 0);
    const maxY = Math.max(window.innerHeight - height, 0);

    this.setState({
      dragPosition: {
        x: Math.min(Math.max(event.clientX - dragOffset.x, 0), maxX),
        y: Math.min(Math.max(event.clientY - dragOffset.y, 0), maxY),
      },
    });
  }

  handleMouseUp() {
    const {
      dragging,
      dragPosition,
    } = this.state;

    if (!dragging) {
      return;
    }

    const {
      updateSettingsWindowPosition,
    } = this.props;

    updateSettingsWindowPosition(dragPosition);

    this.setState({
      dragging: false,
      dragOffset: null,
    });
  }

  settingsTab(label, tab) {
    return (
      <button
        onClick={() => this.setState({ activeTab: tab })}
        type="button"
      >
        {label}
      </button>
    );
  }

  keepInBounds() {
    const element = this.settingsWindowRef.current;

    if (!element) {
      return;
    }

    const { dragPosition } = this.state;

    const maxX = Math.max(
      window.innerWidth - element.offsetWidth,
      0,
    );

    const maxY = Math.max(
      window.innerHeight - element.offsetHeight,
      0,
    );

    const newPosition = {
      x: Math.min(Math.max(dragPosition.x, 0), maxX),
      y: Math.min(Math.max(dragPosition.y, 0), maxY),
    };

    if (
      newPosition.x !== dragPosition.x
      || newPosition.y !== dragPosition.y
    ) {
      this.setState({
        dragPosition: newPosition,
      });

      const {
        updateSettingsWindowPosition,
      } = this.props;

      updateSettingsWindowPosition(newPosition);
    }
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
    const {
      activeTab,
      dragPosition,
    } = this.state;
    const {
      clearAllIncludesMail,
      disableLogic,
      enableItemCycling,
      extraLocationsBackground,
      itemsTableBackground,
      rightClickToClearAll,
      showBeedleLocations,
      showCyclosLocations,
      showGhostShipLocations,
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
        ref={this.settingsWindowRef}
        className="settings-window"
        style={{
          left: `${dragPosition.x}px`,
          top: `${dragPosition.y}px`,
        }}
      >
        <div
          className="settings-window-top-row"
          onMouseDown={this.handleMouseDown}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
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
          {this.settingsTab('General', 'general')}
          {this.settingsTab('Display', 'display')}
          {this.settingsTab('Colors', 'colors')}
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
};

SettingsWindow.propTypes = {
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
  showCyclosLocations: PropTypes.bool.isRequired,
  showGhostShipLocations: PropTypes.bool.isRequired,
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
