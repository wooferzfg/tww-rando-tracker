import LogicLoader from './logic-loader';
import Settings from './settings';

describe('LogicLoader', () => {
  beforeEach(() => {
    Settings.reset();

    Settings.version = '1.8.0';

    const itemLocationsFile = `
      Outset Island - Savage Labyrinth - Floor 30:
        Need:
          Can Access Savage Labyrinth
          & Can Defeat Keese
          & Can Defeat Miniblins
        # Here is a comment
        Original item: Triforce Chart 6
        Types: Savage Labyrinth
        Paths:
          - Cave09/Room20.arc/Chest000
      Dragon Roost Cavern - Bird's Nest:
        Need:
          Can Access Dragon Roost Cavern
          & DRC Small Key x3
        Original item: Small Key
        Types: Dungeon
        Paths:
          - M_NewD2/Room3.arc/Actor016
    `;

    const macrosFile = `
      Can Play Wind's Requiem:
        Wind Waker & Wind's Requiem
      Can Move Boulders:
        # A comment
        Bombs | Power Bracelets
    `;

    global.fetch = (url) => {
      let mockFileForUrl;
      if (url === 'https://raw.githubusercontent.com/LagoLunatic/wwrando/1.8.0/logic/item_locations.txt') {
        mockFileForUrl = itemLocationsFile;
      } else if (url === 'https://raw.githubusercontent.com/LagoLunatic/wwrando/1.8.0/logic/macros.txt') {
        mockFileForUrl = macrosFile;
      } else {
        throw Error(`File not found for URL: ${url}`);
      }

      return Promise.resolve({
        text: () => Promise.resolve(mockFileForUrl),
      });
    };
  });

  test('returns the item locations file and macros file', async () => {
    const logicFiles = await LogicLoader.loadLogicFiles();

    expect(logicFiles).toEqual({
      itemLocationsFile: {
        'Outset Island - Savage Labyrinth - Floor 30': {
          Need: 'Can Access Savage Labyrinth & Can Defeat Keese & Can Defeat Miniblins',
          'Original item': 'Triforce Chart 6',
          Types: 'Savage Labyrinth',
          Paths: ['Cave09/Room20.arc/Chest000'],
        },
        "Dragon Roost Cavern - Bird's Nest": {
          Need: 'Can Access Dragon Roost Cavern & DRC Small Key x3',
          'Original item': 'Small Key',
          Types: 'Dungeon',
          Paths: ['M_NewD2/Room3.arc/Actor016'],
        },
      },
      macrosFile: {
        "Can Play Wind's Requiem": "Wind Waker & Wind's Requiem",
        'Can Move Boulders': 'Bombs | Power Bracelets',
      },
    });
  });
});
