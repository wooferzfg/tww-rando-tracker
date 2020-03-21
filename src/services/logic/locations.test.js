import Locations from './locations';

const ITEM_LOCATIONS_FILE = {
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

describe('Locations', () => {
  describe('initialize', () => {
    test('initializes the locations', () => {
      Locations.initialize(ITEM_LOCATIONS_FILE);

      expect(Locations.locations).toMatchSnapshot();
    });
  });

  describe('allLocations', () => {
    test('creates an array with all location names', () => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data'
          }
        },
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            test: 'data'
          }
        }
      };

      expect(Locations.allLocations()).toMatchSnapshot();
    });
  });

  describe('_splitLocationName', () => {
    test('returns the general location and detailed location', () => {
      const input = 'Outset Island - Savage Labyrinth - Floor 30';

      const {
        generalLocation,
        detailedLocation
      } = Locations._splitLocationName(input);

      expect(generalLocation).toEqual('Outset Island');
      expect(detailedLocation).toEqual('Savage Labyrinth - Floor 30');
    });
  });
});
