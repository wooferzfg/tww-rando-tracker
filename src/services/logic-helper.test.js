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
  beforeEach(() => {
    Locations.reset();
    LogicHelper.reset();
    Macros.reset();
    Settings.reset();
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

  describe('isRaceModeDungeon', () => {
    describe('when the dungeon is a race mode dungeon', () => {
      test('returns true', () => {
        const isRaceModeDungeon = LogicHelper.isRaceModeDungeon('Dragon Roost Cavern');

        expect(isRaceModeDungeon).toEqual(true);
      });
    });

    describe('when the dungeon is Forsaken Fortress', () => {
      test('returns true', () => {
        const isRaceModeDungeon = LogicHelper.isRaceModeDungeon('Forsaken Fortress');

        expect(isRaceModeDungeon).toEqual(true);
      });
    });

    describe("when the dungeon is Ganon's Tower", () => {
      test('returns false', () => {
        const isRaceModeDungeon = LogicHelper.isRaceModeDungeon("Ganon's Tower");

        expect(isRaceModeDungeon).toEqual(false);
      });
    });

    describe('when the argument is not a dungeon', () => {
      test('returns false', () => {
        const isRaceModeDungeon = LogicHelper.isRaceModeDungeon('Pawprint Isle');

        expect(isRaceModeDungeon).toEqual(false);
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
  });

  describe('cavesForIsland', () => {
    test('returns no cave entrances when the island has no entrances', () => {
      const caveEntrances = LogicHelper.cavesForIsland('Windfall Island');

      expect(caveEntrances).toEqual([]);
    });

    test('returns one cave entrance when the island has one entrance', () => {
      const caveEntrances = LogicHelper.cavesForIsland('Dragon Roost Island');

      expect(caveEntrances).toEqual(['Dragon Roost Island Secret Cave']);
    });

    test('returns the cave entrance when the island does not match the cave name', () => {
      const caveEntrances = LogicHelper.cavesForIsland('Private Oasis');

      expect(caveEntrances).toEqual(['Cabana Labyrinth']);
    });

    test('returns multiple cave entrances when the island has multiple entrances', () => {
      const caveEntrances = LogicHelper.cavesForIsland('Pawprint Isle');

      expect(caveEntrances).toEqual([
        'Pawprint Isle Chuchu Cave',
        'Pawprint Isle Wizzrobe Cave',
      ]);
    });
  });

  describe('isRandomEntrances', () => {
    describe('when dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
          },
        });
      });

      test('returns false', () => {
        const isRandomEntrances = LogicHelper.isRandomEntrances();

        expect(isRandomEntrances).toEqual(false);
      });
    });
  });

  describe('isRandomDungeonEntrances', () => {
    describe('when dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
          },
        });
      });

      test('returns true', () => {
        const isRandomDungeonEntrances = LogicHelper.isRandomDungeonEntrances();

        expect(isRandomDungeonEntrances).toEqual(true);
      });
    });

    describe('when dungeon entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES,
          },
        });
      });

      test('returns false', () => {
        const isRandomDungeonEntrances = LogicHelper.isRandomDungeonEntrances();

        expect(isRandomDungeonEntrances).toEqual(false);
      });
    });
  });

  describe('isRandomCaveEntrances', () => {
    describe('when cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
          },
        });
      });

      test('returns true', () => {
        const isRandomCaveEntrances = LogicHelper.isRandomCaveEntrances();

        expect(isRandomCaveEntrances).toEqual(true);
      });
    });

    describe('when cave entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
          },
        });
      });

      test('returns false', () => {
        const isRandomCaveEntrances = LogicHelper.isRandomCaveEntrances();

        expect(isRandomCaveEntrances).toEqual(false);
      });
    });
  });

  describe('allRandomEntrances', () => {
    describe('when entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES,
          },
        });
      });

      test('returns all the caves', () => {
        const allRandomEntrances = LogicHelper.allRandomEntrances();

        expect(allRandomEntrances).toMatchSnapshot();
      });
    });

    describe('when dungeon and cave entrances are randomized separately', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
          },
        });
      });

      test('returns all the dungeons and caves', () => {
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
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
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
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

  describe('_isValidLocation', () => {
    describe('when isDungeon is true', () => {
      describe('when the location is in a unique dungeon', () => {
        test('returns true', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            "Ganon's Tower",
            'Defeat Ganondorf',
            { isDungeon: true },
          );

          expect(isValidLocation).toEqual(true);
        });
      });

      describe('when the location is on an island', () => {
        test('returns false', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            'Outset Island',
            'Great Fairy',
            { isDungeon: true },
          );

          expect(isValidLocation).toEqual(false);
        });
      });

      describe('when the location is in a dungeon that is also an island', () => {
        beforeEach(() => {
          Locations.locations = {
            'Tower of the Gods': {
              'Light Two Torches': {
                types: 'Dungeon',
              },
            },
          };
        });

        test('returns true', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            'Tower of the Gods',
            'Light Two Torches',
            { isDungeon: true },
          );

          expect(isValidLocation).toEqual(true);
        });
      });

      describe('when the location is on an island that is also a dungeon', () => {
        beforeEach(() => {
          Locations.locations = {
            'Tower of the Gods': {
              'Sunken Treasure': {
                types: 'Sunken Treasure',
              },
            },
          };
        });

        test('returns false', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            'Tower of the Gods',
            'Sunken Treasure',
            { isDungeon: true },
          );

          expect(isValidLocation).toEqual(false);
        });
      });
    });

    describe('when isDungeon is false', () => {
      describe('when the location is on a unique island', () => {
        test('returns true', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            'Windfall Island',
            'Tott',
            { isDungeon: false },
          );

          expect(isValidLocation).toEqual(true);
        });
      });

      describe('when the location is in a dungeon', () => {
        test('returns false', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            'Forbidden Woods',
            'First Room',
            { isDungeon: false },
          );

          expect(isValidLocation).toEqual(false);
        });
      });

      describe('when the location is on an island that is also a dungeon', () => {
        beforeEach(() => {
          Locations.locations = {
            'Forsaken Fortress': {
              'Sunken Treasure': {
                types: 'Sunken Treasure',
              },
            },
          };
        });

        test('returns true', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            'Forsaken Fortress',
            'Sunken Treasure',
            { isDungeon: false },
          );

          expect(isValidLocation).toEqual(true);
        });
      });

      describe('when the location is in a dungeon that is also an island', () => {
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
          const isValidLocation = LogicHelper._isValidLocation(
            'Forsaken Fortress',
            'Phantom Ganon',
            { isDungeon: false },
          );

          expect(isValidLocation).toEqual(false);
        });
      });

      describe('when the location is in a miscellaneous location', () => {
        beforeEach(() => {
          Locations.locations = {
            Mailbox: {
              'Letter from Baito': {
                types: 'Mail',
              },
            },
          };
        });

        test('returns true', () => {
          const isValidLocation = LogicHelper._isValidLocation(
            'Mailbox',
            'Letter from Baito',
            { isDungeon: false },
          );

          expect(isValidLocation).toEqual(true);
        });
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

  describe('isRandomizedChartsSettings', () => {
    test('returns true when randomized charts is on', () => {
      Settings.initializeRaw({
        options: {
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
        },
      });

      expect(LogicHelper.isRandomizedChartsSettings()).toBe(true);
    });

    test('returns false when randomized charts is off', () => {
      Settings.initializeRaw({
        options: {
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
        },
      });

      expect(LogicHelper.isRandomizedChartsSettings()).toBe(false);
    });
  });

  describe('chartForIslandName', () => {
    test('returns chart for island name', () => {
      expect(LogicHelper.chartForIslandName('Outset Island')).toBe('Chart for Outset Island');
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
      test('returns true when treasure chart', () => {
        expect(LogicHelper.isRandomizedChart('Treasure Chart 25')).toBe(false);
      });
      test('returns true when triforce chart', () => {
        expect(LogicHelper.isRandomizedChart('Triforce Chart 25')).toBe(false);
      });
      test('returns false when item', () => {
        expect(LogicHelper.isRandomizedChart('Bombs')).toBe(false);
      });
    });
  });

  describe('filterDetailedLocations', () => {
    beforeEach(() => {
      Settings.initializeRaw({
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

      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
      Macros.initialize(_.cloneDeep(TEST_MACROS));

      LogicTweaks.applyTweaks();

      LogicHelper.initialize();
    });

    describe('when onlyProgressLocations is true', () => {
      test('returns the correct locations for Windfall Island', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Windfall Island', {
          isDungeon: false,
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
        const filteredLocations = LogicHelper.filterDetailedLocations('Tower of the Gods', {
          isDungeon: false,
          onlyProgressLocations: true,
        });

        expect(filteredLocations).toEqual(['Sunken Treasure']);
      });

      test('includes no locations for the Tower of the Gods dungeon', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Tower of the Gods', {
          isDungeon: true,
          onlyProgressLocations: true,
        });

        expect(filteredLocations).toEqual([]);
      });

      test("includes Defeat Ganondorf in Ganon's Tower", () => {
        const filteredLocations = LogicHelper.filterDetailedLocations("Ganon's Tower", {
          isDungeon: true,
          onlyProgressLocations: true,
        });

        expect(filteredLocations).toEqual(['Defeat Ganondorf']);
      });
    });

    describe('when onlyProgressLocations is false', () => {
      test('returns the correct locations for Forsaken Fortress', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Forsaken Fortress', {
          isDungeon: true,
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
          isDungeon: false,
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
          isDungeon: true,
          onlyProgressLocations: false,
        });

        expect(filteredLocations).toEqual([
          'Maze Chest',
          'Defeat Ganondorf',
        ]);
      });

      test('returns the correct locations for Hyrule', () => {
        const filteredLocations = LogicHelper.filterDetailedLocations('Hyrule', {
          isDungeon: false,
          onlyProgressLocations: false,
        });

        expect(filteredLocations).toEqual(['Master Sword Chamber']);
      });
    });

    describe('when isDungeon is not given', () => {
      test('includes both island and dungeon locations', () => {
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
          'Sunken Treasure',
        ]);
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
          'Tower of the Gods': {
            'Sunken Treasure': {
              types: 'Sunken Treasure',
            },
          },
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Tower of the Gods', 'Sunken Treasure');

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
            flags: [Settings.FLAGS.TINGLE_CHEST],
          });
        });

        test('returns true', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Tingle Statue Chest');

          expect(isPotentialKeyLocation).toEqual(true);
        });
      });

      describe('when the tingle chest flag is not active', () => {
        beforeEach(() => {
          Settings.initializeRaw({ flags: [] });
        });

        test('returns false', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Tingle Statue Chest');

          expect(isPotentialKeyLocation).toEqual(false);
        });
      });
    });

    describe('when the location is a boss item drop', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'Gohma Heart Container': {
              need: 'Grappling Hook & DRC Big Key',
              types: 'Dungeon',
            },
          },
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Dragon Roost Cavern', 'Gohma Heart Container');

        expect(isPotentialKeyLocation).toEqual(false);
      });
    });
  });

  describe('bossLocation', () => {
    beforeEach(() => {
      Locations.locations = {
        'Dragon Roost Cavern': {
          'Gohma Heart Container': {
            originalItem: 'Heart Container',
            types: 'Dungeon',
          },
        },
        'Tower of the Gods': {
          'Gohdan Heart Container': {
            originalItem: 'Heart Container',
            types: 'Dungeon',
          },
        },
        "Ganon's Tower": {
          'Defeat Ganondorf': {
            types: 'Dungeon',
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
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.KEYLUNACY]: false,
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
            [Permalink.OPTIONS.RACE_MODE]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
            [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
          },
          startingGear: {},
        });

        Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
        Macros.initialize(_.cloneDeep(TEST_MACROS));

        LogicTweaks.applyTweaks();

        LogicHelper.initialize();
      });

      test('returns no requirements for Dragon Roost Island - Wind Shrine', () => {
        const requirements = LogicHelper.requirementsForLocation('Dragon Roost Island', 'Wind Shrine');

        expect(requirements).toEqual(BooleanExpression.and('Nothing'));
      });

      test('returns simplified requirements for Outset Island - Savage Labyrinth - Floor 30', () => {
        const requirements = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Outset Island - Savage Labyrinth - Floor 50', () => {
        const requirements = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 50');

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Dragon Roost Cavern - Gohma Heart Container', () => {
        const requirements = LogicHelper.requirementsForLocation('Dragon Roost Cavern', 'Gohma Heart Container');

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Earth Temple - Jalhalla Heart Container', () => {
        const requirements = LogicHelper.requirementsForLocation('Earth Temple', 'Jalhalla Heart Container');

        expect(requirements).toMatchSnapshot();
      });

      test("returns simplified requirements for Mailbox - Beedle's Silver Membership Reward", () => {
        const requirements = LogicHelper.requirementsForLocation('Mailbox', "Beedle's Silver Membership Reward");

        expect(requirements).toMatchSnapshot();
      });

      test('returns simplified requirements for Cliff Plateau Isles - Cave', () => {
        const requirements = LogicHelper.requirementsForLocation('Cliff Plateau Isles', 'Cave');

        expect(requirements).toMatchSnapshot();
      });
    });

    describe('when swordless', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.KEYLUNACY]: false,
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
            [Permalink.OPTIONS.RACE_MODE]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
            [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.SWORDLESS,
          },
          startingGear: {},
        });

        Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
        Macros.initialize(_.cloneDeep(TEST_MACROS));

        LogicTweaks.applyTweaks();

        LogicHelper.initialize();
      });

      test('returns simplified requirements for The Great Sea - Ghost Ship', () => {
        const requirements = LogicHelper.requirementsForLocation('The Great Sea', 'Ghost Ship');

        expect(requirements).toMatchSnapshot();
      });
    });

    describe('when starting with a sword', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.KEYLUNACY]: false,
            [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
            [Permalink.OPTIONS.RACE_MODE]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
            [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
            [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
          },
          startingGear: {
            [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
          },
        });

        Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
        Macros.initialize(_.cloneDeep(TEST_MACROS));

        LogicTweaks.applyTweaks();

        LogicHelper.initialize();
      });

      test('returns simplified requirements for Cliff Plateau Isles - Cave', () => {
        const requirements = LogicHelper.requirementsForLocation('Cliff Plateau Isles', 'Cave');

        expect(requirements).toMatchSnapshot();
      });
    });
  });

  describe('requirementsForEntrance', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        options: {
          [Permalink.OPTIONS.KEYLUNACY]: false,
          [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
          [Permalink.OPTIONS.RACE_MODE]: false,
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
            Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
          [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
          [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
        },
        startingGear: {},
      });

      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
      Macros.initialize(_.cloneDeep(TEST_MACROS));

      LogicTweaks.applyTweaks();

      LogicHelper.initialize();
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

  describe('chartForIsland', () => {
    describe('when charts are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
          },
        });
      });

      test('returns a Treasure Chart when the island has a Triforce Chart', () => {
        const chartInfo = LogicHelper.chartForIsland('Seven-Star Isles');

        expect(chartInfo).toEqual({
          chartName: 'Triforce Chart 7',
          chartType: LogicHelper.CHART_TYPES.TREASURE,
        });
      });

      test('returns a Treasure Chart when the island has a Treasure Chart', () => {
        const chartInfo = LogicHelper.chartForIsland('Forsaken Fortress');

        expect(chartInfo).toEqual({
          chartName: 'Treasure Chart 25',
          chartType: LogicHelper.CHART_TYPES.TREASURE,
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

      test('returns a Triforce Chart when an island has one', () => {
        const chartInfo = LogicHelper.chartForIsland('Seven-Star Isles');

        expect(chartInfo).toEqual({
          chartName: 'Triforce Chart 7',
          chartType: LogicHelper.CHART_TYPES.TRIFORCE,
        });
      });

      test('returns a Treasure Chart when an island has one', () => {
        const chartInfo = LogicHelper.chartForIsland('Forsaken Fortress');

        expect(chartInfo).toEqual({
          chartName: 'Treasure Chart 25',
          chartType: LogicHelper.CHART_TYPES.TREASURE,
        });
      });
    });
  });

  describe('raceModeBannedLocations', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        options: {
          [Permalink.OPTIONS.KEYLUNACY]: false,
          [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
          [Permalink.OPTIONS.RACE_MODE]: false,
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
          [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
          [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.NO_STARTING_SWORD,
        },
        startingGear: {},
      });

      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
      Macros.initialize(_.cloneDeep(TEST_MACROS));

      LogicTweaks.applyTweaks();

      LogicHelper.initialize();
    });

    test('returns the correct locations for Dragon Roost Cavern', () => {
      const raceModeBannedLocations = LogicHelper.raceModeBannedLocations('Dragon Roost Cavern');

      expect(raceModeBannedLocations).toMatchSnapshot();
    });

    test('returns the correct locations for Forbidden Woods', () => {
      const raceModeBannedLocations = LogicHelper.raceModeBannedLocations('Forbidden Woods');

      expect(raceModeBannedLocations).toMatchSnapshot();
    });

    test('returns the correct locations for Tower of the Gods', () => {
      const raceModeBannedLocations = LogicHelper.raceModeBannedLocations('Tower of the Gods');

      expect(raceModeBannedLocations).toMatchSnapshot();
    });

    test('returns the correct locations for Forsaken Fortress', () => {
      const raceModeBannedLocations = LogicHelper.raceModeBannedLocations('Forsaken Fortress');

      expect(raceModeBannedLocations).toMatchSnapshot();
    });

    test('returns the correct locations for Earth Temple', () => {
      const raceModeBannedLocations = LogicHelper.raceModeBannedLocations('Earth Temple');

      expect(raceModeBannedLocations).toMatchSnapshot();
    });

    test('returns the correct locations for Wind Temple', () => {
      const raceModeBannedLocations = LogicHelper.raceModeBannedLocations('Wind Temple');

      expect(raceModeBannedLocations).toMatchSnapshot();
    });
  });

  describe('_rawRequirementsForLocation', () => {
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
        const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
        const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
            const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
            const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
            const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
            const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
            const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
            const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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

          LogicHelper.impossibleItems = {
            'Wind Waker': 1,
          };
        });

        test('replaces the item in the requirements expression', () => {
          const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
        const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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

    describe('when the location requires another location', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Can Access Other Location "Outset Island - Savage Labyrinth - Floor 50"',
            },
            'Savage Labyrinth - Floor 50': {
              need: "Grappling Hook | Hero's Bow",
            },
          },
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
          const expression = LogicHelper._rawRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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

  describe('_macroNameForEntrance', () => {
    test('returns the correct macro name for a dungeon', () => {
      const macroName = LogicHelper._macroNameForEntrance('Forbidden Woods');

      expect(macroName).toEqual('Can Access Dungeon Entrance In Forest Haven Sector');
    });

    test('returns the correct macro name for a cave', () => {
      const macroName = LogicHelper._macroNameForEntrance('Pawprint Isle Wizzrobe Cave');

      expect(macroName).toEqual('Can Access Secret Cave Entrance on Pawprint Isle Side Isle');
    });
  });

  describe('_requirementImplies', () => {
    test('returns true when the second requirement is nothing', () => {
      const implies = LogicHelper._requirementImplies('Grappling Hook', 'Nothing');

      expect(implies).toEqual(true);
    });

    test('returns false when the first requirement is nothing', () => {
      const implies = LogicHelper._requirementImplies('Nothing', 'Grappling Hook');

      expect(implies).toEqual(false);
    });

    test('returns true when the first requirement is impossible', () => {
      const implies = LogicHelper._requirementImplies('Impossible', 'Grappling Hook');

      expect(implies).toEqual(true);
    });

    test('returns false when the second requirement is impossible', () => {
      const implies = LogicHelper._requirementImplies('Grappling Hook', 'Impossible');

      expect(implies).toEqual(false);
    });

    test('returns true when both requirements are the same standard item', () => {
      const implies = LogicHelper._requirementImplies('Grappling Hook', 'Grappling Hook');

      expect(implies).toEqual(true);
    });

    test('returns false when the requirements are different standard items', () => {
      const implies = LogicHelper._requirementImplies('Deku Leaf', 'Grappling Hook');

      expect(implies).toEqual(false);
    });

    test('returns false when the one item is standard and the other is progressive', () => {
      const implies = LogicHelper._requirementImplies('Deku Leaf', 'Progressive Sword x2');

      expect(implies).toEqual(false);
    });

    test('returns true when both requirements are the same progressive item', () => {
      const implies = LogicHelper._requirementImplies('Progressive Sword x2', 'Progressive Sword x2');

      expect(implies).toEqual(true);
    });

    test('returns false when both requirements are different progressive items with the same count', () => {
      const implies = LogicHelper._requirementImplies('Progressive Bow x2', 'Progressive Sword x2');

      expect(implies).toEqual(false);
    });

    test('returns true when the first requirement is the same progressive item with a higher count', () => {
      const implies = LogicHelper._requirementImplies('Progressive Sword x3', 'Progressive Sword x2');

      expect(implies).toEqual(true);
    });

    test('returns false when the first requirement is the same progressive item with a lower count', () => {
      const implies = LogicHelper._requirementImplies('Progressive Sword x3', 'Progressive Sword x4');

      expect(implies).toEqual(false);
    });
  });

  describe('_splitExpression', () => {
    test('splits and trims an expression', () => {
      const input = "Can Defeat Darknuts & Can Play Wind's Requiem & (Grappling Hook | Hero's Sword | Skull Hammer)";

      const splitExpression = LogicHelper._splitExpression(input);

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
