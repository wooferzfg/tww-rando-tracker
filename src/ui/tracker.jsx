import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

import LogicHelper from '../services/logic-helper';
import TrackerController from '../services/tracker-controller';

import Buttons from './buttons';
import Images from './images';
import ItemsTable from './items-table';
import LocationsTable from './locations-table';
import Statistics from './statistics';
import Storage from './storage';

import 'react-toastify/dist/ReactToastify.css';

class Tracker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      disableLogic: false,
      entrancesListOpen: false,
      isLoading: true,
      itemTrackerOpen: true,
      onlyProgressLocations: true,
      openedChart: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
      singleColorBackground: false,
    };

    this.initialize();

    this.clearOpenedMenus = this.clearOpenedMenus.bind(this);
    this.clearRaceModeBannedLocations = this.clearRaceModeBannedLocations.bind(this);
    this.incrementItem = this.incrementItem.bind(this);
    this.toggleDisableLogic = this.toggleDisableLogic.bind(this);
    this.toggleEntrancesList = this.toggleEntrancesList.bind(this);
    this.toggleLocationChecked = this.toggleLocationChecked.bind(this);
    this.toggleItemTracker = this.toggleItemTracker.bind(this);
    this.toggleOnlyProgressLocations = this.toggleOnlyProgressLocations.bind(this);
    this.toggleSingleColorBackground = this.toggleSingleColorBackground.bind(this);
    this.unsetChart = this.unsetChart.bind(this);
    this.unsetExit = this.unsetExit.bind(this);
    this.updateEntranceForExit = this.updateEntranceForExit.bind(this);
    this.updateIslandForChart = this.updateIslandForChart.bind(this);
    this.updateOpenedChart = this.updateOpenedChart.bind(this);
    this.updateOpenedExit = this.updateOpenedExit.bind(this);
    this.updateOpenedLocation = this.updateOpenedLocation.bind(this);
  }

  async initialize() {
    await Images.importImages();

    const {
      loadProgress,
      match: {
        params: { permalink },
      },
    } = this.props;

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
      trackerState,
    } = initialData;

    this.setState({
      isLoading: false,
      logic,
      saveData,
      trackerState,
    });
  }

  incrementItem(itemName) {
    const { trackerState } = this.state;

    const newTrackerState = trackerState.incrementItem(itemName);

    this.updateTrackerState(newTrackerState);
  }

  toggleLocationChecked(generalLocation, detailedLocation) {
    const { trackerState } = this.state;

    const newTrackerState = trackerState.toggleLocationChecked(generalLocation, detailedLocation);

    this.updateTrackerState(newTrackerState);
  }

  clearRaceModeBannedLocations(dungeonName) {
    let { trackerState: newTrackerState } = this.state;

    const raceModeBannedLocations = LogicHelper.raceModeBannedLocations(dungeonName);

    _.forEach(raceModeBannedLocations, ({ generalLocation, detailedLocation }) => {
      if (!newTrackerState.isLocationChecked(generalLocation, detailedLocation)) {
        newTrackerState = newTrackerState.toggleLocationChecked(generalLocation, detailedLocation);
      }
    });

    this.updateTrackerState(newTrackerState);
  }

  updateTrackerState(newTrackerState) {
    const {
      logic,
      saveData,
      trackerState,
    } = TrackerController.refreshState(newTrackerState);

    Storage.saveToStorage(saveData);

    this.setState({
      logic,
      saveData,
      trackerState,
    });
  }

  toggleDisableLogic() {
    const { disableLogic } = this.state;

    this.setState({
      disableLogic: !disableLogic,
    });
  }

  clearOpenedMenus() {
    this.setState({
      entrancesListOpen: false,
      openedChart: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  updateOpenedChart(chartName) {
    this.setState({
      entrancesListOpen: false,
      openedChart: chartName,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  unsetChart(chartName) {
    const { trackerState } = this.state;

    const newTrackerState = trackerState
      .incrementItem(chartName)
      .unsetIslandForChart(chartName);

    this.updateTrackerState(newTrackerState);
  }

  updateIslandForChart(chartName, islandName) {
    const { trackerState } = this.state;

    const newTrackerState = trackerState.setIslandForChart(chartName, islandName);

    this.updateTrackerState(newTrackerState);
    this.clearOpenedMenus();
  }

  updateOpenedExit(dungeonOrCaveName) {
    this.setState({
      entrancesListOpen: false,
      openedChart: null,
      openedExit: dungeonOrCaveName,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  unsetExit(dungeonOrCaveName) {
    const { trackerState } = this.state;

    const entryName = LogicHelper.entryName(dungeonOrCaveName);
    const newTrackerState = trackerState
      .incrementItem(entryName)
      .unsetEntranceForExit(dungeonOrCaveName);

    this.updateTrackerState(newTrackerState);
  }

  updateEntranceForExit(exitName, entranceName) {
    const { trackerState } = this.state;

    const entryName = LogicHelper.entryName(exitName);
    const newTrackerState = trackerState
      .incrementItem(entryName)
      .setEntranceForExit(exitName, entranceName);

    this.updateTrackerState(newTrackerState);
    this.clearOpenedMenus();
  }

  updateOpenedLocation({ locationName, isDungeon }) {
    this.setState({
      entrancesListOpen: false,
      openedChart: null,
      openedExit: null,
      openedLocation: locationName,
      openedLocationIsDungeon: isDungeon,
    });
  }

  toggleEntrancesList() {
    const { entrancesListOpen } = this.state;

    this.setState({
      entrancesListOpen: !entrancesListOpen,
      openedChart: null,
      openedExit: null,
      openedLocation: null,
      openedLocationIsDungeon: null,
    });
  }

  toggleItemTracker() {
    const { itemTrackerOpen } = this.state;

    this.setState({
      itemTrackerOpen: !itemTrackerOpen,
    });
  }

  toggleOnlyProgressLocations() {
    const { onlyProgressLocations } = this.state;

    this.setState({
      onlyProgressLocations: !onlyProgressLocations,
    });
  }

  toggleSingleColorBackground() {
    const { singleColorBackground } = this.state;

    this.setState({
      singleColorBackground: !singleColorBackground,
    });
  }

  render() {
    const {
      disableLogic,
      entrancesListOpen,
      isLoading,
      itemTrackerOpen,
      logic,
      onlyProgressLocations,
      openedChart,
      openedExit,
      openedLocation,
      openedLocationIsDungeon,
      saveData,
      singleColorBackground,
      trackerState,
    } = this.state;

    let content;

    if (isLoading) {
      content = (
        <div className="loading-spinner">
          <Loader color="white" type="Oval" />
        </div>
      );
    } else {
      content = (
        <div className="tracker-container">
          <div className="tracker">
            <ItemsTable
              incrementItem={this.incrementItem}
              itemTrackerOpen={itemTrackerOpen}
              singleColorBackground={singleColorBackground}
              trackerState={trackerState}
              unsetChart={this.unsetChart}
              updateOpenedChart={this.updateOpenedChart}
            />
            <LocationsTable
              clearOpenedMenus={this.clearOpenedMenus}
              clearRaceModeBannedLocations={this.clearRaceModeBannedLocations}
              disableLogic={disableLogic}
              entrancesListOpen={entrancesListOpen}
              incrementItem={this.incrementItem}
              logic={logic}
              onlyProgressLocations={onlyProgressLocations}
              openedChart={openedChart}
              openedExit={openedExit}
              openedLocation={openedLocation}
              openedLocationIsDungeon={openedLocationIsDungeon}
              singleColorBackground={singleColorBackground}
              toggleLocationChecked={this.toggleLocationChecked}
              trackerState={trackerState}
              unsetExit={this.unsetExit}
              updateEntranceForExit={this.updateEntranceForExit}
              updateIslandForChart={this.updateIslandForChart}
              updateOpenedChart={this.updateOpenedChart}
              updateOpenedExit={this.updateOpenedExit}
              updateOpenedLocation={this.updateOpenedLocation}
            />
            <Statistics
              disableLogic={disableLogic}
              logic={logic}
              onlyProgressLocations={onlyProgressLocations}
              singleColorBackground={singleColorBackground}
            />
          </div>
          <Buttons
            disableLogic={disableLogic}
            entrancesListOpen={entrancesListOpen}
            itemTrackerOpen={itemTrackerOpen}
            onlyProgressLocations={onlyProgressLocations}
            saveData={saveData}
            singleColorBackground={singleColorBackground}
            toggleDisableLogic={this.toggleDisableLogic}
            toggleEntrancesList={this.toggleEntrancesList}
            toggleItemTracker={this.toggleItemTracker}
            toggleOnlyProgressLocations={this.toggleOnlyProgressLocations}
            toggleSingleColorBackground={this.toggleSingleColorBackground}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      permalink: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Tracker;
