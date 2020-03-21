import Locations from './locations';
import LogicLoader from './logic-loader';
import Macros from './macros';
import TrackerState from '../tracker/tracker-state';

export default class LogicController {
  static async initialize() {
    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    TrackerState.initialize();
  }
}
