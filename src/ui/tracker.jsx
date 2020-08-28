import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

import LogicHelper from "../services/logic-helper";
import TrackerController from "../services/tracker-controller";

import Buttons from "./buttons";
import Images from "./images";
import ItemsTable from "./items-table";
import LocationsTable from "./locations-table";
import Statistics from "./statistics";
import Storage from "./storage";

import "react-toastify/dist/ReactToastify.css";

class Tracker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      disableLogic: false,
      isLoading: true,
      onlyProgressLocations: true,
      singleColorBackground: false,
    };

    this.initialize();

    this.clearRaceModeBannedLocations = this.clearRaceModeBannedLocations.bind(
      this
    );
    this.incrementItem = this.incrementItem.bind(this);
    this.toggleDisableLogic = this.toggleDisableLogic.bind(this);
    this.toggleLocationChecked = this.toggleLocationChecked.bind(this);
    this.toggleOnlyProgressLocations = this.toggleOnlyProgressLocations.bind(
      this
    );
    this.toggleSingleColorBackground = this.toggleSingleColorBackground.bind(
      this
    );
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

          toast.success("Progress loaded!");
        } catch (err) {
          TrackerController.reset();
        }
      }

      if (_.isNil(initialData)) {
        toast.error("Could not load progress from save data!");
      }
    }

    if (_.isNil(initialData)) {
      try {
        initialData = await TrackerController.initializeFromPermalink(
          permalink
        );
      } catch (err) {
        toast.error("Tracker could not be initialized!");

        throw err;
      }
    }

    const { logic, saveData, trackerState } = initialData;

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

    const newTrackerState = trackerState.toggleLocationChecked(
      generalLocation,
      detailedLocation
    );

    this.updateTrackerState(newTrackerState);
  }

  clearRaceModeBannedLocations(dungeonName) {
    let { trackerState: newTrackerState } = this.state;

    const raceModeBannedLocations = LogicHelper.raceModeBannedLocations(
      dungeonName
    );

    _.forEach(
      raceModeBannedLocations,
      ({ generalLocation, detailedLocation }) => {
        if (
          !newTrackerState.isLocationChecked(generalLocation, detailedLocation)
        ) {
          newTrackerState = newTrackerState.toggleLocationChecked(
            generalLocation,
            detailedLocation
          );
        }
      }
    );

    this.updateTrackerState(newTrackerState);
  }

  updateTrackerState(newTrackerState) {
    const { logic, saveData, trackerState } = TrackerController.refreshState(
      newTrackerState
    );

    Storage.saveToStorage(saveData);

    this.setState({
      logic,
      trackerState,
    });
  }

  toggleDisableLogic() {
    const { disableLogic } = this.state;

    this.setState({
      disableLogic: !disableLogic,
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
      isLoading,
      logic,
      onlyProgressLocations,
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
              singleColorBackground={singleColorBackground}
              trackerState={trackerState}
            />
            <LocationsTable
              clearRaceModeBannedLocations={this.clearRaceModeBannedLocations}
              disableLogic={disableLogic}
              incrementItem={this.incrementItem}
              logic={logic}
              onlyProgressLocations={onlyProgressLocations}
              singleColorBackground={singleColorBackground}
              toggleLocationChecked={this.toggleLocationChecked}
              trackerState={trackerState}
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
            onlyProgressLocations={onlyProgressLocations}
            saveData={saveData}
            singleColorBackground={singleColorBackground}
            toggleDisableLogic={this.toggleDisableLogic}
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
