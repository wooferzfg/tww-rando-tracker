import LogicController from './logic-controller';

describe('LogicController', () => {
  describe('allItems', () => {
    test('returns a list of all the items, including entrances, charts, and keys', () => {
      const allItems = LogicController.allItems();

      expect(allItems).toMatchSnapshot();
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
});
