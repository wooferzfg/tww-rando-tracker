import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import LogicLoader from './logic-loader';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Settings from './settings';
import TrackerState from './tracker-state';

export default class TrackerController {
  static async initialize(settings, callbacks) {
    Settings.initialize(settings);

    this.callbacks = callbacks;

    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();

    const trackerState = TrackerState.default();
    this._refreshState(trackerState);
  }

  static initializeFromSaveData(settings, callbacks, saveData) {
    Settings.initialize(settings);

    this.callbacks = callbacks;

    const {
      itemLocations,
      macros,

      entrances,
      items,
      locationsChecked
    } = saveData;

    Locations.initialize(itemLocations);
    Macros.initialize(macros);

    LogicHelper.initialize();

    const trackerState = TrackerState.createStateManually({
      entrances,
      items,
      locationsChecked
    });
    this._refreshState(trackerState);
  }

  static _refreshState(newState) {
    const newLogic = new LogicCalculation(newState);

    this.callbacks.stateUpdated({ newLogic, newState });
  }
}
