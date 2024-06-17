import BinaryString from './binary-string';
import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import LogicLoader from './logic-loader';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Settings from './settings';
import Spheres from './spheres';
import TrackerState from './tracker-state';

class TrackerController {
  static async initializeLocationsAndMacros(permalink) {
    const permalinkBinaryString = BinaryString.fromBase64(permalink);
    this.#loadVersion(permalinkBinaryString);
    await this.#loadLocationsAndMacros();
  }

  static async initializeFromPermalink(permalink) {
    const permalinkBinaryString = BinaryString.fromBase64(permalink);
    this.#loadVersion(permalinkBinaryString);
    await this.#loadLocationsAndMacros();

    // excluded locations depend on Locations already being loaded
    Settings.initializeFromPermalink(permalinkBinaryString);

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();

    return this.refreshState(
      TrackerState.default(),
    );
  }

  static initializeFromSaveData(saveData) {
    const {
      locations,
      locationsList,
      macros,
      settings,
      trackerState,
    } = JSON.parse(saveData);

    Settings.initializeRaw(settings);

    Locations.initializeRaw(locations, locationsList);
    Macros.initialize(macros);

    LogicHelper.initialize();

    return this.refreshState(
      TrackerState.createStateRaw(trackerState),
    );
  }

  static reset() {
    Locations.reset();
    LogicHelper.reset();
    Macros.reset();
    Settings.reset();
  }

  static refreshState(newState) {
    const logic = new LogicCalculation(newState);
    const spheres = new Spheres(newState);
    const saveData = this.#getSaveData(newState);

    return {
      logic,
      saveData,
      spheres,
      trackerState: newState,
    };
  }

  static #getSaveData(trackerState) {
    const saveData = {
      locations: Locations.readAll(),
      locationsList: Locations.readLocationsList(),
      macros: Macros.readAll(),
      settings: Settings.readAll(),
      trackerState: trackerState.readState(),
    };

    return JSON.stringify(saveData);
  }

  static #loadVersion(permalinkBinaryString) {
    Settings.initializeVersionFromPermalink(permalinkBinaryString);
  }

  static async #loadLocationsAndMacros() {
    const {
      itemLocationsFile,
      macrosFile,
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);
  }
}

export default TrackerController;
