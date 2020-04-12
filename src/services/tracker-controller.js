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

    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();

    this.callbacks = callbacks;

    this._refreshState(TrackerState.default());
  }

  static _refreshState(newState) {
    const newLogic = new LogicCalculation(newState);

    this.callbacks.stateUpdated({ newLogic, newState });
  }
}
