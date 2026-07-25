import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Oval } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

import Hints from '../services/hints';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';
import TrackerController from '../services/tracker-controller';

import Buttons from './buttons';
import HintsTable from './hints-table';
import Images from './images';
import ItemsTable from './items-table';
import LocationsTable from './locations-table';
import SettingsWindow from './settings-window';
import SphereTracking from './sphere-tracking';
import Statistics from './statistics';
import Storage from './storage';

import 'react-toastify/dist/ReactToastify.css';

class Tracker extends React.PureComponent {
  static hasAllPathHints(trackerState) {
    if (!Settings.getOptionValue(Permalink.OPTIONS.REQUIRED_BOSSES)) {
      return false;
    }

    const numRequiredBosses = Settings.getOptionValue(Permalink.OPTIONS.NUM_REQUIRED_BOSSES);
    // Hints for Hyrule and Ganon's Tower do not narrow down the required bosses.
    const numHintedDungeons = _.size(_.intersection(
      trackerState.getPathHintGoals(),
      LogicHelper.REQUIRED_BOSSES_MODE_DUNGEONS,
    ));

    return numHintedDungeons >= numRequiredBosses;
  }

  static markNonRequiredBosses(trackerState, clearAllIncludesMail) {
    if (!Tracker.hasAllPathHints(trackerState)) {
      return trackerState;
    }

    const hintedGoals = trackerState.getPathHintGoals();

    return _.reduce(
      LogicHelper.REQUIRED_BOSSES_MODE_DUNGEONS,
      (newTrackerState, dungeonName) => {
        if (_.includes(hintedGoals, dungeonName) || !LogicHelper.isBossRequired(dungeonName)) {
          return newTrackerState;
        }

        LogicHelper.setBossNotRequired(dungeonName);

        return newTrackerState.clearBannedLocations(
          dungeonName,
          { includeAdditionalLocations: clearAllIncludesMail },
        );
      },
      trackerState,
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      autoMarkNonRequiredBosses: false,
      chartListOpen: false,
      clearAllIncludesMail: true,
      settingsWindowOpen: false,
      colors: {
        extraLocationsBackground: null,
        hintsTableBackground: null,
        itemsTableBackground: null,
        sphereTrackingBackground: null,
        statisticsBackground: null,
      },
      disableLogic: false,
      hintMode: false,
      isLoading: true,
      lastLocation: null,
      onlyProgressLocations: true,
      openedChartForIsland: null,
      openedEntrance: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
      pendingSelection: null,
      rightClickToClearAll: true,
      settingsWindowPosition: {
        x: 20,
        y: 300,
      },
      showBeedleLocations: false,
      showSalvageCorpLocations: false,
      showCyclosLocations: false,
      showGhostShipLocations: false,
      showHints: true,
      trackNonProgressCharts: false,
      trackSpheres: false,
      transientHintMode: false,
      viewingEntrances: false,
    };

    this.initialize();

    this.cancelHintSelection = this.cancelHintSelection.bind(this);
    this.clearAllLocations = this.clearAllLocations.bind(this);
    this.clearOpenedMenus = this.clearOpenedMenus.bind(this);
    this.decrementItem = this.decrementItem.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.incrementItem = this.incrementItem.bind(this);
    this.removeItemHint = this.removeItemHint.bind(this);
    this.removePathHint = this.removePathHint.bind(this);
    this.selectHintCheck = this.selectHintCheck.bind(this);
    this.selectHintGoal = this.selectHintGoal.bind(this);
    this.selectHintItem = this.selectHintItem.bind(this);
    this.selectHintLocation = this.selectHintLocation.bind(this);
    this.toggleChartList = this.toggleChartList.bind(this);
    this.toggleHintMode = this.toggleHintMode.bind(this);
    this.toggleSettingsWindow = this.toggleSettingsWindow.bind(this);
    this.toggleEntrances = this.toggleEntrances.bind(this);
    this.toggleLocationChecked = this.toggleLocationChecked.bind(this);
    this.toggleOnlyProgressLocations = this.toggleOnlyProgressLocations.bind(this);
    this.toggleRequiredBoss = this.toggleRequiredBoss.bind(this);
    this.unsetChartMapping = this.unsetChartMapping.bind(this);
    this.unsetEntrance = this.unsetEntrance.bind(this);
    this.unsetExit = this.unsetExit.bind(this);
    this.unsetLastLocation = this.unsetLastLocation.bind(this);
    this.updateChartMapping = this.updateChartMapping.bind(this);
    this.updateExitForEntrance = this.updateExitForEntrance.bind(this);
    this.updateOpenedChartForIsland = this.updateOpenedChartForIsland.bind(this);
    this.updateOpenedEntrance = this.updateOpenedEntrance.bind(this);
    this.updateOpenedExit = this.updateOpenedExit.bind(this);
    this.updateOpenedLocation = this.updateOpenedLocation.bind(this);
    this.updatePreferences = this.updatePreferences.bind(this);
    this.updateSettingsWindowPosition = this.updateSettingsWindowPosition.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.cancelHintSelection();
    }
  }

  async initialize() {
    await Images.importImages();

    const preferences = Storage.loadPreferences();
    if (!_.isNil(preferences)) {
      this.updatePreferences(preferences);
    }

    const { loadProgress, permalink } = this.props;

    let initialData;

    if (loadProgress) {
      const saveData = Storage.loadFromStorage();

      if (!_.isNil(saveData)) {
        try {
          initialData = TrackerController.initializeFromSaveData(saveData);

          toast.success('Progress loaded!');
        } catch (err) {
          TrackerController.reset();
        }
      }

      if (_.isNil(initialData)) {
        toast.error('Could not load progress from save data!');
      }
    }

    if (_.isNil(initialData)) {
      try {
        const decodedPermalink = decodeURIComponent(permalink);

        initialData = await TrackerController.initializeFromPermalink(decodedPermalink);
      } catch (err) {
        toast.error('Tracker could not be initialized!');

        throw err;
      }
    }

    const {
      logic,
      saveData,
      spheres,
      trackerState,
    } = initialData;

    this.setState({
      isLoading: false,
      logic,
      saveData,
      spheres,
      trackerState,
    });
  }

  incrementItem(itemName, trackItemLocation) {
    const {
      hintMode,
      lastLocation,
      trackerState,
    } = this.state;

    if (hintMode) {
      this.applyHintSelection(Hints.itemSelection(itemName));
      return;
    }

    let newTrackerState = trackerState.incrementItem(itemName);

    if (trackItemLocation && !_.isNil(lastLocation)) {
      const {
        generalLocation,
        detailedLocation,
      } = lastLocation;

      newTrackerState = newTrackerState.setItemForLocation(
        itemName,
        generalLocation,
        detailedLocation,
      );
    }

    this.updateTrackerState(newTrackerState);
  }

  decrementItem(itemName) {
    const { hintMode, trackerState } = this.state;

    if (hintMode) {
      return;
    }

    const newTrackerState = trackerState.decrementItem(itemName);

    this.updateTrackerState(newTrackerState);
  }

  toggleLocationChecked(generalLocation, detailedLocation) {
    const { hintMode, trackerState } = this.state;

    if (hintMode) {
      this.applyHintSelection(Hints.locationSelection(generalLocation, detailedLocation));
      return;
    }

    let newTrackerState = trackerState.toggleLocationChecked(generalLocation, detailedLocation);

    if (newTrackerState.isLocationChecked(generalLocation, detailedLocation)) {
      this.setState({
        lastLocation: {
          generalLocation,
          detailedLocation,
        },
      });
    } else {
      this.setState({ lastLocation: null });

      newTrackerState = newTrackerState.unsetItemForLocation(generalLocation, detailedLocation);
    }

    this.updateTrackerState(newTrackerState);
  }

  clearAllLocations(zoneName) {
    const {
      clearAllIncludesMail,
      trackerState,
    } = this.state;

    const newTrackerState = trackerState.clearBannedLocations(
      zoneName,
      { includeAdditionalLocations: clearAllIncludesMail },
    );

    this.updateTrackerState(newTrackerState);
  }

  toggleRequiredBoss(dungeonName) {
    let { trackerState: newTrackerState } = this.state;

    if (LogicHelper.isBossRequired(dungeonName)) {
      newTrackerState = newTrackerState.clearBannedLocations(
        dungeonName,
        { includeAdditionalLocations: true },
      );
      LogicHelper.setBossNotRequired(dungeonName);
    } else {
      LogicHelper.setBossRequired(dungeonName);
    }

    this.updateTrackerState(newTrackerState);
  }

  toggleHintMode() {
    const { hintMode } = this.state;

    this.setState({
      chartListOpen: false,
      hintMode: !hintMode,
      openedChartForIsland: null,
      openedEntrance: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
      pendingSelection: null,
      transientHintMode: false,
    });
  }

  cancelHintSelection() {
    const { hintMode, transientHintMode } = this.state;

    this.setState({
      hintMode: hintMode && !transientHintMode,
      pendingSelection: null,
      transientHintMode: false,
    });
  }

  selectHintGoal(goal, startedOnTheFly = false) {
    this.applyHintSelection(Hints.goalSelection(goal), startedOnTheFly);
  }

  selectHintItem(itemName) {
    // Items are only ever hinted by middle clicking them.
    this.applyHintSelection(Hints.itemSelection(itemName), true);
  }

  selectHintLocation(generalLocation, detailedLocation = null, startedOnTheFly = false) {
    this.applyHintSelection(
      Hints.locationSelection(generalLocation, detailedLocation),
      startedOnTheFly,
    );
  }

  selectHintCheck(generalLocation, detailedLocation) {
    const { pendingSelection, showHints, trackerState } = this.state;

    // Middle clicking a check on its own records that it holds something,
    // without saying what.
    if (showHints && _.isNil(pendingSelection)) {
      this.updateTrackerState(
        trackerState.addItemHint(Hints.UNKNOWN_ITEM, generalLocation, detailedLocation),
      );
      return;
    }

    this.selectHintLocation(generalLocation, detailedLocation, true);
  }

  applyHintSelection(newSelection, startedOnTheFly = false) {
    const {
      hintMode,
      pendingSelection,
      showHints,
      trackerState,
      transientHintMode,
    } = this.state;

    // Hints cannot be entered while the hints are hidden.
    if (!showHints) {
      return;
    }

    const {
      itemHint,
      pathHint,
      pendingSelection: newPendingSelection,
    } = Hints.applySelection(pendingSelection, newSelection);

    const hintWasCompleted = !_.isNil(pathHint) || !_.isNil(itemHint);
    // Middle clicking enters hint mode for a single hint, so that hints can be
    // entered without toggling the mode on and off around them.
    const isTransient = transientHintMode || (startedOnTheFly && !hintMode);

    this.setState({
      hintMode: !(hintWasCompleted && isTransient),
      pendingSelection: newPendingSelection,
      transientHintMode: isTransient && !hintWasCompleted,
    });
    // An opened location list stays open until the hint is complete, so that a
    // check can be picked right after the item it holds.
    if (hintWasCompleted) {
      this.clearOpenedMenus();
    }

    if (!_.isNil(pathHint)) {
      const newTrackerState = trackerState.addPathHint(pathHint.zone, pathHint.goal);

      this.updateTrackerState(this.applyAutoMarkNonRequiredBosses(trackerState, newTrackerState));
    } else if (!_.isNil(itemHint)) {
      this.updateTrackerState(trackerState.addItemHint(
        itemHint.itemName,
        itemHint.generalLocation,
        itemHint.detailedLocation,
      ));
    }
  }

  removePathHint(zone, goal) {
    const { trackerState } = this.state;

    this.updateTrackerState(trackerState.removePathHint(zone, goal));
  }

  removeItemHint(itemName, generalLocation, detailedLocation) {
    const { trackerState } = this.state;

    this.updateTrackerState(
      trackerState.removeItemHint(itemName, generalLocation, detailedLocation),
    );
  }

  applyAutoMarkNonRequiredBosses(previousTrackerState, newTrackerState) {
    const { autoMarkNonRequiredBosses, clearAllIncludesMail } = this.state;

    if (!autoMarkNonRequiredBosses) {
      return newTrackerState;
    }

    // Only mark when the path hints first become complete, so that bosses which
    // get marked required again afterwards stay that way.
    if (Tracker.hasAllPathHints(previousTrackerState)) {
      return newTrackerState;
    }

    return Tracker.markNonRequiredBosses(newTrackerState, clearAllIncludesMail);
  }

  updateTrackerState(newTrackerState) {
    const {
      logic,
      saveData,
      spheres,
      trackerState,
    } = TrackerController.refreshState(newTrackerState);

    Storage.saveToStorage(saveData);
    this.setState({
      logic,
      saveData,
      spheres,
      trackerState,
    });
  }

  clearOpenedMenus() {
    this.setState({
      chartListOpen: false,
      openedChartForIsland: null,
      openedEntrance: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  updateOpenedEntrance(entranceName) {
    const { hintMode } = this.state;

    // Entrances are not hintable, so they are inert in hint mode.
    if (hintMode) {
      return;
    }

    this.setState({
      chartListOpen: false,
      openedChartForIsland: null,
      openedEntrance: entranceName,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  updateOpenedExit(exitName) {
    const { hintMode } = this.state;

    if (hintMode) {
      return;
    }

    this.setState({
      chartListOpen: false,
      openedChartForIsland: null,
      openedEntrance: null,
      openedExit: exitName,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  unsetEntrance(entranceName) {
    const { hintMode, trackerState } = this.state;

    if (hintMode) {
      return;
    }

    const newTrackerState = trackerState.unsetEntrance(entranceName);

    this.updateTrackerState(newTrackerState);
  }

  unsetExit(exitName) {
    const { hintMode, trackerState } = this.state;

    if (hintMode) {
      return;
    }

    const newTrackerState = trackerState.unsetExit(exitName);

    this.updateTrackerState(newTrackerState);
  }

  updateExitForEntrance(entranceName, exitName) {
    const { trackerState } = this.state;

    const newTrackerState = trackerState.setExitForEntrance(entranceName, exitName);

    this.updateTrackerState(newTrackerState);
    this.clearOpenedMenus();
  }

  updateOpenedLocation({ locationName, isDungeon }) {
    const { hintMode, pendingSelection } = this.state;

    // Path hints always refer to a whole zone, so a pending goal completes the
    // hint immediately instead of opening the zone.
    if (hintMode && _.get(pendingSelection, 'type') === Hints.SELECTION_TYPES.GOAL) {
      this.applyHintSelection(Hints.locationSelection(locationName));
      return;
    }

    this.setState({
      chartListOpen: false,
      openedChartForIsland: null,
      openedEntrance: null,
      openedExit: null,
      openedLocation: locationName,
      openedLocationIsDungeon: isDungeon,
    });
  }

  updateChartMapping(chart, chartForIsland) {
    const { lastLocation, trackerState } = this.state;

    let newTrackerState = trackerState
      .setChartMapping(chart, chartForIsland);

    if (newTrackerState.getItemValue(chart) === 0) {
      newTrackerState = newTrackerState.incrementItem(chart);

      if (!_.isNil(lastLocation)) {
        const {
          generalLocation,
          detailedLocation,
        } = lastLocation;

        newTrackerState = newTrackerState.setItemForLocation(
          chart,
          generalLocation,
          detailedLocation,
        );
      }
    }

    if (newTrackerState.getItemValue(chartForIsland) === 0) {
      newTrackerState = newTrackerState.incrementItem(chartForIsland);
    }

    this.updateTrackerState(newTrackerState);
    this.clearOpenedMenus();
  }

  // Unset via sector should only remove mapping.
  // Unset via chart-list should remove both mapping and decrement chart.
  unsetChartMapping(chartForIsland, decrementChart) {
    const { hintMode, trackerState } = this.state;

    if (hintMode) {
      return;
    }

    let newTrackerState = trackerState;

    if (decrementChart) {
      const island = LogicHelper.islandFromChartForIsland(chartForIsland);
      const chart = trackerState.getChartFromChartMapping(island);

      newTrackerState = newTrackerState
        .decrementItem(chart);
    }

    newTrackerState = newTrackerState
      .decrementItem(chartForIsland)
      .unsetChartMapping(chartForIsland);

    this.updateTrackerState(newTrackerState);
  }

  updateOpenedChartForIsland(openedChartForIsland) {
    const { hintMode } = this.state;

    // Chart mapping items are not hintable, so they are inert in hint mode.
    if (hintMode) {
      return;
    }

    this.setState({
      chartListOpen: false,
      openedChartForIsland,
      openedEntrance: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  toggleChartList() {
    const { chartListOpen } = this.state;

    this.setState({
      chartListOpen: !chartListOpen,
      openedChartForIsland: null,
      openedEntrance: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  toggleOnlyProgressLocations() {
    const { onlyProgressLocations } = this.state;

    this.updatePreferences({ onlyProgressLocations: !onlyProgressLocations });
  }

  toggleSettingsWindow() {
    const { settingsWindowOpen } = this.state;

    this.setState({
      settingsWindowOpen: !settingsWindowOpen,
    });
  }

  toggleEntrances() {
    const { viewingEntrances } = this.state;

    this.updatePreferences({ viewingEntrances: !viewingEntrances });
  }

  unsetLastLocation() {
    this.setState({ lastLocation: null });
  }

  updateSettingsWindowPosition(position) {
    this.updatePreferences({
      settingsWindowPosition: position,
    });
  }

  updatePreferences(preferenceChanges) {
    const {
      autoMarkNonRequiredBosses,
      clearAllIncludesMail,
      disableLogic,
      onlyProgressLocations,
      colors,
      rightClickToClearAll,
      settingsWindowPosition,
      showBeedleLocations,
      showSalvageCorpLocations,
      showCyclosLocations,
      showGhostShipLocations,
      showHints,
      trackNonProgressCharts,
      trackNonProgressBlueChuJelly,
      trackSpheres,
      viewingEntrances,
    } = this.state;

    const existingPreferences = {
      autoMarkNonRequiredBosses,
      clearAllIncludesMail,
      colors,
      disableLogic,
      onlyProgressLocations,
      rightClickToClearAll,
      settingsWindowPosition,
      showBeedleLocations,
      showSalvageCorpLocations,
      showCyclosLocations,
      showGhostShipLocations,
      showHints,
      trackNonProgressCharts,
      trackNonProgressBlueChuJelly,
      trackSpheres,
      viewingEntrances,
    };

    const newPreferences = _.merge({}, existingPreferences, preferenceChanges);

    this.setState(newPreferences);
    Storage.savePreferences(newPreferences);

    // Hiding the hints also hides the way out of hint mode.
    if (!newPreferences.showHints) {
      this.setState({
        hintMode: false,
        pendingSelection: null,
        transientHintMode: false,
      });
    }

    const { trackerState } = this.state;

    // Preferences are also loaded before the tracker state exists.
    if (
      !autoMarkNonRequiredBosses
      && newPreferences.autoMarkNonRequiredBosses
      && !_.isNil(trackerState)
    ) {
      // Apply to the path hints that have already been recorded.
      this.updateTrackerState(Tracker.markNonRequiredBosses(
        trackerState,
        newPreferences.clearAllIncludesMail,
      ));
    }
  }

  render() {
    const {
      autoMarkNonRequiredBosses,
      chartListOpen,
      clearAllIncludesMail,
      colors,
      disableLogic,
      hintMode,
      isLoading,
      lastLocation,
      logic,
      onlyProgressLocations,
      openedChartForIsland,
      openedEntrance,
      openedExit,
      openedLocation,
      openedLocationIsDungeon,
      pendingSelection,
      rightClickToClearAll,
      saveData,
      settingsWindowOpen,
      settingsWindowPosition,
      spheres,
      showBeedleLocations,
      showSalvageCorpLocations,
      showCyclosLocations,
      showGhostShipLocations,
      showHints,
      trackNonProgressCharts,
      trackNonProgressBlueChuJelly,
      trackSpheres,
      trackerState,
      viewingEntrances,
    } = this.state;

    const {
      extraLocationsBackground,
      hintsTableBackground,
      itemsTableBackground,
      sphereTrackingBackground,
      statisticsBackground,
    } = colors;

    let content;

    if (isLoading) {
      content = (
        <div className="loading-spinner">
          <Oval color="white" secondaryColor="gray" />
        </div>
      );
    } else {
      content = (
        <div className="tracker-container">
          <div className="tracker">
            <ItemsTable
              backgroundColor={itemsTableBackground}
              decrementItem={this.decrementItem}
              incrementItem={this.incrementItem}
              selectHintItem={this.selectHintItem}
              spheres={spheres}
              trackerState={trackerState}
              trackSpheres={trackSpheres}
              trackNonProgressBlueChuJelly={trackNonProgressBlueChuJelly}
            />
            <LocationsTable
              backgroundColor={extraLocationsBackground}
              chartListOpen={chartListOpen}
              clearAllLocations={this.clearAllLocations}
              clearOpenedMenus={this.clearOpenedMenus}
              decrementItem={this.decrementItem}
              disableLogic={disableLogic}
              hintMode={hintMode}
              incrementItem={this.incrementItem}
              logic={logic}
              onlyProgressLocations={onlyProgressLocations}
              openedChartForIsland={openedChartForIsland}
              openedEntrance={openedEntrance}
              openedExit={openedExit}
              openedLocation={openedLocation}
              openedLocationIsDungeon={openedLocationIsDungeon}
              rightClickToClearAll={rightClickToClearAll}
              selectHintCheck={this.selectHintCheck}
              selectHintGoal={this.selectHintGoal}
              selectHintItem={this.selectHintItem}
              selectHintLocation={this.selectHintLocation}
              showBeedleLocations={showBeedleLocations}
              showSalvageCorpLocations={showSalvageCorpLocations}
              showCyclosLocations={showCyclosLocations}
              showGhostShipLocations={showGhostShipLocations}
              spheres={spheres}
              toggleLocationChecked={this.toggleLocationChecked}
              toggleRequiredBoss={this.toggleRequiredBoss}
              trackerState={trackerState}
              trackNonProgressCharts={trackNonProgressCharts}
              trackNonProgressBlueChuJelly={trackNonProgressBlueChuJelly}
              trackSpheres={trackSpheres}
              updateChartMapping={this.updateChartMapping}
              updateOpenedChartForIsland={this.updateOpenedChartForIsland}
              unsetChartMapping={this.unsetChartMapping}
              unsetEntrance={this.unsetEntrance}
              unsetExit={this.unsetExit}
              updateExitForEntrance={this.updateExitForEntrance}
              updateOpenedEntrance={this.updateOpenedEntrance}
              updateOpenedExit={this.updateOpenedExit}
              updateOpenedLocation={this.updateOpenedLocation}
              viewingEntrances={viewingEntrances}
            />
            <Statistics
              backgroundColor={statisticsBackground}
              disableLogic={disableLogic}
              logic={logic}
              onlyProgressLocations={onlyProgressLocations}
            />
            {showHints && (
              <HintsTable
                backgroundColor={hintsTableBackground}
                hintMode={hintMode}
                pendingSelection={pendingSelection}
                removeItemHint={this.removeItemHint}
                removePathHint={this.removePathHint}
                trackerState={trackerState}
              />
            )}
          </div>
          {trackSpheres && (
            <SphereTracking
              backgroundColor={sphereTrackingBackground}
              lastLocation={lastLocation}
              trackerState={trackerState}
              unsetLastLocation={this.unsetLastLocation}
            />
          )}
          {settingsWindowOpen && (
            <SettingsWindow
              autoMarkNonRequiredBosses={autoMarkNonRequiredBosses}
              clearAllIncludesMail={clearAllIncludesMail}
              disableLogic={disableLogic}
              extraLocationsBackground={extraLocationsBackground}
              hintsTableBackground={hintsTableBackground}
              itemsTableBackground={itemsTableBackground}
              rightClickToClearAll={rightClickToClearAll}
              settingsWindowPosition={settingsWindowPosition}
              showBeedleLocations={showBeedleLocations}
              showSalvageCorpLocations={showSalvageCorpLocations}
              showCyclosLocations={showCyclosLocations}
              showGhostShipLocations={showGhostShipLocations}
              showHints={showHints}
              sphereTrackingBackground={sphereTrackingBackground}
              statisticsBackground={statisticsBackground}
              toggleSettingsWindow={this.toggleSettingsWindow}
              trackNonProgressCharts={trackNonProgressCharts}
              trackNonProgressBlueChuJelly={trackNonProgressBlueChuJelly}
              trackSpheres={trackSpheres}
              updatePreferences={this.updatePreferences}
              updateSettingsWindowPosition={this.updateSettingsWindowPosition}
            />
          )}
          <Buttons
            settingsWindowOpen={settingsWindowOpen}
            chartListOpen={chartListOpen}
            hintMode={hintMode}
            onlyProgressLocations={onlyProgressLocations}
            saveData={saveData}
            showHints={showHints}
            toggleChartList={this.toggleChartList}
            toggleHintMode={this.toggleHintMode}
            toggleSettingsWindow={this.toggleSettingsWindow}
            toggleEntrances={this.toggleEntrances}
            toggleOnlyProgressLocations={this.toggleOnlyProgressLocations}
            trackNonProgressCharts={trackNonProgressCharts}
            viewingEntrances={viewingEntrances}
          />
        </div>
      );
    }

    return (
      <>
        {content}
        <ToastContainer />
      </>
    );
  }
}

Tracker.propTypes = {
  loadProgress: PropTypes.bool.isRequired,
  permalink: PropTypes.string.isRequired,
};

export default Tracker;
