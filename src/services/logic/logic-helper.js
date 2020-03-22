import _ from 'lodash';

import CAVES from '../../data/caves';
import CHARTS from '../../data/charts';
import DUNGEONS from '../../data/dungeons';
import ITEMS from '../../data/items';
import KEYS from '../../data/keys';
import PROGRESSIVE_STARTING_ITEMS from '../../data/progressive-starting-items';
import REGULAR_STARTING_ITEMS from '../../data/regular-starting-items';
import SHORT_DUNGEON_NAMES from '../../data/short-dungeon-names';

import Settings from '../tracker/settings';

export default class LogicHelper {
  static allItems() {
    return _.concat(
      _.map(CAVES, (cave) => this.caveEntryName(cave)),
      CHARTS,
      _.map(DUNGEONS, (dungeon) => this.dungeonEntryName(dungeon)),
      _.keys(ITEMS),
      _.keys(KEYS)
    );
  }

  static setStartingAndImpossibleItems() {
    this.startingItems = {
      "Hero's Shield": 1,
      'Wind Waker': 1,
      "Boat's Sail": 1,
      "Wind's Requiem": 1,
      'Ballad of Gales': 1,
      'Song of Passing': 1,
      'Triforce Shard': Settings.getOptionValue('numStartingTriforceShards')
    };
    this.impossibleItems = [];

    let gearRemaining = Settings.getOptionValue('startingGear');
    _.forEach(REGULAR_STARTING_ITEMS, (itemName) => {
      this.startingItems[itemName] = gearRemaining % 2;
      gearRemaining = _.floor(gearRemaining / 2);
    });
    _.forEach(PROGRESSIVE_STARTING_ITEMS, (itemName) => {
      this.startingItems[itemName] = gearRemaining % 4;
      gearRemaining = _.floor(gearRemaining / 4);
    });

    const swordMode = Settings.getOptionValue('swordMode');
    if (swordMode === 'Start with Sword') {
      this.startingItems['Progressive Sword'] += 1;
    } else if (swordMode === 'Swordless') {
      this.impossibleItems = [
        'Progressive Sword x1',
        'Progressive Sword x2',
        'Progressive Sword x3',
        'Progressive Sword x4',
        'Hurricane Spin'
      ];
    }
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
