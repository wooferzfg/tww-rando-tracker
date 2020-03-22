import _ from 'lodash';

import CAVES from '../../data/caves';
import CHARTS from '../../data/charts';
import DUNGEONS from '../../data/dungeons';
import ITEMS from '../../data/items';
import KEYS from '../../data/keys';
import SHORT_DUNGEON_NAMES from '../../data/short-dungeon-names';

export default class LogicController {
  static allItems() {
    return _.concat(
      _.map(CAVES, (cave) => this.caveEntryName(cave)),
      CHARTS,
      _.map(DUNGEONS, (dungeon) => this.dungeonEntryName(dungeon)),
      ITEMS,
      KEYS
    );
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
}
