import _ from 'lodash';

import CAVES from '../../data/caves';
import CHARTS from '../../data/charts';
import DUNGEONS from '../../data/dungeons';
import ITEMS from '../../data/items';
import KEYS from '../../data/keys';
import SHORT_DUNGEON_NAMES from '../../data/short-dungeon-names';

import Settings from '../tracker/settings';

export default class LogicController {
  static allItems() {
    return _.concat(
      _.map(CAVES, (cave) => this.caveEntryName(cave)),
      CHARTS,
      _.map(DUNGEONS, (dungeon) => this.dungeonEntryName(dungeon)),
      _.keys(ITEMS),
      _.keys(KEYS)
    );
  }

  static isMainDungeon(dungeonName) {
    if (dungeonName === 'Forsaken Fortress' || dungeonName === "Ganon's Tower") {
      return false;
    }
    return _.includes(DUNGEONS, dungeonName);
  }

  static shortDungeonName(dungeonName) {
    const dungeonIndex = _.indexOf(DUNGEONS, dungeonName);
    return SHORT_DUNGEON_NAMES[dungeonIndex];
  }

  static dungeonEntryName(dungeonName) {
    const shortDungeonName = this.shortDungeonName(dungeonName);
    return this._entryName(shortDungeonName);
  }

  static shortCaveName(caveName) {
    return _.replace(caveName, /Secret |Warp Maze /g, '');
  }

  static caveEntryName(caveName) {
    const shortCaveName = this.shortCaveName(caveName);
    return this._entryName(shortCaveName);
  }

  static _entryName(locationName) {
    return `Entered ${locationName}`;
  }

  static _randomizeEntrancesOption() {
    return Settings.getOptionValue('randomizeEntrances');
  }

  static isRandomDungeonEntrances() {
    return _.includes(this._randomizeEntrancesOption(), 'Dungeons');
  }

  static isRandomCaveEntrances() {
    return _.includes(this._randomizeEntrancesOption(), 'Secret Caves');
  }

  static isRandomEntrancesTogether() {
    return _.includes(this._randomizeEntrancesOption(), 'Together');
  }
}
