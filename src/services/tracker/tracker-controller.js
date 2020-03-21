import Locations from '../logic/locations';
import LogicLoader from '../logic/logic-loader';
import Macros from '../logic/macros';
import TrackerState from './tracker-state';
import Settings from './settings';

export default class TrackerController {
  static async initialize() {
    Settings.initialize({ version: '1.7.0' });

    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    this.state = TrackerState.default();
  }
}
