import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import LogicLoader from './logic-loader';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Settings from './settings';
import TrackerState from './tracker-state';

export default class TrackerController {
  static async initializeFromPermalink(permalink) {
    Settings.initializeFromPermalink(permalink);

    const {
      itemLocationsFile,
      macrosFile,
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();

    return this.refreshState(
      TrackerState.default(),
    );
  }

  static initializeFromSaveData(saveData) {
    const {
      locations,
      macros,
      settings,
      trackerState,
    } = JSON.parse(saveData);

    Settings.initializeManually(settings);

    Locations.initialize(locations);
    Macros.initialize(macros);

    LogicHelper.initialize();

    return this.refreshState(
      TrackerState.createStateManually(trackerState),
    );
  }

  static refreshState(newState) {
    const logic = new LogicCalculation(newState);

    return {
      logic,
      trackerState: newState,
    };
  }
}
