import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import LogicLoader from './logic-loader';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Settings from './settings';
import TrackerState from './tracker-state';

export default class TrackerController {
  static async initialize(permalink) {
    Settings.initializeFromPermalink(permalink);

    const {
      itemLocationsFile,
      macrosFile,
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();

    return this.refreshState(TrackerState.default());
  }

  static initializeFromSaveData(saveData, callbacks) {
    const {
      flags,
      options,
      version,

      itemLocations,
      macros,

      entrances,
      items,
      locationsChecked,
    } = saveData;

    Settings.initializeManually({
      flags,
      options,
      version,
    });

    this.callbacks = callbacks;

    Locations.initialize(itemLocations);
    Macros.initialize(macros);

    LogicHelper.initialize();

    const trackerState = TrackerState.createStateManually({
      entrances,
      items,
      locationsChecked,
    });
    this._refreshState(trackerState);
  }

  static refreshState(newState) {
    const logic = new LogicCalculation(newState);

    return {
      logic,
      trackerState: newState,
    };
  }
}
