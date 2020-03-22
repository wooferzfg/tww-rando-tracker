import _ from 'lodash';

import CAVES from '../../data/caves';
import CHARTS from '../../data/charts';
import DUNGEONS from '../../data/dungeons';
import HAS_ACCESSED_LOCATION_TWEAKS from '../../data/has-accessed-location-tweaks';

import Locations from './locations';
import LogicController from './logic-controller';
import Macros from './macros';
import Settings from '../tracker/settings';

export default class LogicTweaks {
  static updateLocations() {
    this._addDefeatGanondorf();
    this._updateTingleStatueReward();
    this._applyHasAccessedLocationTweaksForLocations();
  }

  static updateMacros() {
    this._updateDungeonEntranceMacros();
    this._updateCaveEntranceMacros();
    this._updateChartMacros();
    this._updateTriforceMacro();
    this._applyHasAccessedLocationTweaksForMacros();
  }

  static _addDefeatGanondorf() {
    Locations.setLocation(
      "Ganon's Tower",
      'Defeat Ganondorf',
      'need',
      'Can Reach and Defeat Ganondorf'
    );
  }

  static _updateTingleStatueReward() {
    Locations.setLocation(
      'Tingle Island',
      'Ankle - Reward for All Tingle Statues',
      'need',
      'Tingle Statue x5'
    );
  }

  static _replaceCanAccessOtherLocation(requirements) {
    return requirements.replace(/Can Access Other Location/g, 'Has Accessed Other Location');
  }

  static _applyHasAccessedLocationTweaksForLocations() {
    const itemLocationTweaks = HAS_ACCESSED_LOCATION_TWEAKS.itemLocations;
    _.forEach(itemLocationTweaks, (generalLocationInfo, generalLocation) => {
      _.forEach(generalLocationInfo, (detailedLocation) => {
        const requirements = Locations.getLocation(generalLocation, detailedLocation).need;
        const newNeeds = this._replaceCanAccessOtherLocation(requirements);

        Locations.setLocation(
          generalLocation,
          detailedLocation,
          'need',
          newNeeds
        );
      });
    });
  }

  static _applyHasAccessedLocationTweaksForMacros() {
    const macrosTweaks = HAS_ACCESSED_LOCATION_TWEAKS.macros;
    _.forEach(macrosTweaks, (macroName) => {
      const macroValue = Macros.getMacro(macroName);
      const newMacro = this._replaceCanAccessOtherLocation(macroValue);
      Macros.setMacro(macroName, newMacro);
    });
  }

  static _canAccessMacroName(locationName) {
    return `Can Access ${locationName}`;
  }

  static _updateDungeonEntranceMacros() {
    if (LogicController.isRandomDungeonEntrances()) {
      _.forEach(DUNGEONS, (dungeon) => {
        if (LogicController.isMainDungeon(dungeon)) {
          const macroName = this._canAccessMacroName(dungeon);
          const entryName = LogicController.dungeonEntryName(dungeon);
          Macros.setMacro(macroName, entryName);
        }
      });
    }
  }

  static _updateCaveEntranceMacros() {
    if (LogicController.isRandomCaveEntrances()) {
      _.forEach(CAVES, (cave) => {
        const macroName = this._canAccessMacroName(cave);
        const entryName = LogicController.caveEntryName(cave);
        Macros.setMacro(macroName, entryName);
      });
    }
  }

  static _updateChartMacros() {
    if (Settings.getOptionValue('randomizeCharts')) {
      _.forEach(CHARTS, (chart, index) => {
        // We assume everything is a Treasure Chart and clear any additional requirements like
        // wallet upgrades
        const macroName = `Chart for Island ${index + 1}`;
        Macros.setMacro(macroName, chart);
      });
    }
  }

  static _updateTriforceMacro() {
    Macros.setMacro('All 8 Triforce Shards', 'Triforce Shard x8');
  }
}
