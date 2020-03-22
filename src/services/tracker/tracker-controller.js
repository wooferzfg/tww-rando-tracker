import Locations from '../logic/locations';
import LogicLoader from '../logic/logic-loader';
import Macros from '../logic/macros';
import TrackerState from './tracker-state';
import Settings from './settings';
import LogicTweaks from '../logic/logic-tweaks';
import LogicController from '../logic/logic-controller';

export default class TrackerController {
  static async initialize() {
    Settings.initialize({ version: '1.7.0' });

    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    LogicTweaks.updateLocations();

    Macros.initialize(macrosFile);
    LogicTweaks.updateMacros();

    LogicController.setStartingAndImpossibleItems();

    this.state = TrackerState.default();
  }
}
