import _ from 'lodash';

import CHARTS from '../data/charts.json';
import HAS_ACCESSED_LOCATION_TWEAKS from '../data/has-accessed-location-tweaks.json';
import ISLANDS from '../data/islands.json';

import Locations from './locations';
import LogicHelper from './logic-helper';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';

/**
 * This class handles modifications that must be made to the randomizer logic
 * in order for it to work correctly with the tracker.
 *
 * @class
 */
class LogicTweaks {
  /**
   * This method makes the necessary modifications to the `Locations` and
   * `Macros` for the tracker to function correctly.
   */
  static applyTweaks() {
    this.#updateLocations();
    this.#updateMacros();
  }

  static applyHasAccessedLocationTweaksForLocations() {
    const itemLocationTweaks = HAS_ACCESSED_LOCATION_TWEAKS.itemLocations;
    _.forEach(itemLocationTweaks, (generalLocationInfo, generalLocation) => {
      _.forEach(generalLocationInfo, (detailedLocation) => {
        const requirements = Locations.getLocation(
          generalLocation,
          detailedLocation,
          Locations.KEYS.NEED,
        );
        const newNeeds = this.#replaceCanAccessOtherLocation(requirements);

        Locations.setLocation(
          generalLocation,
          detailedLocation,
          Locations.KEYS.NEED,
          newNeeds,
        );
      });
    });
  }

  static #updateLocations() {
    this.#addDefeatGanondorf();
    this.#updateTingleStatueReward();
    this.#updateSunkenTriforceTypes();
    this.applyHasAccessedLocationTweaksForLocations();
  }

  static #updateMacros() {
    this.#updateRandomEntranceMacros();
    this.#updateChartMacros();
    this.#updateTriforceMacro();
    this.#applyHasAccessedLocationTweaksForMacros();
    this.#updateRequiredBossesModeMacro();
  }

  static #addDefeatGanondorf() {
    Locations.setLocation(
      LogicHelper.DUNGEONS.GANONS_TOWER,
      LogicHelper.DEFEAT_GANONDORF_LOCATION,
      Locations.KEYS.NEED,
      'Can Reach and Defeat Ganondorf',
    );
  }

  static #updateTingleStatueReward() {
    Locations.setLocation(
      LogicHelper.ISLANDS.TINGLE_ISLAND,
      'Ankle - Reward for All Tingle Statues',
      Locations.KEYS.NEED,
      'Tingle Statue x5',
    );
  }

  static #updateSunkenTriforceTypes() {
    if (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
      return;
    }

    _.forEach(ISLANDS, (islandName) => {
      const originalItem = Locations.getLocation(
        islandName,
        'Sunken Treasure',
        Locations.KEYS.ORIGINAL_ITEM,
      );

      if (_.startsWith(originalItem, 'Triforce Shard')) {
        Locations.setLocation(
          islandName,
          'Sunken Treasure',
          Locations.KEYS.TYPES,
          Settings.FLAGS.SUNKEN_TRIFORCE,
        );
      }
    });
  }

  static #applyHasAccessedLocationTweaksForMacros() {
    const macrosTweaks = HAS_ACCESSED_LOCATION_TWEAKS.macros;
    _.forEach(macrosTweaks, (macroName) => {
      const macroValue = Macros.getMacro(macroName);
      const newMacro = this.#replaceCanAccessOtherLocation(macroValue);
      Macros.setMacro(macroName, newMacro);
    });
  }

  static #updateRandomEntranceMacros() {
    _.forEach(LogicHelper.allRandomEntrances(), (exitMacroName) => {
      const macroName = `Can Access ${exitMacroName}`;
      const entryName = LogicHelper.entryName(exitMacroName);
      Macros.setMacro(macroName, entryName);
    });
  }

  static #updateChartMacros() {
    if (!Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
      return;
    }

    _.forEach(CHARTS, (chart, index) => {
      // assume everything is a Treasure Chart and clear any additional requirements like
      // wallet upgrades
      const island = LogicHelper.islandForChart(chart);
      const macroName = `Chart for Island ${index + 1}`;
      Macros.setMacro(macroName, LogicHelper.randomizedChartForIsland(island));
    });
  }

  static #updateTriforceMacro() {
    Macros.setMacro('All 8 Triforce Shards', 'Triforce Shard x8');
  }

  static #updateRequiredBossesModeMacro() {
    if (!Settings.getOptionValue(Permalink.OPTIONS.REQUIRED_BOSSES)) {
      return;
    }

    const bossRequirements = _.map(
      LogicHelper.REQUIRED_BOSSES_MODE_DUNGEONS,
      (dungeonName) => LogicHelper.bossRequirementForDungeon(dungeonName),
    );
    const macroValue = _.join(bossRequirements, ` ${LogicHelper.TOKENS.AND} `);
    Macros.setMacro('Can Defeat All Required Bosses', macroValue);
  }

  static #replaceCanAccessOtherLocation(requirements) {
    return requirements.replace(/Can Access Item Location/g, 'Has Accessed Other Location');
  }
}

export default LogicTweaks;
