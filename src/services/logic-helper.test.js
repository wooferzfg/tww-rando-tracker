import _ from 'lodash';

import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';
import TEST_MACROS from '../data/test-macros.json';

import BooleanExpression from './boolean-expression';
import Locations from './locations';
import LogicHelper from './logic-helper';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';

describe('LogicHelper', () => {
  const fullSetup = (settingsOverrides = {}) => {
    const defaultSettings = {
      options: {
        [Permalink.OPTIONS.KEYLUNACY]: false,
        [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
        [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
        [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
        [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
        [Permalink.OPTIONS.MIX_ENTRANCES]: (
          Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
        ),
        [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
        [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
        [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
        [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
        [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
        [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
        [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
        [Permalink.OPTIONS.LOGIC_OBSCURITY]: Permalink.LOGIC_DIFFICULTY_OPTIONS.NONE,
        [Permalink.OPTIONS.LOGIC_PRECISION]: Permalink.LOGIC_DIFFICULTY_OPTIONS.NONE,
      },
      startingGear: {
        [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
      },
    };

    Settings.initializeRaw(_.merge(defaultSettings, settingsOverrides));

    Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
    Macros.initialize(_.cloneDeep(TEST_MACROS));

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();
  };

  beforeEach(() => {
    Locations.reset();
    LogicHelper.reset();
    Macros.reset();
    Settings.reset();

    LogicHelper.initialize();
  });

  describe('initialize', () => {
    describe('with no starting shards, no starting gear, and starting with a sword', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
          },
          startingGear: {
            [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
          },
        });
      });

      test('sets the starting and impossible items', () => {
        LogicHelper.initialize();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual({});
      });
    });

    describe('with starting shards', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 7,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
          },
          startingGear: {
            [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
          },
        });
      });

      test('sets the number of starting shards', () => {
        LogicHelper.initialize();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual({});
      });
    });

    describe('with starting gear', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
          },
          startingGear: {
            [LogicHelper.ITEMS.BOMBS]: 1,
            [LogicHelper.ITEMS.DEKU_LEAF]: 1,
            [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 2,
            'Dragon Tingle Statue': 1,
            'Earth Tingle Statue': 1,
            'Forbidden Tingle Statue': 1,
            'Goddess Tingle Statue': 1,
            'Wind Tingle Statue': 1,
          },
        });
      });

      test('sets the starting items based on the starting gear', () => {
        LogicHelper.initialize();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual({});
      });
    });

    describe('when starting without a sword', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
          },
          startingGear: {
            [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
          },
        });
      });

      test('sets sword to 0 in the starting items', () => {
        LogicHelper.initialize();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual({});
      });
    });

    describe('when in swordless mode', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.SWORDLESS,
          },
          startingGear: {
            [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
          },
        });
      });

      test('sets sword to 0 in the starting items and adds impossible items', () => {
        LogicHelper.initialize();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toMatchSnapshot();
      });
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      LogicHelper.startingItems = {
        'Grappling Hook': 1,
      };
      LogicHelper.impossibleItems = {
        'Deku Leaf': 1,
      };
    });

    test('resets the starting and impossible items', () => {
      LogicHelper.reset();

      expect(LogicHelper.startingItems).toEqual(null);
      expect(LogicHelper.impossibleItems).toEqual(null);
    });
  });

  describe('DUNGEONS', () => {
    test('returns the correct dungeons', () => {
      expect(LogicHelper.DUNGEONS).toMatchSnapshot();
    });
  });

  describe('ISLANDS', () => {
    test('returns the correct islands', () => {
      expect(LogicHelper.ISLANDS).toMatchSnapshot();
    });
  });

  describe('MISC_LOCATIONS', () => {
    test('returns the correct miscellanous locations', () => {
      expect(LogicHelper.MISC_LOCATIONS).toMatchSnapshot();
    });
  });

  describe('ITEMS', () => {
    test('returns the correct items', () => {
      expect(LogicHelper.ITEMS).toMatchSnapshot();
    });
  });

  describe('ALL_ITEMS', () => {
    test('returns a list of all the items, including entrances, charts, and keys', () => {
      expect(LogicHelper.ALL_ITEMS).toMatchSnapshot();
    });
  });

  describe('ALL_TREASURE_CHARTS', () => {
    test('returns expected treasure charts', () => {
      expect(LogicHelper.ALL_TREASURE_CHARTS).toMatchSnapshot();
    });
  });

  describe('ALL_TRIFORCE_CHARTS', () => {
    test('returns expected triforce charts', () => {
      expect(LogicHelper.ALL_TRIFORCE_CHARTS).toMatchSnapshot();
    });
  });

  describe('MAIN_DUNGEONS', () => {
    test('returns all dungeons with keys', () => {
      expect(LogicHelper.MAIN_DUNGEONS).toMatchSnapshot();
    });
  });

  describe('REQUIRED_BOSSES_MODE_DUNGEONS', () => {
    test('returns all dungeons in required bosses mode', () => {
      expect(LogicHelper.REQUIRED_BOSSES_MODE_DUNGEONS).toMatchSnapshot();
    });
  });

  describe('startingItemCount', () => {
    beforeEach(() => {
      LogicHelper.startingItems = {
        'Deku Leaf': 1,
      };
    });

    describe('when the item is in the starting items', () => {
      test('returns the starting item count', () => {
        const startingItemCount = LogicHelper.startingItemCount('Deku Leaf');

        expect(startingItemCount).toEqual(1);
      });
    });

    describe('when the item is not in the starting items', () => {
      test('returns 0', () => {
        const startingItemCount = LogicHelper.startingItemCount('Grappling Hook');

        expect(startingItemCount).toEqual(0);
      });
    });
  });

  describe('maxItemCount', () => {
    describe('when the item is a normal item', () => {
      test('returns 1', () => {
        const maxItemCount = LogicHelper.maxItemCount('Deku Leaf');

        expect(maxItemCount).toEqual(1);
      });
    });

    describe('when there can be multiple of the item', () => {
      test('returns the max quantity of the item', () => {
        const maxItemCount = LogicHelper.maxItemCount('Progressive Bow');

        expect(maxItemCount).toEqual(3);
      });
    });

    describe('when the item is a key', () => {
      test('returns the max quantity of the key', () => {
        const maxItemCount = LogicHelper.maxItemCount('DRC Small Key');

        expect(maxItemCount).toEqual(4);
      });
    });

    describe('when the item is not a normal item', () => {
      test('returns 1', () => {
        const maxItemCount = LogicHelper.maxItemCount('Entered DRC');

        expect(maxItemCount).toEqual(1);
      });
    });

    describe('when the item is impossible', () => {
      beforeEach(() => {
        LogicHelper.impossibleItems = {
          'Progressive Sword': 1,
        };
      });

      test('returns 1 less than the impossible item count', () => {
        const maxItemCount = LogicHelper.maxItemCount('Progressive Sword');

        expect(maxItemCount).toEqual(0);
      });
    });
  });

  describe('isMainDungeon', () => {
    describe('when the dungeon is a main dungeon', () => {
      test('returns true', () => {
        const isMainDungeon = LogicHelper.isMainDungeon('Dragon Roost Cavern');

        expect(isMainDungeon).toEqual(true);
      });
    });

    describe('when the dungeon is Forsaken Fortress', () => {
      test('returns false', () => {
        const isMainDungeon = LogicHelper.isMainDungeon('Forsaken Fortress');

        expect(isMainDungeon).toEqual(false);
      });
    });

    describe("when the dungeon is Ganon's Tower", () => {
      test('returns false', () => {
        const isMainDungeon = LogicHelper.isMainDungeon("Ganon's Tower");

        expect(isMainDungeon).toEqual(false);
      });
    });

    describe('when the argument is not a dungeon', () => {
      test('returns false', () => {
        const isMainDungeon = LogicHelper.isMainDungeon('Pawprint Isle');

        expect(isMainDungeon).toEqual(false);
      });
    });
  });

  describe('isDungeon', () => {
    describe('when the dungeon is a main dungeon', () => {
      test('returns true', () => {
        const isDungeon = LogicHelper.isDungeon('Dragon Roost Cavern');

        expect(isDungeon).toEqual(true);
      });
    });

    describe('when the dungeon is Forsaken Fortress', () => {
      test('returns true', () => {
        const isDungeon = LogicHelper.isDungeon('Forsaken Fortress');

        expect(isDungeon).toEqual(true);
      });
    });

    describe("when the dungeon is Ganon's Tower", () => {
      test('returns true', () => {
        const isDungeon = LogicHelper.isDungeon("Ganon's Tower");

        expect(isDungeon).toEqual(true);
      });
    });

    describe('when the argument is not a dungeon', () => {
      test('returns false', () => {
        const isDungeon = LogicHelper.isDungeon('Pawprint Isle');

        expect(isDungeon).toEqual(false);
      });
    });
  });

  describe('isRequiredBossesModeDungeon', () => {
    describe('when the dungeon is a required bosses mode dungeon', () => {
      test('returns true', () => {
        const isRequiredBossesModeDungeon = LogicHelper.isRequiredBossesModeDungeon('Dragon Roost Cavern');

        expect(isRequiredBossesModeDungeon).toEqual(true);
      });
    });

    describe('when the dungeon is Forsaken Fortress', () => {
      test('returns true', () => {
        const isRequiredBossesModeDungeon = LogicHelper.isRequiredBossesModeDungeon('Forsaken Fortress');

        expect(isRequiredBossesModeDungeon).toEqual(true);
      });
    });

    describe("when the dungeon is Ganon's Tower", () => {
      test('returns false', () => {
        const isRequiredBossesModeDungeon = LogicHelper.isRequiredBossesModeDungeon("Ganon's Tower");

        expect(isRequiredBossesModeDungeon).toEqual(false);
      });
    });

    describe('when the argument is not a dungeon', () => {
      test('returns false', () => {
        const isRequiredBossesModeDungeon = LogicHelper.isRequiredBossesModeDungeon('Pawprint Isle');

        expect(isRequiredBossesModeDungeon).toEqual(false);
      });
    });
  });

  describe('entryName', () => {
    test('returns the entry name based on a dungeon name', () => {
      const entryName = LogicHelper.entryName('Dragon Roost Cavern');

      expect(entryName).toEqual('Entered DRC');
    });

    test('returns the entry name based on a cave name', () => {
      const entryName = LogicHelper.entryName('Dragon Roost Island Secret Cave');

      expect(entryName).toEqual('Entered Dragon Roost Island Cave');
    });

    test('returns the entry name based on a boss name', () => {
      const entryName = LogicHelper.entryName('Gohma Boss Arena');

      expect(entryName).toEqual('Entered Gohma');
    });

    test('returns the entry name based on a miniboss name', () => {
      const entryName = LogicHelper.entryName('Forbidden Woods Miniboss Arena');

      expect(entryName).toEqual('Entered FW Miniboss');
    });

    test('returns the entry name based on an inner cave', () => {
      const entryName = LogicHelper.entryName('Ice Ring Isle Inner Cave');

      expect(entryName).toEqual('Entered Ice Ring Isle Inner Cave');
    });
  });

  describe('shortEntranceName', () => {
    test('returns the unmodified dungeon name', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Dragon Roost Cavern');

      expect(shortEntranceName).toEqual('Dragon Roost Cavern');
    });

    test('returns the cave name without mentioning secret caves', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Dragon Roost Island Secret Cave');

      expect(shortEntranceName).toEqual('Dragon Roost Island Cave');
    });

    test('returns the cave name without mentioning warp maze caves', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Diamond Steppe Island Warp Maze Cave');

      expect(shortEntranceName).toEqual('Diamond Steppe Island Cave');
    });

    test('only mentions the island name for Savage Labyrinth', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Savage Labyrinth');

      expect(shortEntranceName).toEqual('Outset Island Cave');
    });

    test('only mentions the island name for Cabana Labyrinth', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Cabana Labyrinth');

      expect(shortEntranceName).toEqual('Private Oasis Cave');
    });

    test('handles the Pawprint Isle main entrance correctly', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Pawprint Isle Chuchu Cave');

      expect(shortEntranceName).toEqual('Pawprint Isle Cave');
    });

    test('handles the Pawprint Isle Side Isle entrance correctly', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Pawprint Isle Wizzrobe Cave');

      expect(shortEntranceName).toEqual('Pawprint Isle Side Isle Cave');
    });

    test('returns the inner cave name', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Cliff Plateau Isles Inner Cave');

      expect(shortEntranceName).toEqual('Cliff Plateau Isles Inner Entrance');
    });

    test('returns the boss door name', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Kalle Demos Boss Arena');

      expect(shortEntranceName).toEqual('FW Boss Door');
    });

    test('returns the miniboss door name', () => {
      const shortEntranceName = LogicHelper.shortEntranceName('Earth Temple Miniboss Arena');

      expect(shortEntranceName).toEqual('ET Miniboss Door');
    });
  });

  describe('shortExitName', () => {
    test('returns the unmodified dungeon name', () => {
      const shortExitName = LogicHelper.shortExitName('Dragon Roost Cavern');

      expect(shortExitName).toEqual('Dragon Roost Cavern');
    });

    test('returns the cave name without mentioning secret caves', () => {
      const shortExitName = LogicHelper.shortExitName('Dragon Roost Island Secret Cave');

      expect(shortExitName).toEqual('Dragon Roost Island Cave');
    });

    test('returns the cave name without mentioning warp maze caves', () => {
      const shortExitName = LogicHelper.shortExitName('Diamond Steppe Island Warp Maze Cave');

      expect(shortExitName).toEqual('Diamond Steppe Island Cave');
    });

    test('returns Savage Labyrinth unmodified', () => {
      const shortExitName = LogicHelper.shortExitName('Savage Labyrinth');

      expect(shortExitName).toEqual('Savage Labyrinth');
    });

    test('returns Cabana Labyrinth unmodified', () => {
      const shortExitName = LogicHelper.shortExitName('Cabana Labyrinth');

      expect(shortExitName).toEqual('Cabana Labyrinth');
    });

    test('handles the Pawprint Chuchu Cave correctly', () => {
      const shortExitName = LogicHelper.shortExitName('Pawprint Isle Chuchu Cave');

      expect(shortExitName).toEqual('Pawprint Isle Chuchu Cave');
    });

    test('handles the Pawprint Wizzrobe Cave correctly', () => {
      const shortExitName = LogicHelper.shortExitName('Pawprint Isle Wizzrobe Cave');

      expect(shortExitName).toEqual('Pawprint Isle Wizzrobe Cave');
    });

    test('returns the inner cave name', () => {
      const shortExitName = LogicHelper.shortExitName('Ice Ring Isle Inner Cave');

      expect(shortExitName).toEqual('Ice Ring Isle Inner Cave');
    });

    test('returns the boss name', () => {
      const shortExitName = LogicHelper.shortExitName('Kalle Demos Boss Arena');

      expect(shortExitName).toEqual('Kalle Demos');
    });

    test('returns the miniboss name', () => {
      const shortExitName = LogicHelper.shortExitName('Wind Temple Miniboss Arena');

      expect(shortExitName).toEqual('WT Miniboss');
    });

    test('returns the nothing exit unmodified', () => {
      const shortExitName = LogicHelper.shortExitName(LogicHelper.NOTHING_EXIT);

      expect(shortExitName).toEqual('Nothing');
    });
  });

  describe('exitsForIsland', () => {
    describe('when there are no random island entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns an empty array', () => {
        const islandExits = LogicHelper.exitsForIsland('Cliff Plateau Isles');

        expect(islandExits).toEqual([]);
      });
    });

    describe('when there are no nested cave entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns no cave entrances when the island has no entrances', () => {
        const islandExits = LogicHelper.exitsForIsland('Windfall Island');

        expect(islandExits).toEqual([]);
      });

      test('returns one cave entrance when the island has one entrance', () => {
        const islandExits = LogicHelper.exitsForIsland('Dragon Roost Island');

        expect(islandExits).toEqual(['Dragon Roost Island Secret Cave']);
      });

      test('returns the cave entrance when the island does not match the cave name', () => {
        const islandExits = LogicHelper.exitsForIsland('Private Oasis');

        expect(islandExits).toEqual(['Cabana Labyrinth']);
      });

      test('returns multiple cave entrances when the island has multiple entrances', () => {
        const islandExits = LogicHelper.exitsForIsland('Pawprint Isle');

        expect(islandExits).toEqual([
          'Pawprint Isle Chuchu Cave',
          'Pawprint Isle Wizzrobe Cave',
        ]);
      });

      test('does not include nested caves', () => {
        const islandExits = LogicHelper.exitsForIsland('Cliff Plateau Isles');

        expect(islandExits).toEqual(['Cliff Plateau Isles Secret Cave']);
      });

      test('does not include fairy fountains', () => {
        const islandExits = LogicHelper.exitsForIsland('Outset Island');

        expect(islandExits).toEqual(['Savage Labyrinth']);
      });
    });

    describe('when there are nested cave entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      test('includes nested caves', () => {
        const islandExits = LogicHelper.exitsForIsland('Cliff Plateau Isles');

        expect(islandExits).toEqual([
          'Cliff Plateau Isles Secret Cave',
          'Cliff Plateau Isles Inner Cave',
        ]);
      });

      test('includes fairy fountains', () => {
        const islandExits = LogicHelper.exitsForIsland('Outset Island');

        expect(islandExits).toEqual([
          'Savage Labyrinth',
          'Outset Fairy Fountain',
        ]);
      });
    });

    describe('when there are only nested cave entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('includes nested caves', () => {
        const islandExits = LogicHelper.exitsForIsland('Cliff Plateau Isles');

        expect(islandExits).toEqual(['Cliff Plateau Isles Inner Cave']);
      });

      test('returns no caves for other islands', () => {
        const islandExits = LogicHelper.exitsForIsland('Pawprint Isle');

        expect(islandExits).toEqual([]);
      });
    });

    describe('when there are only fairy fountain entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      test('includes fairy fountains', () => {
        const islandExits = LogicHelper.exitsForIsland('Eastern Fairy Island');

        expect(islandExits).toEqual(['Eastern Fairy Fountain']);
      });

      test('returns no caves for other islands', () => {
        const islandExits = LogicHelper.exitsForIsland('Pawprint Isle');

        expect(islandExits).toEqual([]);
      });
    });
  });

  describe('entrancesForIsland', () => {
    describe('when cave entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('does not include caves', () => {
        const islandEntrances = LogicHelper.entrancesForIsland('Cliff Plateau Isles');

        expect(islandEntrances).toEqual([]);
      });

      test('does not include fairy fountains', () => {
        const islandEntrances = LogicHelper.entrancesForIsland('Outset Island');

        expect(islandEntrances).toEqual([]);
      });

      test('includes dungeon entrances', () => {
        const islandEntrances = LogicHelper.entrancesForIsland('Dragon Roost Island');

        expect(islandEntrances).toEqual(['Dragon Roost Cavern']);
      });
    });

    describe('when dungeon entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('does not include dungeon entrances', () => {
        const islandEntrances = LogicHelper.entrancesForIsland('Dragon Roost Island');

        expect(islandEntrances).toEqual(['Dragon Roost Island Secret Cave']);
      });
    });

    describe('when all entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      test('includes nested caves', () => {
        const islandEntrances = LogicHelper.entrancesForIsland('Cliff Plateau Isles');

        expect(islandEntrances).toEqual([
          'Cliff Plateau Isles Secret Cave',
          'Cliff Plateau Isles Inner Cave',
        ]);
      });

      test('includes fairy fountains', () => {
        const islandEntrances = LogicHelper.entrancesForIsland('Outset Island');

        expect(islandEntrances).toEqual([
          'Savage Labyrinth',
          'Outset Fairy Fountain',
        ]);
      });

      test('includes dungeon entrances', () => {
        const islandEntrances = LogicHelper.entrancesForIsland('Dragon Roost Island');

        expect(islandEntrances).toEqual([
          'Dragon Roost Cavern',
          'Dragon Roost Island Secret Cave',
        ]);
      });
    });
  });

  describe('exitsForDungeon', () => {
    describe('when dungeon entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
          },
        });
      });

      test('returns an empty array', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forbidden Woods');

        expect(exitsForDungeon).toEqual([]);
      });
    });

    describe('when there are no nested dungeon entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
          },
        });
      });

      test('returns just the dungeon entrance for a dungeon with a random entrance', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forbidden Woods');

        expect(exitsForDungeon).toEqual(['Forbidden Woods']);
      });

      test('returns no entrances for a dungeon with no random entrance', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forsaken Fortress');

        expect(exitsForDungeon).toEqual([]);
      });

      test('returns no entrances for Hyrule', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Hyrule');

        expect(exitsForDungeon).toEqual([]);
      });
    });

    describe('when dungeons, bosses, and minibosses are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
          },
        });
      });

      test('returns the dungeon and boss for DRC', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Dragon Roost Cavern');

        expect(exitsForDungeon).toEqual(['Dragon Roost Cavern', 'Gohma Boss Arena']);
      });

      test('returns the dungeon, miniboss, and boss for FW', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forbidden Woods');

        expect(exitsForDungeon).toEqual(['Forbidden Woods', 'Forbidden Woods Miniboss Arena', 'Kalle Demos Boss Arena']);
      });

      test('returns only the boss for FF', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forsaken Fortress');

        expect(exitsForDungeon).toEqual(['Helmaroc King Boss Arena']);
      });

      test('returns the Master Sword Chamber for Hyrule', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Hyrule');

        expect(exitsForDungeon).toEqual(['Master Sword Chamber']);
      });
    });

    describe('when only bosses are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
          },
        });
      });

      test('returns only the boss for DRC', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Dragon Roost Cavern');

        expect(exitsForDungeon).toEqual(['Gohma Boss Arena']);
      });

      test('returns only the boss for FW', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forbidden Woods');

        expect(exitsForDungeon).toEqual(['Kalle Demos Boss Arena']);
      });

      test('returns only the boss for FF', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forsaken Fortress');

        expect(exitsForDungeon).toEqual(['Helmaroc King Boss Arena']);
      });
    });

    describe('when only minibosses are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
          },
        });
      });

      test('returns no entrances for DRC', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Dragon Roost Cavern');

        expect(exitsForDungeon).toEqual([]);
      });

      test('returns only the miniboss for FW', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forbidden Woods');

        expect(exitsForDungeon).toEqual(['Forbidden Woods Miniboss Arena']);
      });

      test('returns no entrances for FF', () => {
        const exitsForDungeon = LogicHelper.exitsForDungeon('Forsaken Fortress');

        expect(exitsForDungeon).toEqual([]);
      });
    });
  });

  describe('entrancesForDungeon', () => {
    describe('when there are no nested dungeon entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
          },
        });
      });

      test('returns no entrances for a dungeon with a random entrance', () => {
        const entrancesForDungeon = LogicHelper.entrancesForDungeon('Forbidden Woods');

        expect(entrancesForDungeon).toEqual([]);
      });

      test('returns no entrances for a dungeon with no random entrance', () => {
        const entrancesForDungeon = LogicHelper.entrancesForDungeon('Forsaken Fortress');

        expect(entrancesForDungeon).toEqual([]);
      });

      test('returns no entrances for Hyrule', () => {
        const entrancesForDungeon = LogicHelper.entrancesForDungeon('Hyrule');

        expect(entrancesForDungeon).toEqual([]);
      });
    });

    describe('when dungeons, bosses, and minibosses are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
          },
        });
      });

      test('returns only the boss for DRC', () => {
        const entrancesForDungeon = LogicHelper.entrancesForDungeon('Dragon Roost Cavern');

        expect(entrancesForDungeon).toEqual(['Gohma Boss Arena']);
      });

      test('returns the miniboss and boss for FW', () => {
        const entrancesForDungeon = LogicHelper.entrancesForDungeon('Forbidden Woods');

        expect(entrancesForDungeon).toEqual(['Forbidden Woods Miniboss Arena', 'Kalle Demos Boss Arena']);
      });

      test('returns only the boss for FF', () => {
        const entrancesForDungeon = LogicHelper.entrancesForDungeon('Forsaken Fortress');

        expect(entrancesForDungeon).toEqual(['Helmaroc King Boss Arena']);
      });

      test('returns the Master Sword Chamber for Hyrule', () => {
        const entrancesForDungeon = LogicHelper.entrancesForDungeon('Hyrule');

        expect(entrancesForDungeon).toEqual(['Master Sword Chamber']);
      });
    });
  });

  describe('isRandomEntrances', () => {
    describe('when dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns true', () => {
        const isRandomEntrances = LogicHelper.isRandomEntrances();

        expect(isRandomEntrances).toEqual(true);
      });
    });

    describe('when cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns true', () => {
        const isRandomEntrances = LogicHelper.isRandomEntrances();

        expect(isRandomEntrances).toEqual(true);
      });
    });

    describe('when dungeon and cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns true', () => {
        const isRandomEntrances = LogicHelper.isRandomEntrances();

        expect(isRandomEntrances).toEqual(true);
      });
    });

    describe('when entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns false', () => {
        const isRandomEntrances = LogicHelper.isRandomEntrances();

        expect(isRandomEntrances).toEqual(false);
      });
    });

    describe('when there are nested random entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns true', () => {
        const isRandomEntrances = LogicHelper.isRandomEntrances();

        expect(isRandomEntrances).toEqual(true);
      });
    });

    describe('when there are random fairy fountain entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      test('returns true', () => {
        const isRandomEntrances = LogicHelper.isRandomEntrances();

        expect(isRandomEntrances).toEqual(true);
      });
    });
  });

  describe('allRandomEntrances', () => {
    describe('when entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns an empty array', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toEqual([]);
      });
    });

    describe('when only dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the dungeons', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when only cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the caves without inner caves', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when dungeon and cave entrances are randomized separately', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the dungeons and caves', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when dungeon and cave entrances are randomized together', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the dungeons and caves', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when there are nested dungeon entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the dungeons, bosses, and minibosses', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when there are nested cave entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the caves and inner caves', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when there are nested dungeon entrances and caves separately', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      test('returns all the dungeons, bosses, minibosses, caves, and fairies', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when there are nested dungeon entrances and caves together', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      test('returns all the dungeons, bosses, minibosses, caves, and fairies', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when only inner entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: Permalink.MIX_ENTRANCES_OPTIONS.KEEP_TOGETHER,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the bosses, minibosses, and inner caves', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });
  });

  describe('randomEntrancesForExit', () => {
    describe('when only dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the dungeons', () => {
        const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Dragon Roost Cavern');

        expect(randomEntrancesForExit).toMatchSnapshot();
      });
    });

    describe('when only cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      test('returns all the caves', () => {
        const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Savage Labyrinth');

        expect(randomEntrancesForExit).toMatchSnapshot();
      });
    });

    describe('when dungeon and cave entrances are randomized separately', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns all the dungeons', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Dragon Roost Cavern');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a cave', () => {
        test('returns all the caves', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Savage Labyrinth');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });
    });

    describe('when dungeon and cave entrances are randomized together', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns all the dungeons and caves', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Dragon Roost Cavern');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a cave', () => {
        test('returns all the dungeons and caves', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Savage Labyrinth');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });
    });

    describe('when there are nested dungeon entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns all the dungeons, bosses, and minibosses except its own boss door and miniboss', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Tower of the Gods');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a boss', () => {
        test('returns all the dungeons, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Kalle Demos Boss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a miniboss', () => {
        test('returns all the dungeons, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Earth Temple Miniboss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });
    });

    describe('when there are nested cave entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a cave without an inner cave', () => {
        test('returns all the caves', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Boating Course Secret Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a cave with an inner cave', () => {
        test('returns all the caves except its own inner cave', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Cliff Plateau Isles Secret Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is an inner cave', () => {
        test('returns all the caves', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Ice Ring Isle Inner Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });
    });

    describe('when there are nested dungeon entrances with caves separately', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns all the dungeons, bosses, and minibosses except its own boss door and miniboss', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Tower of the Gods');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a boss', () => {
        test('returns all the dungeons, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Kalle Demos Boss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a miniboss', () => {
        test('returns all the dungeons, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Earth Temple Miniboss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a cave', () => {
        test('returns all the caves and fairies', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Savage Labyrinth');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a cave with an inner cave', () => {
        test('returns all the caves and fairies except its own inner cave', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Ice Ring Isle Secret Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is an inner cave', () => {
        test('returns all the caves and fairies', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Cliff Plateau Isles Inner Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a fairy fountain', () => {
        test('returns all the caves and fairies', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Eastern Fairy Fountain');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });
    });

    describe('when there are nested dungeon entrances with caves together', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses except its own boss door and miniboss', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Tower of the Gods');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a boss', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Kalle Demos Boss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a miniboss', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Earth Temple Miniboss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a cave', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Savage Labyrinth');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a cave with an inner cave', () => {
        test('returns all the dungeons, bosses, minibosses, fairies, and caves except its own inner cave', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Ice Ring Isle Secret Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is an inner cave', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Cliff Plateau Isles Inner Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a fairy fountain', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Outset Fairy Fountain');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });
    });

    describe('when only inner entrances are randomized separately', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a boss', () => {
        test('returns all the bosses and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Kalle Demos Boss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is a miniboss', () => {
        test('returns all the bosses and minibosses', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Earth Temple Miniboss Arena');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });

      describe('when the exit is an inner cave', () => {
        test('returns all the inner caves', () => {
          const randomEntrancesForExit = LogicHelper.randomEntrancesForExit('Cliff Plateau Isles Inner Cave');

          expect(randomEntrancesForExit).toMatchSnapshot();
        });
      });
    });
  });

  describe('randomExitsForEntrance', () => {
    describe('when dungeon and cave entrances are randomized separately', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the entrance is a dungeon', () => {
        test('returns all the dungeons', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Dragon Roost Cavern');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });

      describe('when the entrance is a cave', () => {
        test('returns all the caves', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Savage Labyrinth');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });
    });

    describe('when there are nested dungeon entrances with caves together', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      describe('when the entrance is a dungeon', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Tower of the Gods');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });

      describe('when the entrance is a boss', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses except its own dungeon (FW)', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Kalle Demos Boss Arena');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });

      describe('when the entrance is a miniboss', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses except its own dungeon (ET)', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Earth Temple Miniboss Arena');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });

      describe('when the entrance is a cave', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Cliff Plateau Isles');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });

      describe('when the entrance is an inner cave', () => {
        test('returns all the dungeons, bosses, minibosses, fairies, and caves except the cave that contains the entrance', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Ice Ring Isle Inner Cave');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });

      describe('when the entrance is a fairy fountain', () => {
        test('returns all the dungeons, caves, fairies, bosses, and minibosses', () => {
          const randomExitsForEntrance = LogicHelper.randomExitsForEntrance('Outset Fairy Fountain');

          expect(randomExitsForEntrance).toMatchSnapshot();
        });
      });
    });
  });

  describe('nestedEntrancesForExit', () => {
    describe('when there are no nested entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns an empty array', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Forbidden Woods');

          expect(nestedEntrancesForExit).toEqual([]);
        });
      });

      describe('when the exit is a cave', () => {
        test('returns an empty array', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Ice Ring Isle Secret Cave');

          expect(nestedEntrancesForExit).toEqual([]);
        });
      });
    });

    describe('when there are nested entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      describe('when the exit is a dungeon with only a boss door', () => {
        test('returns the boss', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Dragon Roost Cavern');

          expect(nestedEntrancesForExit).toEqual(['Gohma Boss Arena']);
        });
      });

      describe('when the exit is a dungeon with boss and miniboss doors', () => {
        test('returns the boss and miniboss', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Forbidden Woods');

          expect(nestedEntrancesForExit).toEqual(['Kalle Demos Boss Arena', 'Forbidden Woods Miniboss Arena']);
        });
      });

      describe('when the exit is a cave with an inner cave', () => {
        test('returns the inner cave', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Ice Ring Isle Secret Cave');

          expect(nestedEntrancesForExit).toEqual(['Ice Ring Isle Inner Cave']);
        });
      });

      describe('when the exit does not have nested entrances', () => {
        test('returns an empty array', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Overlook Island Secret Cave');

          expect(nestedEntrancesForExit).toEqual([]);
        });
      });
    });

    describe('when there are nested dungeon entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a dungeon with boss and miniboss doors', () => {
        test('returns the boss and miniboss', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Forbidden Woods');

          expect(nestedEntrancesForExit).toEqual(['Kalle Demos Boss Arena', 'Forbidden Woods Miniboss Arena']);
        });
      });

      describe('when the exit is a cave', () => {
        test('returns an empty array', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Ice Ring Isle Secret Cave');

          expect(nestedEntrancesForExit).toEqual([]);
        });
      });
    });

    describe('when there are nested cave entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns an empty array', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Forbidden Woods');

          expect(nestedEntrancesForExit).toEqual([]);
        });
      });

      describe('when the exit is a cave with an inner cave', () => {
        test('returns the inner cave', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Ice Ring Isle Secret Cave');

          expect(nestedEntrancesForExit).toEqual(['Ice Ring Isle Inner Cave']);
        });
      });
    });

    describe('when there are only nested minibosses', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });
      });

      describe('when the exit is a dungeon', () => {
        test('returns only the miniboss', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Forbidden Woods Miniboss Arena');

          expect(nestedEntrancesForExit).toEqual([]);
        });
      });

      describe('when the exit is a cave', () => {
        test('returns an empty array', () => {
          const nestedEntrancesForExit = LogicHelper.nestedEntrancesForExit('Ice Ring Isle Secret Cave');

          expect(nestedEntrancesForExit).toEqual([]);
        });
      });
    });
  });

  describe('parseItemCountRequirement', () => {
    test('progressive item', () => {
      const itemCountRequirement = LogicHelper.parseItemCountRequirement('Progressive Sword x4');

      expect(itemCountRequirement).toEqual({
        itemName: 'Progressive Sword',
        countRequired: 4,
      });
    });

    test('small key', () => {
      const itemCountRequirement = LogicHelper.parseItemCountRequirement('DRC Small Key x2');

      expect(itemCountRequirement).toEqual({
        itemName: 'DRC Small Key',
        countRequired: 2,
      });
    });
  });

  describe('isProgressLocation', () => {
    describe('when the location has a type that is not in the flags', () => {
      beforeEach(() => {
        Locations.locations = {
          'Wind Temple': {
            'Big Key Chest': {
              need: 'Can Access Wind Temple',
              types: 'Dungeon, Tingle Chest, Island Puzzle',
            },
          },
        };

        Settings.initializeRaw({
          flags: [
            Settings.FLAGS.DUNGEON,
            Settings.FLAGS.ISLAND_PUZZLE,
          ],
        });
      });

      test('returns false', () => {
        const isProgressLocation = LogicHelper.isProgressLocation('Wind Temple', 'Big Key Chest');

        expect(isProgressLocation).toEqual(false);
      });
    });

    describe('when the location only has types that are in the flags', () => {
      beforeEach(() => {
        Locations.locations = {
          'Wind Temple': {
            'Big Key Chest': {
              need: 'Can Access Wind Temple',
              types: 'Dungeon, Tingle Chest, Island Puzzle',
            },
          },
        };

        Settings.initializeRaw({
          flags: [
            Settings.FLAGS.DUNGEON,
            Settings.FLAGS.ISLAND_PUZZLE,
            Settings.FLAGS.TINGLE_CHEST,
          ],
        });
      });

      test('returns true', () => {
        const isProgressLocation = LogicHelper.isProgressLocation('Wind Temple', 'Big Key Chest');

        expect(isProgressLocation).toEqual(true);
      });
    });

    describe('when the location has no types', () => {
      beforeEach(() => {
        Locations.locations = {
          "Ganon's Tower": {
            'Defeat Ganondorf': {
              need: 'Can Reach and Defeat Ganondorf',
            },
          },
        };
      });

      test('returns true', () => {
        const isProgressLocation = LogicHelper.isProgressLocation("Ganon's Tower", 'Defeat Ganondorf');

        expect(isProgressLocation).toEqual(true);
      });
    });
  });

  describe('randomizedChartForIsland', () => {
    test('returns randomized chart for island name', () => {
      expect(LogicHelper.randomizedChartForIsland('Outset Island')).toBe('Chart for Outset Island');
    });
  });

  describe('islandHasProgressItemChart', () => {
    describe('when randomized charts is on, and only triforce charts are progress items', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns true for an island that normally has a triforce chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Outset Island')).toEqual(true);
      });

      test('returns true for an island that normally has a treasure chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Crescent Moon Island')).toEqual(true);
      });
    });

    describe('when randomized charts is on, and all charts are progress items', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns true for an island that normally has a triforce chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Greatfish Isle')).toEqual(true);
      });

      test('returns true for an island that normally has a treasure chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Dragon Roost Island')).toEqual(true);
      });
    });

    describe('when randomized charts is on, and no charts are progress items', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: false,
          },
        });
      });

      test('returns false for an island that normally has a triforce chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Southern Triangle Island')).toEqual(false);
      });

      test('returns false for an island that normally has a treasure chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Bomb Island')).toEqual(false);
      });
    });

    describe('when randomized charts is off, and only treasure charts are progress items', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: false,
          },
        });
      });

      test('returns false for an island that normally has a triforce chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Stone Watcher Island')).toEqual(false);
      });

      test('returns true for an island that normally has a treasure chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Five-Eye Reef')).toEqual(true);
      });
    });

    describe('when randomized charts is off, and only triforce charts are progress items', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns true for an island that normally has a triforce chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Gale Isle')).toEqual(true);
      });

      test('returns false for an island that normally has a treasure chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Tingle Island')).toEqual(false);
      });
    });

    describe('when randomized charts is off, and all charts are progress items', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns true for an island that normally has a triforce chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Two-Eye Reef')).toEqual(true);
      });

      test('returns true for an island that normally has a treasure chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Forsaken Fortress')).toEqual(true);
      });
    });

    describe('when randomized charts is off, and no charts are progress items', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: false,
          },
        });
      });

      test('returns false for an island that normally has a triforce chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Headstone Island')).toEqual(false);
      });

      test('returns false for an island that normally has a treasure chart', () => {
        expect(LogicHelper.islandHasProgressItemChart('Angular Isles')).toEqual(false);
      });
    });
  });

  describe('isRandomizedChart', () => {
    describe('when randomized charts is on', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
          },
        });
      });
      test('returns true when treasure chart', () => {
        expect(LogicHelper.isRandomizedChart('Treasure Chart 25')).toBe(true);
      });
      test('returns true when triforce chart', () => {
        expect(LogicHelper.isRandomizedChart('Triforce Chart 25')).toBe(true);
      });
      test('returns false when item', () => {
        expect(LogicHelper.isRandomizedChart('Bombs')).toBe(false);
      });
    });

    describe('when randomized charts is off', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          },
        });
      });
      test('returns false when treasure chart', () => {
        expect(LogicHelper.isRandomizedChart('Treasure Chart 25')).toBe(false);
      });
      test('returns false when triforce chart', () => {
        expect(LogicHelper.isRandomizedChart('Triforce Chart 25')).toBe(false);
      });
      test('returns false when item', () => {
        expect(LogicHelper.isRandomizedChart('Bombs')).toBe(false);
      });
    });
  });

  describe('filterDetailedLocations', () => {
    beforeEach(() => {
      fullSetup({
        flags: [
          Settings.FLAGS.PUZZLE_SECRET_CAVE,
          Settings.FLAGS.GREAT_FAIRY,
          Settings.FLAGS.FREE_GIFT,
          Settings.FLAGS.MISC,
          Settings.FLAGS.OTHER_CHEST,
          Settings.FLAGS.EXPENSIVE_PURCHASE,
          Settings.FLAGS.SUNKEN_TREASURE,
        ],
      });
    });

    describe('when onlyProgressLocations is true', () => {
      test('returns the correct locations for Windfall Island', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Windfall Island', {
          onlyProgressLocations: true,
        });

        expect(filteredLocations).toEqual([
          'Jail - Tingle - First Gift',
          'Jail - Tingle - Second Gift',
          'House of Wealth Chest',
          'Maggie - Free Item',
          'Tott - Teach Rhythm',
          'Sunken Treasure',
        ]);
      });

      test('includes sunken treasure for the Tower of the Gods island', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Tower of the Gods Sector', {
          onlyProgressLocations: true,
        });

        expect(filteredLocations).toEqual(['Sunken Treasure']);
      });

      test('includes no locations for the Tower of the Gods dungeon', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Tower of the Gods', {
          onlyProgressLocations: true,
        });

        expect(filteredLocations).toEqual([]);
      });

      test("includes Defeat Ganondorf in Ganon's Tower", () => {
        const filteredLocations = LogicHelper.filterDetailedLocations("Ganon's Tower", {
          onlyProgressLocations: true,
        });

        expect(filteredLocations).toEqual(['Defeat Ganondorf']);
      });
    });

    describe('when onlyProgressLocations is false', () => {
      test('returns the correct locations for Forsaken Fortress', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Forsaken Fortress', {
          onlyProgressLocations: false,
        });

        expect(filteredLocations).toEqual([
          'Phantom Ganon',
          'Chest Outside Upper Jail Cell',
          'Chest Inside Lower Jail Cell',
          'Chest Guarded By Bokoblin',
          'Chest on Bed',
          'Helmaroc King Heart Container',
        ]);
      });

      test('returns the correct locations for Bomb Island', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Bomb Island', {
          onlyProgressLocations: false,
        });

        expect(filteredLocations).toEqual([
          'Cave',
          'Lookout Platform - Defeat the Enemies',
          'Submarine',
          'Sunken Treasure',
        ]);
      });

      test("returns the correct locations for Ganon's Tower", () => {
        const filteredLocations = LogicHelper.filterDetailedLocations("Ganon's Tower", {
          onlyProgressLocations: false,
        });

        expect(filteredLocations).toEqual([
          'Maze Chest',
          'Defeat Ganondorf',
        ]);
      });

      test('returns the correct locations for Hyrule', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Hyrule', {
          onlyProgressLocations: false,
        });

        expect(filteredLocations).toEqual(['Master Sword Chamber']);
      });
    });
  });

  describe('isPotentialKeyLocation', () => {
    describe('when the location is a valid big key location', () => {
      beforeEach(() => {
        Locations.locations = {
          'Wind Temple': {
            'Big Key Chest': {
              need: 'Can Access Wind Temple',
              types: 'Dungeon',
            },
          },
        };
      });

      test('returns true', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Big Key Chest');

        expect(isPotentialKeyLocation).toEqual(true);
      });
    });

    describe('when the location is not in a main dungeon', () => {
      beforeEach(() => {
        Locations.locations = {
          'Forsaken Fortress': {
            'Phantom Ganon': {
              types: 'Dungeon',
            },
          },
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Forsaken Fortress', 'Phantom Ganon');

        expect(isPotentialKeyLocation).toEqual(false);
      });
    });

    describe('when the location is on an island that is also a dungeon', () => {
      beforeEach(() => {
        Locations.locations = {
          'Tower of the Gods Sector': {
            'Sunken Treasure': {
              types: 'Sunken Treasure',
            },
          },
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Tower of the Gods Sector', 'Sunken Treasure');

        expect(isPotentialKeyLocation).toEqual(false);
      });
    });

    describe('when the location is a tingle chest', () => {
      beforeEach(() => {
        Locations.locations = {
          'Wind Temple': {
            'Tingle Statue Chest': {
              need: 'Can Access Wind Temple',
              types: 'Tingle Chest, Dungeon',
            },
          },
        };
      });

      describe('when the tingle chest flag is active', () => {
        beforeEach(() => {
          Settings.initializeRaw({
            flags: [Settings.FLAGS.DUNGEON, Settings.FLAGS.TINGLE_CHEST],
          });
        });

        test('returns true', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Tingle Statue Chest');

          expect(isPotentialKeyLocation).toEqual(true);
        });
      });

      describe('when only dungeons are active', () => {
        beforeEach(() => {
          Settings.initializeRaw({ flags: [Settings.FLAGS.DUNGEON] });
        });

        test('returns false', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Tingle Statue Chest');

          expect(isPotentialKeyLocation).toEqual(false);
        });
      });

      describe('when dungeons are not active', () => {
        beforeEach(() => {
          Settings.initializeRaw({ flags: [] });
        });

        test('returns true', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Tingle Statue Chest');

          expect(isPotentialKeyLocation).toEqual(true);
        });
      });
    });

    describe('when the location is a dungeon secret', () => {
      beforeEach(() => {
        Locations.locations = {
          'Forbidden Woods': {
            'Highest Pot in Vine Maze': {
              need: 'Can Access Forbidden Woods',
              types: 'Dungeon, Dungeon Secret',
            },
          },
        };
      });

      describe('when the dungeon secret flag is active', () => {
        beforeEach(() => {
          Settings.initializeRaw({
            flags: [Settings.FLAGS.DUNGEON, Settings.FLAGS.DUNGEON_SECRET],
          });
        });

        test('returns true', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Forbidden Woods', 'Highest Pot in Vine Maze');

          expect(isPotentialKeyLocation).toEqual(true);
        });
      });

      describe('when only dungeons are active', () => {
        beforeEach(() => {
          Settings.initializeRaw({ flags: [Settings.FLAGS.DUNGEON] });
        });

        test('returns false', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Forbidden Woods', 'Highest Pot in Vine Maze');

          expect(isPotentialKeyLocation).toEqual(false);
        });
      });

      describe('when dungeons are not active', () => {
        beforeEach(() => {
          Settings.initializeRaw({ flags: [] });
        });

        test('returns true', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Forbidden Woods', 'Highest Pot in Vine Maze');

          expect(isPotentialKeyLocation).toEqual(true);
        });
      });
    });

    describe('when the location is a boss item drop', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'Gohma Heart Container': {
              need: 'Entered Gohma & Grappling Hook',
              types: 'Dungeon, Boss',
            },
          },
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Dragon Roost Cavern', 'Gohma Heart Container');

        expect(isPotentialKeyLocation).toEqual(false);
      });
    });

    describe('when the location is a miniboss', () => {
      beforeEach(() => {
        Locations.locations = {
          'Wind Temple': {
            'Wizzrobe Miniboss Room': {
              need: 'Can Access Wind Temple',
              types: 'Dungeon, Randomizable Miniboss Room',
            },
          },
        };
      });

      describe('when minibosses are randomized', () => {
        beforeEach(() => {
          Settings.initializeRaw({
            options: {
              [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            },
          });
        });

        test('returns false', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Wizzrobe Miniboss Room');

          expect(isPotentialKeyLocation).toEqual(false);
        });
      });

      describe('when minibosses are not randomized', () => {
        beforeEach(() => {
          Settings.initializeRaw({
            options: {
              [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            },
          });
        });

        test('returns true', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Wizzrobe Miniboss Room');

          expect(isPotentialKeyLocation).toEqual(true);
        });
      });
    });
  });

  describe('bossLocation', () => {
    beforeEach(() => {
      Locations.locations = {
        'Dragon Roost Cavern': {
          'Gohma Heart Container': {
            originalItem: 'Heart Container',
            types: 'Dungeon, Boss',
          },
        },
        'Tower of the Gods': {
          'Gohdan Heart Container': {
            originalItem: 'Heart Container',
            types: 'Dungeon, Boss',
          },
        },
        "Ganon's Tower": {
          'Defeat Ganondorf': {
            need: 'Can Reach and Defeat Ganondorf',
          },
        },
      };
    });

    test('returns the boss location for Dragon Roost Cavern', () => {
      const bossLocation = LogicHelper.bossLocation('Dragon Roost Cavern');

      expect(bossLocation).toEqual('Gohma Heart Container');
    });

    test('returns the boss location for Tower of the Gods', () => {
      const bossLocation = LogicHelper.bossLocation('Tower of the Gods');

      expect(bossLocation).toEqual('Gohdan Heart Container');
    });

    test("returns the boss location for Ganon's Tower", () => {
      const bossLocation = LogicHelper.bossLocation("Ganon's Tower");

      expect(bossLocation).toEqual('Defeat Ganondorf');
    });
  });

  describe('smallKeyName', () => {
    test('returns the name of the small key for the dungeon', () => {
      const smallKeyName = LogicHelper.smallKeyName('Dragon Roost Cavern');

      expect(smallKeyName).toEqual('DRC Small Key');
    });
  });

  describe('bigKeyName', () => {
    test('returns the name of the small key for the dungeon', () => {
      const bigKeyName = LogicHelper.bigKeyName('Forbidden Woods');

      expect(bigKeyName).toEqual('FW Big Key');
    });
  });

  describe('dungeonMapName', () => {
    test('returns the name of the dungeon map for the dungeon', () => {
      const dungeonMapName = LogicHelper.dungeonMapName('Forsaken Fortress');

      expect(dungeonMapName).toEqual('FF Dungeon Map');
    });
  });

  describe('compassName', () => {
    test('returns the name of the small key for the dungeon', () => {
      const compassName = LogicHelper.compassName('Earth Temple');

      expect(compassName).toEqual('ET Compass');
    });
  });

  describe('maxSmallKeysForDungeon', () => {
    test('returns the max small keys for DRC', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Dragon Roost Cavern');

      expect(maxKeys).toEqual(4);
    });

    test('returns the max small keys for FW', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Forbidden Woods');

      expect(maxKeys).toEqual(1);
    });

    test('returns the max small keys for TotG', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Tower of the Gods');

      expect(maxKeys).toEqual(2);
    });

    test('returns the max small keys for ET', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Earth Temple');

      expect(maxKeys).toEqual(3);
    });

    test('returns the max small keys for WT', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Wind Temple');

      expect(maxKeys).toEqual(2);
    });
  });

  describe('smallKeysRequiredForLocation', () => {
    describe('when the location has no requirements', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Nothing',
            },
          },
        };
      });

      test('returns 0', () => {
        const keysRequired = LogicHelper.smallKeysRequiredForLocation('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual(0);
      });
    });

    describe('when the location only has non-key requirements', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Grappling Hook',
            },
          },
        };
      });

      test('returns 0', () => {
        const keysRequired = LogicHelper.smallKeysRequiredForLocation('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual(0);
      });
    });

    describe('when the location only requires a small key', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'DRC Small Key x1',
            },
          },
        };
      });

      test('returns the 1 small key', () => {
        const keysRequired = LogicHelper.smallKeysRequiredForLocation('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual(1);
      });
    });

    describe('when the location requires some keys and some other items', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Grappling Hook & Deku Leaf & DRC Small Key x2 & DRC Big Key',
            },
          },
        };
      });

      test('returns the number of small keys', () => {
        const keysRequired = LogicHelper.smallKeysRequiredForLocation('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual(2);
      });
    });

    describe('when the location has nested key requirements', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'Big Key Chest': {
              need: 'DRC Small Key x1 & Grappling Hook & (DRC Small Key x4 | Deku Leaf | Progressive Bow x2)',
            },
          },
        };
      });

      test('returns the number of small keys that are strictly required', () => {
        const keysRequired = LogicHelper.smallKeysRequiredForLocation('Dragon Roost Cavern', 'Big Key Chest');

        expect(keysRequired).toEqual(1);
      });
    });
  });

  describe('isLocationAvailableWithSmallKeys', () => {
    describe('when the location requires small keys that are below the given count', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'DRC Small Key x2',
            },
          },
        };
      });

      test('returns true', () => {
        const isLocationAvailable = LogicHelper.isLocationAvailableWithSmallKeys(
          'Dragon Roost Cavern',
          'First Room',
          {
            numSmallKeys: 3,
            nonKeyRequirementMet: () => true,
          },
        );

        expect(isLocationAvailable).toEqual(true);
      });
    });

    describe('when the location requires small keys that are above the given count', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'DRC Small Key x4',
            },
          },
        };
      });

      test('returns false', () => {
        const isLocationAvailable = LogicHelper.isLocationAvailableWithSmallKeys(
          'Dragon Roost Cavern',
          'First Room',
          {
            numSmallKeys: 3,
            nonKeyRequirementMet: () => true,
          },
        );

        expect(isLocationAvailable).toEqual(false);
      });
    });

    describe('when the non key requirements are evaluated as not met', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Grappling Hook',
            },
          },
        };
      });

      test('returns false', () => {
        const isLocationAvailable = LogicHelper.isLocationAvailableWithSmallKeys(
          'Dragon Roost Cavern',
          'First Room',
          {
            numSmallKeys: 0,
            nonKeyRequirementMet: () => false,
          },
        );

        expect(isLocationAvailable).toEqual(false);
      });
    });

    describe('when the non key requirements are evaluated as met', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Grappling Hook',
            },
          },
        };
      });

      test('returns true', () => {
        const isLocationAvailable = LogicHelper.isLocationAvailableWithSmallKeys(
          'Dragon Roost Cavern',
          'First Room',
          {
            numSmallKeys: 0,
            nonKeyRequirementMet: () => true,
          },
        );

        expect(isLocationAvailable).toEqual(true);
      });
    });
  });

  describe('requirementsForLocation', () => {
    describe('when starting without a sword', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
          },
        });
      });

      test('returns no requirements for Dragon Roost Island - Wind Shrine', () => {
        const requirements = LogicHelper.requirementsForLocation('Dragon Roost Island', 'Wind Shrine', false);

        expect(requirements).toEqual(BooleanExpression.and('Nothing'));
      });

      test('returns simplified requirements for Outset Island - Savage Labyrinth - Floor 30', () => {
        const requirements = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Outset Island - Savage Labyrinth - Floor 50', () => {
        const requirements = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 50', false);

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Dragon Roost Cavern - Gohma Heart Container', () => {
        const requirements = LogicHelper.requirementsForLocation('Dragon Roost Cavern', 'Gohma Heart Container', false);

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Earth Temple - Jalhalla Heart Container', () => {
        const requirements = LogicHelper.requirementsForLocation('Earth Temple', 'Jalhalla Heart Container', false);

        expect(requirements).toMatchSnapshot();
      });

      test("returns simplified requirements for Mailbox - Beedle's Silver Membership Reward", () => {
        const requirements = LogicHelper.requirementsForLocation('Mailbox', "Beedle's Silver Membership Reward", false);

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Cliff Plateau Isles - Cave', () => {
        const requirements = LogicHelper.requirementsForLocation('Cliff Plateau Isles', 'Cave', false);

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Outset Island - Great Fairy', () => {
        const requirements = LogicHelper.requirementsForLocation('Outset Island', 'Great Fairy', false);

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Ganondorf', () => {
        const requirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', false);

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Letter from Baito', () => {
        const requirements = LogicHelper.requirementsForLocation('Mailbox', 'Letter from Baito', false);

        expect(requirements).toMatchSnapshot();
      });

      describe('when flattened is true', () => {
        test('returns the same simplified requirements for Ganondorf', () => {
          // When Required Bosses Mode is off, the flattened requirements for Defeat Ganondorf
          // should be the same as the non-flattened requirements
          const unflattenedRequirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', false);
          const flattenedRequirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', true);

          expect(unflattenedRequirements).toEqual(flattenedRequirements);
        });

        test('returns flattened requirements for Letter from Baito', () => {
          const requirements = LogicHelper.requirementsForLocation('Mailbox', 'Letter from Baito', true);

          expect(requirements).toMatchSnapshot();
        });
      });
    });

    describe('when swordless', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.SWORDLESS,
          },
        });
      });

      test('returns simplified requirements for The Great Sea - Ghost Ship', () => {
        const requirements = LogicHelper.requirementsForLocation('The Great Sea', 'Ghost Ship', false);

        expect(requirements).toMatchSnapshot();
      });
    });

    describe('when starting with a sword', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
          },
        });
      });

      test('returns simplified requirements for Cliff Plateau Isles - Cave', () => {
        const requirements = LogicHelper.requirementsForLocation('Cliff Plateau Isles', 'Cave', false);

        expect(requirements).toMatchSnapshot();
      });
    });

    describe('when using very hard logic', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.LOGIC_OBSCURITY]: Permalink.LOGIC_DIFFICULTY_OPTIONS.VERY_HARD,
            [Permalink.OPTIONS.LOGIC_PRECISION]: Permalink.LOGIC_DIFFICULTY_OPTIONS.VERY_HARD,
          },
        });
      });

      test('returns simplified requirements for Outset Island - Great Fairy', () => {
        const requirements = LogicHelper.requirementsForLocation('Outset Island', 'Great Fairy', false);

        expect(requirements).toMatchSnapshot();
      });
    });
  });

  describe('requirementsForEntrance', () => {
    beforeEach(() => {
      fullSetup({
        options: {
          [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
          [Permalink.OPTIONS.MIX_ENTRANCES]: (
            Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
          ),
          [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
          [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
          [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
          [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
          [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
        },
      });
    });

    test('returns no requirements for Dragon Roost Cavern', () => {
      const requirements = LogicHelper.requirementsForEntrance('Dragon Roost Cavern');

      expect(requirements).toEqual(BooleanExpression.and('Nothing'));
    });

    test('returns simplified requirements for Forbidden Woods', () => {
      const requirements = LogicHelper.requirementsForEntrance('Forbidden Woods');

      expect(requirements).toMatchSnapshot();
    });

    test('returns simplified requirements for Bomb Island Secret Cave', () => {
      const requirements = LogicHelper.requirementsForEntrance('Bomb Island Secret Cave');

      expect(requirements).toMatchSnapshot();
    });

    test('returns simplified requirements for Jalhalla', () => {
      const requirements = LogicHelper.requirementsForEntrance('Jalhalla Boss Arena');

      expect(requirements).toMatchSnapshot();
    });

    test('returns simplified requirements for FW Miniboss', () => {
      const requirements = LogicHelper.requirementsForEntrance('Forbidden Woods Miniboss Arena');

      expect(requirements).toMatchSnapshot();
    });

    test('returns simplified requirements for Ice Ring Isle Inner Cave', () => {
      const requirements = LogicHelper.requirementsForEntrance('Ice Ring Isle Inner Cave');

      expect(requirements).toMatchSnapshot();
    });

    test('returns simplified requirements for Outset Fairy Fountain', () => {
      const requirements = LogicHelper.requirementsForEntrance('Outset Fairy Fountain');

      expect(requirements).toMatchSnapshot();
    });

    test('returns simplified requirements for Master Sword Chamber', () => {
      const requirements = LogicHelper.requirementsForEntrance('Master Sword Chamber');

      expect(requirements).toMatchSnapshot();
    });
  });

  describe('prettyNameForItemRequirement', () => {
    test('returns the pretty name for a multiple item requirement', () => {
      const prettyName = LogicHelper.prettyNameForItemRequirement('Progressive Sword x2');

      expect(prettyName).toEqual('Master Sword');
    });

    test('returns the regular name for a small key requirement', () => {
      const prettyName = LogicHelper.prettyNameForItemRequirement('DRC Small Key x2');

      expect(prettyName).toEqual('DRC Small Key x2');
    });

    test('returns the regular name for a big key requirement', () => {
      const prettyName = LogicHelper.prettyNameForItem('DRC Big Key', 1);

      expect(prettyName).toEqual('DRC Big Key');
    });

    test('returns the pretty name for a regular item requirement', () => {
      const prettyName = LogicHelper.prettyNameForItemRequirement("Boat's Sail");

      expect(prettyName).toEqual('Swift Sail');
    });
  });

  describe('prettyNameForItem', () => {
    test("Hero's Sword", () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Sword', 1);

      expect(prettyName).toEqual("Hero's Sword");
    });

    test('Master Sword', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Sword', 2);

      expect(prettyName).toEqual('Master Sword');
    });

    test('Master Sword (Half Power)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Sword', 3);

      expect(prettyName).toEqual('Master Sword (Half Power)');
    });

    test('Master Sword (Full Power)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Sword', 4);

      expect(prettyName).toEqual('Master Sword (Full Power)');
    });

    test("Hero's Bow", () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Bow', 1);

      expect(prettyName).toEqual("Hero's Bow");
    });

    test("Hero's Bow (Fire & Ice Arrows)", () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Bow', 2);

      expect(prettyName).toEqual("Hero's Bow (Fire & Ice Arrows)");
    });

    test("Hero's Bow (All Arrows)", () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Bow', 3);

      expect(prettyName).toEqual("Hero's Bow (All Arrows)");
    });

    test('Picto Box', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Picto Box', 1);

      expect(prettyName).toEqual('Picto Box');
    });

    test('Deluxe Picto Box', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Picto Box', 2);

      expect(prettyName).toEqual('Deluxe Picto Box');
    });

    test('Wallet (1000 Rupees)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Wallet', 1);

      expect(prettyName).toEqual('Wallet (1000 Rupees)');
    });

    test('Wallet (5000 Rupees)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Wallet', 2);

      expect(prettyName).toEqual('Wallet (5000 Rupees)');
    });

    test('Quiver (60 Arrows)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Quiver', 1);

      expect(prettyName).toEqual('Quiver (60 Arrows)');
    });

    test('Quiver (99 Arrows)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Quiver', 2);

      expect(prettyName).toEqual('Quiver (99 Arrows)');
    });

    test('Bomb Bag (60 Bombs)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Bomb Bag', 1);

      expect(prettyName).toEqual('Bomb Bag (60 Bombs)');
    });

    test('Bomb Bag (99 Bombs)', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Bomb Bag', 2);

      expect(prettyName).toEqual('Bomb Bag (99 Bombs)');
    });

    test('Triforce Shards', () => {
      const prettyName = LogicHelper.prettyNameForItem('Triforce Shard', 5);

      expect(prettyName).toEqual('Triforce Shard (5/8)');
    });

    test('Triforce of Courage', () => {
      const prettyName = LogicHelper.prettyNameForItem('Triforce Shard', 8);

      expect(prettyName).toEqual('Triforce of Courage');
    });

    test('Swift Sail', () => {
      const prettyName = LogicHelper.prettyNameForItem("Boat's Sail");

      expect(prettyName).toEqual('Swift Sail');
    });

    test("Hero's Shield", () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Shield', 1);

      expect(prettyName).toEqual("Hero's Shield");
    });

    test('Mirror Shield', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Shield', 2);

      expect(prettyName).toEqual('Mirror Shield');
    });

    test('DRC Small Key', () => {
      const prettyName = LogicHelper.prettyNameForItem('DRC Small Key', 2);

      expect(prettyName).toEqual('DRC Small Key (2/4)');
    });

    test('FW Small Key', () => {
      const prettyName = LogicHelper.prettyNameForItem('FW Small Key', 0);

      expect(prettyName).toEqual('FW Small Key');
    });

    test('Big Key', () => {
      const prettyName = LogicHelper.prettyNameForItem('DRC Big Key', 1);

      expect(prettyName).toEqual('DRC Big Key');
    });

    test('returns the pretty name for an item with 0 count', () => {
      const prettyName = LogicHelper.prettyNameForItem('Progressive Sword', 0);

      expect(prettyName).toEqual("Hero's Sword");
    });

    describe('when charts are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
          },
        });
      });

      test('returns the regular name for a Triforce Chart', () => {
        const prettyName = LogicHelper.prettyNameForItem('Triforce Chart 7', 0);

        expect(prettyName).toEqual('Triforce Chart 7');
      });

      test('returns the regular name for a Treasure Chart', () => {
        const prettyName = LogicHelper.prettyNameForItem('Treasure Chart 25', 0);

        expect(prettyName).toEqual('Treasure Chart 25');
      });

      test('returns the regular name for the Ghost Ship Chart', () => {
        const prettyName = LogicHelper.prettyNameForItem('Ghost Ship Chart', 0);

        expect(prettyName).toEqual('Ghost Ship Chart');
      });

      describe('when setting the item count to null', () => {
        test('returns the regular name for a Triforce Chart', () => {
          const prettyName = LogicHelper.prettyNameForItem('Triforce Chart 7', null);

          expect(prettyName).toEqual('Triforce Chart 7');
        });

        test('returns the regular name for a Treasure Chart', () => {
          const prettyName = LogicHelper.prettyNameForItem('Treasure Chart 25', null);

          expect(prettyName).toEqual('Treasure Chart 25');
        });
      });
    });

    describe('when charts are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          },
        });
      });

      test('returns the regular name for a Triforce Chart', () => {
        const prettyName = LogicHelper.prettyNameForItem('Triforce Chart 7', 0);

        expect(prettyName).toEqual('Triforce Chart 7');
      });

      test('returns the regular name for a Treasure Chart', () => {
        const prettyName = LogicHelper.prettyNameForItem('Treasure Chart 25', 0);

        expect(prettyName).toEqual('Treasure Chart 25');
      });

      test('returns the regular name for the Ghost Ship Chart', () => {
        const prettyName = LogicHelper.prettyNameForItem('Ghost Ship Chart', 0);

        expect(prettyName).toEqual('Ghost Ship Chart');
      });

      describe('when setting the item count to null', () => {
        test('returns the regular name for a Triforce Chart', () => {
          const prettyName = LogicHelper.prettyNameForItem('Triforce Chart 7', null);

          expect(prettyName).toEqual('Triforce Chart 7');
        });

        test('returns the regular name for a Treasure Chart', () => {
          const prettyName = LogicHelper.prettyNameForItem('Treasure Chart 25', null);

          expect(prettyName).toEqual('Treasure Chart 25');
        });
      });
    });

    describe('when setting the item count to null', () => {
      test('returns the regular name for a progressive item', () => {
        const prettyName = LogicHelper.prettyNameForItem('Progressive Shield', null);

        expect(prettyName).toEqual('Progressive Shield');
      });

      test('returns the regular name for a regular item', () => {
        const prettyName = LogicHelper.prettyNameForItem('Deku Leaf', null);

        expect(prettyName).toEqual('Deku Leaf');
      });
    });
  });

  describe('islandFromChartForIsland', () => {
    test('returns island from valid string', () => {
      expect(LogicHelper.islandFromChartForIsland('Chart for Windfall Island')).toBe('Windfall Island');
    });
  });

  describe('islandForChart', () => {
    test('returns null for invalid chart', () => {
      const island = LogicHelper.islandForChart('Grapple Hook');

      expect(island).toBeNull();
    });

    test('returns island for treasure chart', () => {
      const island = LogicHelper.islandForChart('Treasure Chart 30');

      expect(island).toBe('Pawprint Isle');
    });

    test('returns island for triforce chart', () => {
      const island = LogicHelper.islandForChart('Triforce Chart 2');

      expect(island).toBe('Gale Isle');
    });
  });

  describe('vanillaChartForIsland', () => {
    test('returns a Triforce Chart when an island has one', () => {
      const chartInfo = LogicHelper.vanillaChartForIsland('Seven-Star Isles');

      expect(chartInfo).toEqual({
        chartName: 'Triforce Chart 7',
        chartType: LogicHelper.CHART_TYPES.TRIFORCE,
      });
    });

    test('returns a Treasure Chart when an island has one', () => {
      const chartInfo = LogicHelper.vanillaChartForIsland('Forsaken Fortress Sector');

      expect(chartInfo).toEqual({
        chartName: 'Treasure Chart 25',
        chartType: LogicHelper.CHART_TYPES.TREASURE,
      });
    });
  });

  describe('bannedLocationsForZone', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        options: {
          [Permalink.OPTIONS.KEYLUNACY]: false,
          [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
          [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
          [Permalink.OPTIONS.MIX_ENTRANCES]: (
            Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
          ),
          [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
          [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
          [Permalink.OPTIONS.LOGIC_OBSCURITY]: Permalink.LOGIC_DIFFICULTY_OPTIONS.NONE,
          [Permalink.OPTIONS.LOGIC_PRECISION]: Permalink.LOGIC_DIFFICULTY_OPTIONS.NONE,
        },
        startingGear: {},
      });

      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
      Macros.initialize(_.cloneDeep(TEST_MACROS));

      LogicTweaks.applyTweaks();

      LogicHelper.initialize();
    });

    test('returns the correct locations for Dragon Roost Cavern', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Dragon Roost Cavern', { includeAdditionalLocations: true });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Forbidden Woods when includeAdditionalLocations is true', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Forbidden Woods', { includeAdditionalLocations: true });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Forbidden Woods when includeAdditionalLocations is false', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Forbidden Woods', { includeAdditionalLocations: false });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Tower of the Gods', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Tower of the Gods', { includeAdditionalLocations: true });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Forsaken Fortress when includeAdditionalLocations is true', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Forsaken Fortress', { includeAdditionalLocations: true });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Forsaken Fortress when includeAdditionalLocations is false', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Forsaken Fortress', { includeAdditionalLocations: false });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Earth Temple when includeAdditionalLocations is true', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Earth Temple', { includeAdditionalLocations: true });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Earth Temple when includeAdditionalLocations is false', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Earth Temple', { includeAdditionalLocations: false });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Wind Temple', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Wind Temple', { includeAdditionalLocations: true });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });

    test('returns the correct locations for Outset Island', () => {
      const bannedLocationsForZone = LogicHelper.bannedLocationsForZone('Outset Island', { includeAdditionalLocations: false });

      expect(bannedLocationsForZone).toMatchSnapshot();
    });
  });

  describe('rawRequirementsForLocation', () => {
    describe('when the location has no requirements', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Nothing',
            },
          },
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

        expect(expression).toEqual(
          BooleanExpression.and('Nothing'),
        );
      });
    });

    describe('when the location requirements only contain items', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: "Grappling Hook | Hero's Sword | Skull Hammer",
            },
          },
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

        expect(expression).toEqual(
          BooleanExpression.or('Grappling Hook', "Hero's Sword", 'Skull Hammer'),
        );
      });
    });

    describe('when the location requirements contain a starting item', () => {
      describe('when the starting item is progressive', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Progressive Sword x2',
              },
            },
          };
        });

        describe('when the starting item meets the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Progressive Sword': 2,
            };
          });

          test('replaces the item in the requirements expression', () => {
            const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

            expect(expression).toEqual(
              BooleanExpression.and('Nothing'),
            );
          });
        });

        describe('when the starting item does not meet the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Progressive Sword': 1,
            };
          });

          test('does not replace the item in the requirements expression', () => {
            const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

            expect(expression).toEqual(
              BooleanExpression.and('Progressive Sword x2'),
            );
          });
        });
      });

      describe('when the starting item is a normal item', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Wind Waker',
              },
            },
          };
        });

        describe('when the starting item meets the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Wind Waker': 1,
            };
          });

          test('replaces the item in the requirements expression', () => {
            const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

            expect(expression).toEqual(
              BooleanExpression.and('Nothing'),
            );
          });
        });

        describe('when the starting item does not meet the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Wind Waker': 0,
            };
          });

          test('does not replace the item in the requirements expression', () => {
            const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

            expect(expression).toEqual(
              BooleanExpression.and('Wind Waker'),
            );
          });
        });
      });
    });

    describe('when the location requirements contain an impossible item', () => {
      describe('when the impossible item is progressive', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Progressive Sword x2',
              },
            },
          };
        });

        describe('when the impossible item meets the requirement', () => {
          beforeEach(() => {
            LogicHelper.impossibleItems = {
              'Progressive Sword': 2,
            };
          });

          test('replaces the item in the requirements expression', () => {
            const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

            expect(expression).toEqual(
              BooleanExpression.and('Impossible'),
            );
          });
        });

        describe('when the impossible item is more than the requirement', () => {
          beforeEach(() => {
            LogicHelper.impossibleItems = {
              'Progressive Sword': 3,
            };
          });

          test('does not replace the item in the requirements expression', () => {
            const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

            expect(expression).toEqual(
              BooleanExpression.and('Progressive Sword x2'),
            );
          });
        });
      });

      describe('when the impossible item is a normal item', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Wind Waker',
              },
            },
          };

          LogicHelper.startingItems = {};
          LogicHelper.impossibleItems = {
            'Wind Waker': 1,
          };
        });

        test('replaces the item in the requirements expression', () => {
          const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

          expect(expression).toEqual(
            BooleanExpression.and('Impossible'),
          );
        });
      });
    });

    describe('when the location requirements have parentheses', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: "Wind Waker | ((Grappling Hook & Hero's Bow) & Hero's Sword) | Skull Hammer",
            },
          },
        };
        LogicHelper.startingItems = {};
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

        expect(expression).toEqual(
          BooleanExpression.or(
            'Wind Waker',
            BooleanExpression.and(
              BooleanExpression.and('Grappling Hook', "Hero's Bow"),
              "Hero's Sword",
            ),
            'Skull Hammer',
          ),
        );
      });
    });

    describe('when the location requirements contain a macro', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Grappling Hook | My Fake Macro | Skull Hammer',
            },
          },
        };

        Macros.macros = {
          'My Fake Macro': "Grappling Hook | Hero's Sword",
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

        expect(expression).toEqual(
          BooleanExpression.or(
            'Grappling Hook',
            BooleanExpression.or(
              'Grappling Hook',
              "Hero's Sword",
            ),
            'Skull Hammer',
          ),
        );
      });
    });

    describe('when the location requires another location with Can Access macro', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Can Access Item Location "Outset Island - Savage Labyrinth - Floor 50"',
            },
            'Savage Labyrinth - Floor 50': {
              need: "Grappling Hook | Hero's Bow",
            },
          },
        };
      });

      test('returns the requirements for the other location', () => {
        const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

        expect(expression).toEqual(
          BooleanExpression.and(
            BooleanExpression.or('Grappling Hook', "Hero's Bow"),
          ),
        );
      });
    });

    describe('when the location requires another location with Has Accessed macro', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 50"',
            },
            'Savage Labyrinth - Floor 50': {
              need: "Grappling Hook | Hero's Bow",
            },
          },
        };
      });

      test('returns the unmodified requirements when flattened is false', () => {
        const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

        expect(expression).toEqual(
          BooleanExpression.and('Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 50"'),
        );
      });

      test('returns the requirements for the other location when flattened is true', () => {
        const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', true);

        expect(expression).toEqual(
          BooleanExpression.and(
            BooleanExpression.or('Grappling Hook', "Hero's Bow"),
          ),
        );
      });
    });

    describe('option requirements', () => {
      const testOptionRequirements = ({
        requirements,
        options,
        expectedExpression,
      }) => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: requirements,
              },
            },
          };

          Settings.initializeRaw({ options });
        });

        test('returns the requirements expression', () => {
          const expression = LogicHelper.rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30', false);

          expect(expression).toEqual(expectedExpression);
        });
      };

      describe('when the location requires an option to be enabled', () => {
        describe('when the option is enabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Enabled',
            options: {
              [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
            },
            expectedExpression: BooleanExpression.and('Nothing'),
          });
        });

        describe('when the option is disabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Enabled',
            options: {
              [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: false,
            },
            expectedExpression: BooleanExpression.and('Impossible'),
          });
        });
      });

      describe('when the location requires an option to be disabled', () => {
        describe('when the option is enabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Disabled',
            options: {
              [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
            },
            expectedExpression: BooleanExpression.and('Impossible'),
          });
        });

        describe('when the option is disabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Disabled',
            options: {
              [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: false,
            },
            expectedExpression: BooleanExpression.and('Nothing'),
          });
        });
      });

      describe('when the location requires an option to match a value', () => {
        describe('when the option matches the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is "Swordless"',
            options: {
              [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.SWORDLESS,
            },
            expectedExpression: BooleanExpression.and('Nothing'),
          });
        });

        describe('when the option does not match the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is "Swordless"',
            options: {
              [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
            },
            expectedExpression: BooleanExpression.and('Impossible'),
          });
        });
      });

      describe('when the location requires an option not to match a value', () => {
        describe('when the option matches the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is Not "Swordless"',
            options: {
              [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.SWORDLESS,
            },
            expectedExpression: BooleanExpression.and('Impossible'),
          });
        });

        describe('when the option does not match the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is Not "Swordless"',
            options: {
              [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
            },
            expectedExpression: BooleanExpression.and('Nothing'),
          });
        });
      });

      describe('when the location requires an option to contain a value', () => {
        describe('when the option contains the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Contains "Grappling Hook"',
            options: {
              [Permalink.OPTIONS.STARTING_GEAR]: {
                'Grappling Hook': 1,
              },
            },
            expectedExpression: BooleanExpression.and('Nothing'),
          });
        });

        describe('when the option does not contain the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Contains "Grappling Hook"',
            options: {
              [Permalink.OPTIONS.STARTING_GEAR]: {
                'Deku Leaf': 1,
                'Grappling Hook': 0,
              },
            },
            expectedExpression: BooleanExpression.and('Impossible'),
          });
        });
      });

      describe('when the location requires an option not to contain a value', () => {
        describe('when the option contains the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Does Not Contain "Grappling Hook"',
            options: {
              [Permalink.OPTIONS.STARTING_GEAR]: {
                'Grappling Hook': 1,
              },
            },
            expectedExpression: BooleanExpression.and('Impossible'),
          });
        });

        describe('when the option does not contain the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Does Not Contain "Grappling Hook"',
            options: {
              [Permalink.OPTIONS.STARTING_GEAR]: {
                'Deku Leaf': 1,
              },
            },
            expectedExpression: BooleanExpression.and('Nothing'),
          });
        });
      });
    });
  });

  describe('bossRequirementForDungeon', () => {
    test('returns the name of the boss requirement for the dungeon', () => {
      const bossRequirement = LogicHelper.bossRequirementForDungeon('Tower of the Gods');

      expect(bossRequirement).toEqual('Defeated Gohdan');
    });
  });

  describe('bossLocationForRequirement', () => {
    beforeEach(() => {
      fullSetup();
    });

    test('returns the general and detailed location of the boss heart container for the boss requirement', () => {
      const bossLocation = LogicHelper.bossLocationForRequirement('Defeated Jalhalla');

      expect(bossLocation).toEqual({
        generalLocation: 'Earth Temple',
        detailedLocation: 'Jalhalla Heart Container',
      });
    });
  });

  describe('isBossRequired', () => {
    beforeEach(() => {
      fullSetup({
        options: {
          [Permalink.OPTIONS.REQUIRED_BOSSES]: true,
          [Permalink.OPTIONS.NUM_REQUIRED_BOSSES]: 3,
        },
      });

      LogicHelper.setBossNotRequired('Dragon Roost Cavern');
      LogicHelper.setBossNotRequired('Tower of the Gods');
    });

    test('returns true when the boss for the dungeon is required', () => {
      const isBossRequired = LogicHelper.isBossRequired('Earth Temple');

      expect(isBossRequired).toEqual(true);
    });

    test('returns false when the boss for the dungeon is not required', () => {
      const isBossRequired = LogicHelper.isBossRequired('Tower of the Gods');

      expect(isBossRequired).toEqual(false);
    });
  });

  describe('anyNonRequiredBossesRemaining', () => {
    beforeEach(() => {
      fullSetup({
        options: {
          [Permalink.OPTIONS.REQUIRED_BOSSES]: true,
          [Permalink.OPTIONS.NUM_REQUIRED_BOSSES]: 3,
        },
      });
    });

    describe('when none of the non-required bosses are marked', () => {
      test('returns true', () => {
        const anyNonRequiredBossesRemaining = LogicHelper.anyNonRequiredBossesRemaining();

        expect(anyNonRequiredBossesRemaining).toEqual(true);
      });
    });

    describe('when only some non-required bosses are marked', () => {
      beforeEach(() => {
        LogicHelper.setBossNotRequired('Dragon Roost Cavern');
        LogicHelper.setBossNotRequired('Tower of the Gods');
      });

      test('returns true', () => {
        const anyNonRequiredBossesRemaining = LogicHelper.anyNonRequiredBossesRemaining();

        expect(anyNonRequiredBossesRemaining).toEqual(true);
      });
    });

    describe('when all non-required bosses are marked', () => {
      beforeEach(() => {
        LogicHelper.setBossNotRequired('Dragon Roost Cavern');
        LogicHelper.setBossNotRequired('Tower of the Gods');
        LogicHelper.setBossNotRequired('Earth Temple');
      });

      test('returns false', () => {
        const anyNonRequiredBossesRemaining = LogicHelper.anyNonRequiredBossesRemaining();

        expect(anyNonRequiredBossesRemaining).toEqual(false);
      });
    });
  });

  describe('boss requirements', () => {
    beforeEach(() => {
      fullSetup({
        options: {
          [Permalink.OPTIONS.REQUIRED_BOSSES]: true,
          [Permalink.OPTIONS.NUM_REQUIRED_BOSSES]: 3,
        },
      });
    });

    describe('when none of the non-required bosses are marked', () => {
      test('includes all bosses in the requirements for Defeat Ganondorf', () => {
        const requirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', false);

        expect(requirements).toMatchSnapshot();
      });

      test('flattens the boss requirements when flattened is true', () => {
        const requirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', true);

        expect(requirements).toMatchSnapshot();
      });
    });

    describe('when bosses are marked as non-required', () => {
      beforeEach(() => {
        LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', false); // Test that the memoization is invalidated

        LogicHelper.setBossNotRequired('Dragon Roost Cavern');
        LogicHelper.setBossNotRequired('Tower of the Gods');
        LogicHelper.setBossNotRequired('Earth Temple');
      });

      test('includes only required bosses in the requirements for Defeat Ganondorf', () => {
        const requirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', false);

        expect(requirements).toMatchSnapshot();
      });

      test('flattens the boss requirements of only the required bosses when flattened is true', () => {
        const requirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', true);

        expect(requirements).toMatchSnapshot();
      });
    });

    describe('when bosses are marked as non-required and then unmarked', () => {
      beforeEach(() => {
        LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', false); // Test that the memoization is invalidated

        LogicHelper.setBossNotRequired('Dragon Roost Cavern');
        LogicHelper.setBossNotRequired('Tower of the Gods');
        LogicHelper.setBossNotRequired('Earth Temple');

        LogicHelper.setBossRequired('Dragon Roost Cavern');
        LogicHelper.setBossRequired('Earth Temple');
      });

      test('includes only required bosses in the requirements for Defeat Ganondorf', () => {
        const requirements = LogicHelper.requirementsForLocation("Ganon's Tower", 'Defeat Ganondorf', false);

        expect(requirements).toMatchSnapshot();
      });
    });
  });

  describe('anyProgressItemCharts', () => {
    describe('when there are only treasure progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: false,
          },
        });
      });

      test('returns true', () => {
        expect(LogicHelper.anyProgressItemCharts()).toEqual(true);
      });
    });

    describe('when there are only triforce progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns true', () => {
        expect(LogicHelper.anyProgressItemCharts()).toEqual(true);
      });
    });

    describe('when there are treasure and triforce progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns true', () => {
        expect(LogicHelper.anyProgressItemCharts()).toEqual(true);
      });
    });

    describe('when there are no progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: false,
          },
        });
      });

      test('returns false', () => {
        expect(LogicHelper.anyProgressItemCharts()).toEqual(false);
      });
    });
  });

  describe('allCharts', () => {
    describe('when there are only treasure progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: false,
          },
        });
      });

      test('returns all treasure charts for includeNonProgressCharts = false', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: false });

        expect(allCharts).toEqual(LogicHelper.ALL_TREASURE_CHARTS);
      });

      test('returns all charts for includeNonProgressCharts = true', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: true });

        expect(allCharts).toEqual(
          _.concat(LogicHelper.ALL_TREASURE_CHARTS, LogicHelper.ALL_TRIFORCE_CHARTS),
        );
      });
    });

    describe('when there are only triforce progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns all triforce charts for includeNonProgressCharts = false', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: false });

        expect(allCharts).toEqual(LogicHelper.ALL_TRIFORCE_CHARTS);
      });

      test('returns all charts for includeNonProgressCharts = true', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: true });

        expect(allCharts).toEqual(
          _.concat(LogicHelper.ALL_TREASURE_CHARTS, LogicHelper.ALL_TRIFORCE_CHARTS),
        );
      });
    });

    describe('when there are treasure and triforce progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: true,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: true,
          },
        });
      });

      test('returns all charts for includeNonProgressCharts = false', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: false });

        expect(allCharts).toEqual(
          _.concat(LogicHelper.ALL_TREASURE_CHARTS, LogicHelper.ALL_TRIFORCE_CHARTS),
        );
      });

      test('returns all charts for includeNonProgressCharts = true', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: true });

        expect(allCharts).toEqual(
          _.concat(LogicHelper.ALL_TREASURE_CHARTS, LogicHelper.ALL_TRIFORCE_CHARTS),
        );
      });
    });

    describe('when there are no progress charts', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: false,
            [Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS]: false,
          },
        });
      });

      test('returns no charts for includeNonProgressCharts = false', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: false });

        expect(allCharts).toEqual([]);
      });

      test('returns all charts for includeNonProgressCharts = true', () => {
        const allCharts = LogicHelper.allCharts({ includeNonProgressCharts: true });

        expect(allCharts).toEqual(
          _.concat(LogicHelper.ALL_TREASURE_CHARTS, LogicHelper.ALL_TRIFORCE_CHARTS),
        );
      });
    });
  });

  describe('macroNameForEntrance', () => {
    test('returns the correct macro name for a dungeon', () => {
      const macroName = LogicHelper.macroNameForEntrance('Forbidden Woods');

      expect(macroName).toEqual('Can Access Dungeon Entrance in Forest Haven Sector');
    });

    test('returns the correct macro name for a cave', () => {
      const macroName = LogicHelper.macroNameForEntrance('Pawprint Isle Wizzrobe Cave');

      expect(macroName).toEqual('Can Access Secret Cave Entrance on Pawprint Isle Side Isle');
    });
  });

  describe('requirementImplies', () => {
    test('returns true when the second requirement is nothing', () => {
      const implies = LogicHelper.requirementImplies('Grappling Hook', 'Nothing');

      expect(implies).toEqual(true);
    });

    test('returns false when the first requirement is nothing', () => {
      const implies = LogicHelper.requirementImplies('Nothing', 'Grappling Hook');

      expect(implies).toEqual(false);
    });

    test('returns true when the first requirement is impossible', () => {
      const implies = LogicHelper.requirementImplies('Impossible', 'Grappling Hook');

      expect(implies).toEqual(true);
    });

    test('returns false when the second requirement is impossible', () => {
      const implies = LogicHelper.requirementImplies('Grappling Hook', 'Impossible');

      expect(implies).toEqual(false);
    });

    test('returns true when both requirements are the same standard item', () => {
      const implies = LogicHelper.requirementImplies('Grappling Hook', 'Grappling Hook');

      expect(implies).toEqual(true);
    });

    test('returns false when the requirements are different standard items', () => {
      const implies = LogicHelper.requirementImplies('Deku Leaf', 'Grappling Hook');

      expect(implies).toEqual(false);
    });

    test('returns false when the one item is standard and the other is progressive', () => {
      const implies = LogicHelper.requirementImplies('Deku Leaf', 'Progressive Sword x2');

      expect(implies).toEqual(false);
    });

    test('returns true when both requirements are the same progressive item', () => {
      const implies = LogicHelper.requirementImplies('Progressive Sword x2', 'Progressive Sword x2');

      expect(implies).toEqual(true);
    });

    test('returns false when both requirements are different progressive items with the same count', () => {
      const implies = LogicHelper.requirementImplies('Progressive Bow x2', 'Progressive Sword x2');

      expect(implies).toEqual(false);
    });

    test('returns true when the first requirement is the same progressive item with a higher count', () => {
      const implies = LogicHelper.requirementImplies('Progressive Sword x3', 'Progressive Sword x2');

      expect(implies).toEqual(true);
    });

    test('returns false when the first requirement is the same progressive item with a lower count', () => {
      const implies = LogicHelper.requirementImplies('Progressive Sword x3', 'Progressive Sword x4');

      expect(implies).toEqual(false);
    });
  });

  describe('splitExpression', () => {
    test('splits and trims an expression', () => {
      const input = "Can Defeat Darknuts & Can Play Wind's Requiem & (Grappling Hook | Hero's Sword | Skull Hammer)";

      const splitExpression = LogicHelper.splitExpression(input);

      expect(splitExpression).toEqual([
        'Can Defeat Darknuts',
        '&',
        "Can Play Wind's Requiem",
        '&',
        '(',
        'Grappling Hook',
        '|',
        "Hero's Sword",
        '|',
        'Skull Hammer',
        ')',
      ]);
    });
  });
});
