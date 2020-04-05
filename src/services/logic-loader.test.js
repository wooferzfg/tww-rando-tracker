import LogicLoader from './logic-loader';
import Settings from './settings';

describe('LogicLoader', () => {
  let itemLocationsFile;
  let macrosFile;

  beforeEach(() => {
    itemLocationsFile = {
      'Outset Island - Savage Labyrinth - Floor 30': {
        Need: 'Can Access Savage Labyrinth & Can Defeat Keese & Can Defeat Miniblins',
        'Original item': 'Triforce Chart 6',
        Types: 'Savage Labyrinth',
        Paths: ['Cave09/Room20.arc/Chest000']
      },
      "Dragon Roost Cavern - Bird's Nest": {
        Need: 'Can Access Dragon Roost Cavern & DRC Small Key x3',
        'Original item': 'Small Key',
        Types: 'Dungeon',
        Paths: ['M_NewD2/Room3.arc/Actor016']
      }
    };

    macrosFile = {
      "Can Play Wind's Requiem": "Wind Waker & Wind's Requiem",
      'Can Move Boulders': 'Bombs | Power Bracelets'
    };

    jest.spyOn(LogicLoader, '_loadLogicFile').mockImplementation((fileName) => {
      if (fileName === 'item_locations.txt') {
        return Promise.resolve(itemLocationsFile);
      }
      if (fileName === 'macros.txt') {
        return Promise.resolve(macrosFile);
      }
      throw Error(`File not found: ${fileName}`);
    });
  });

  test('returns the item locations file and macros file', async () => {
    const logicFiles = await LogicLoader.loadLogicFiles();

    expect(logicFiles).toEqual({
      itemLocationsFile,
      macrosFile
    });
  });

  describe('_logicFileUrl', () => {
    beforeEach(() => {
      Settings.version = '1.7.0';
    });

    test('returns the logic file URL for the correct version', () => {
      const fileUrl = LogicLoader._logicFileUrl('item_locations.txt');

      expect(fileUrl).toEqual('https://raw.githubusercontent.com/LagoLunatic/wwrando/1.7.0/logic/item_locations.txt');
    });
  });
});
