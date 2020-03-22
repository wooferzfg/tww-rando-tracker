import LogicController from './logic-controller';
import Settings from '../tracker/settings';

describe('LogicController', () => {
  describe('allItems', () => {
    test('returns a list of all the items, including entrances, charts, and keys', () => {
      const allItems = LogicController.allItems();

      expect(allItems).toMatchSnapshot();
    });
  });

  describe('setStartingAndImpossibleItems', () => {
    describe('with no starting shards, no starting gear, and starting with a sword', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 0,
            swordMode: 'Start with Sword'
          }
        });
      });

      test('sets the starting and impossible items', () => {
        LogicController.setStartingAndImpossibleItems();

        expect(LogicController.startingItems).toMatchSnapshot();
        expect(LogicController.impossibleItems).toEqual([]);
      });
    });

    describe('with starting shards', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 7,
            startingGear: 0,
            swordMode: 'Start with Sword'
          }
        });
      });

      test('sets the number of starting shards', () => {
        LogicController.setStartingAndImpossibleItems();

        expect(LogicController.startingItems).toMatchSnapshot();
        expect(LogicController.impossibleItems).toEqual([]);
      });
    });

    describe('with starting gear', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 549755813922, // Bombs, Deku Leaf, and 2 sword upgrades
            swordMode: 'Start with Sword'
          }
        });
      });

      test('sets the starting items based on the starting gear', () => {
        LogicController.setStartingAndImpossibleItems();

        expect(LogicController.startingItems).toMatchSnapshot();
        expect(LogicController.impossibleItems).toEqual([]);
      });
    });

    describe('when starting without a sword', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 0,
            swordMode: 'Randomized Sword'
          }
        });
      });

      test('sets sword to 0 in the starting items', () => {
        LogicController.setStartingAndImpossibleItems();

        expect(LogicController.startingItems).toMatchSnapshot();
        expect(LogicController.impossibleItems).toEqual([]);
      });
    });

    describe('when in swordless mode', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 0,
            swordMode: 'Swordless'
          }
        });
      });

      test('sets sword to 0 in the starting items and adds impossible items', () => {
        LogicController.setStartingAndImpossibleItems();

        expect(LogicController.startingItems).toMatchSnapshot();
        expect(LogicController.impossibleItems).toMatchSnapshot();
      });
    });
  });

  describe('isMainDungeon', () => {
    describe('when the dungeon is a main dungeon', () => {
      test('returns true', () => {
        const isMainDungeon = LogicController.isMainDungeon('Dragon Roost Cavern');

        expect(isMainDungeon).toEqual(true);
      });
    });

    describe('when the dungeon is Forsaken Fortress', () => {
      test('returns false', () => {
        const isMainDungeon = LogicController.isMainDungeon('Forsaken Fortress');

        expect(isMainDungeon).toEqual(false);
      });
    });

    describe("when the dungeon is Ganon's Tower", () => {
      test('returns false', () => {
        const isMainDungeon = LogicController.isMainDungeon("Ganon's Tower");

        expect(isMainDungeon).toEqual(false);
      });
    });

    describe('when the argument is not a dungeon', () => {
      test('returns false', () => {
        const isMainDungeon = LogicController.isMainDungeon('Pawprint Isle');

        expect(isMainDungeon).toEqual(false);
      });
    });
  });

  describe('shortDungeonName', () => {
    test('returns the short dungeon name based on the dungeon name', () => {
      const shortDungeonName = LogicController.shortDungeonName('Dragon Roost Cavern');

      expect(shortDungeonName).toEqual('DRC');
    });
  });

  describe('dungeonEntryName', () => {
    test('returns the entry name based on a dungeon name', () => {
      const entryName = LogicController.dungeonEntryName('Dragon Roost Cavern');

      expect(entryName).toEqual('Entered DRC');
    });
  });

  describe('shortCaveName', () => {
    test('returns the cave name without mentioning secret caves', () => {
      const shortCaveName = LogicController.shortCaveName('Dragon Roost Island Secret Cave');

      expect(shortCaveName).toEqual('Dragon Roost Island Cave');
    });

    test('returns the cave name without mentioning warp maze caves', () => {
      const shortCaveName = LogicController.shortCaveName('Diamond Steppe Island Warp Maze Cave');

      expect(shortCaveName).toEqual('Diamond Steppe Island Cave');
    });
  });

  describe('caveEntryName', () => {
    test('returns the entry name based on a cave name', () => {
      const entryName = LogicController.caveEntryName('Dragon Roost Island Secret Cave');

      expect(entryName).toEqual('Entered Dragon Roost Island Cave');
    });
  });

  describe('isRandomDungeonEntrances', () => {
    describe('when dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Separately)'
          }
        });
      });

      test('returns true', () => {
        const isRandomDungeonEntrances = LogicController.isRandomDungeonEntrances();

        expect(isRandomDungeonEntrances).toEqual(true);
      });
    });

    describe('when dungeon entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Secret Caves'
          }
        });
      });

      test('returns false', () => {
        const isRandomDungeonEntrances = LogicController.isRandomDungeonEntrances();

        expect(isRandomDungeonEntrances).toEqual(false);
      });
    });
  });

  describe('isRandomCaveEntrances', () => {
    describe('when cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Separately)'
          }
        });
      });

      test('returns true', () => {
        const isRandomCaveEntrances = LogicController.isRandomCaveEntrances();

        expect(isRandomCaveEntrances).toEqual(true);
      });
    });

    describe('when cave entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons'
          }
        });
      });

      test('returns false', () => {
        const isRandomCaveEntrances = LogicController.isRandomCaveEntrances();

        expect(isRandomCaveEntrances).toEqual(false);
      });
    });
  });

  describe('isRandomEntrancesTogether', () => {
    describe('when dungeon and cave entrances are randomized together', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Together)'
          }
        });
      });

      test('returns true', () => {
        const isRandomEntrancesTogether = LogicController.isRandomEntrancesTogether();

        expect(isRandomEntrancesTogether).toEqual(true);
      });
    });

    describe('when dungeon and cave entrances are not randomized together', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Separately)'
          }
        });
      });

      test('returns false', () => {
        const isRandomEntrancesTogether = LogicController.isRandomEntrancesTogether();

        expect(isRandomEntrancesTogether).toEqual(false);
      });
    });
  });
});
