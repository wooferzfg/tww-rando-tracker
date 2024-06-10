import _ from 'lodash';

import Locations from './locations';

describe('Locations', () => {
  beforeEach(() => {
    Locations.reset();
  });

  describe('initialize', () => {
    let itemLocationsFile;

    beforeEach(() => {
      itemLocationsFile = {
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
      };
    });

    test('initializes the locations', () => {
      Locations.initialize(itemLocationsFile);

      expect(Locations.locations).toEqual({
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            need: 'Can Access Dragon Roost Cavern & DRC Small Key x3',
            originalItem: 'Small Key',
            types: 'Dungeon',
          },
        },
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            need: 'Can Access Savage Labyrinth & Can Defeat Keese & Can Defeat Miniblins',
            originalItem: 'Triforce Chart 6',
            types: 'Savage Labyrinth',
          },
        },
      });
      expect(Locations.locationsList).toEqual([
        {
          generalLocation: 'Outset Island',
          detailedLocation: 'Savage Labyrinth - Floor 30',
        },
        {
          generalLocation: 'Dragon Roost Cavern',
          detailedLocation: "Bird's Nest",
        },
      ]);
    });
  });

  describe('initializeRaw', () => {
    let allLocations;
    let allLocationsList;

    beforeEach(() => {
      allLocations = {
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            need: 'Can Access Dragon Roost Cavern & DRC Small Key x3',
            originalItem: 'Small Key',
            types: 'Dungeon',
          },
        },
      };
      allLocationsList = [
        {
          generalLocation: 'Dragon Roost Cavern',
          detailedLocation: "Bird's Nest",
        },
      ];
    });

    test('returns all of the locations', () => {
      Locations.initializeRaw(allLocations, allLocationsList);

      expect(Locations.locations).toEqual(allLocations);
      expect(Locations.locationsList).toEqual(allLocationsList);
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      const allLocations = {
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            need: 'Can Access Dragon Roost Cavern & DRC Small Key x3',
            originalItem: 'Small Key',
            types: 'Dungeon',
          },
        },
      };
      const allLocationsList = [
        {
          generalLocation: 'Dragon Roost Cavern',
          detailedLocation: "Bird's Nest",
        },
      ];
      Locations.initializeRaw(allLocations, allLocationsList);
    });

    test('resets the locations', () => {
      Locations.reset();

      expect(Locations.locations).toEqual(null);
      expect(Locations.locationsList).toEqual(null);
    });
  });

  describe('readAll', () => {
    let expectedLocations;

    beforeEach(() => {
      expectedLocations = {
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            need: 'Can Access Dragon Roost Cavern & DRC Small Key x3',
            originalItem: 'Small Key',
            types: 'Dungeon',
          },
        },
      };

      Locations.locations = expectedLocations;
    });

    test('returns all of the locations', () => {
      const allLocations = Locations.readAll();

      expect(allLocations).toEqual(expectedLocations);
    });
  });

  describe('readLocationsList', () => {
    let expectedLocationsList;

    beforeEach(() => {
      expectedLocationsList = [
        {
          generalLocation: 'Dragon Roost Cavern',
          detailedLocation: "Bird's Nest",
        },
      ];

      Locations.locationsList = expectedLocationsList;
    });

    test('returns all of the locations list', () => {
      const allLocationsList = Locations.readLocationsList();

      expect(allLocationsList).toEqual(expectedLocationsList);
    });
  });

  describe('allGeneralLocations', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data',
          },
        },
        'Dragon Roost Cavern': {
          'First Room': {
            test: 'data',
          },
          "Bird's Nest": {
            test: 'data',
          },
        },
      };
    });

    test('returns the keys of all the general locations', () => {
      const allGeneralLocations = Locations.allGeneralLocations();

      expect(allGeneralLocations).toEqual([
        'Outset Island',
        'Dragon Roost Cavern',
      ]);
    });
  });

  describe('mapLocations', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data',
          },
          'Sunken Treasure': {
            test: 'data',
          },
        },
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            test: 'data',
          },
        },
      };
      Locations.locationsList = [
        {
          generalLocation: 'Outset Island',
          detailedLocation: 'Savage Labyrinth - Floor 30',
        },
        {
          generalLocation: 'Dragon Roost Cavern',
          detailedLocation: "Bird's Nest",
        },
        {
          generalLocation: 'Outset Island',
          detailedLocation: 'Sunken Treasure',
        },
      ];
    });

    test('creates an object by calling the iteratee on each location, in the order of locationsList', () => {
      let index = 0;
      const mappedLocations = Locations.mapLocations(
        (generalLocation, detailedLocation) => {
          const returnValue = `${detailedLocation} $$$ ${generalLocation} $$$ ${index}`;
          index += 1;
          return returnValue;
        },
      );

      expect(mappedLocations).toEqual({
        'Outset Island': {
          'Savage Labyrinth - Floor 30': 'Savage Labyrinth - Floor 30 $$$ Outset Island $$$ 0',
          'Sunken Treasure': 'Sunken Treasure $$$ Outset Island $$$ 2',
        },
        'Dragon Roost Cavern': {
          "Bird's Nest": "Bird's Nest $$$ Dragon Roost Cavern $$$ 1",
        },
      });
    });
  });

  describe('detailedLocationsForGeneralLocation', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data',
          },
          'Savage Labyrinth - Floor 50': {
            test: 'data',
          },
        },
      };
    });

    test('creates an object by calling the iteratee on each location', () => {
      const detailedLocations = Locations.detailedLocationsForGeneralLocation('Outset Island');

      expect(detailedLocations).toEqual([
        'Savage Labyrinth - Floor 30',
        'Savage Labyrinth - Floor 50',
      ]);
    });
  });

  describe('getLocation', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            need: 'Requirements',
          },
        },
      };
    });

    test('returns the value for the location and provided info key', () => {
      const location = Locations.getLocation(
        'Outset Island',
        'Savage Labyrinth - Floor 30',
        Locations.KEYS.NEED,
      );

      expect(location).toEqual('Requirements');
    });
  });

  describe('setLocation', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data',
          },
        },
      };
    });

    test('updates the location with the provided info key and value', () => {
      Locations.setLocation(
        'Outset Island',
        'Savage Labyrinth - Floor 30',
        Locations.KEYS.NEED,
        'expected value',
      );

      const newValue = _.get(Locations.locations, ['Outset Island', 'Savage Labyrinth - Floor 30', 'need']);

      expect(newValue).toEqual('expected value');
    });
  });

  describe('addLocation', () => {
    beforeEach(() => {
      Locations.locationsList = [
        {
          generalLocation: 'Outset Island',
          detailedLocation: 'Savage Labyrinth - Floor 30',
        },
      ];
    });

    test('adds the given location to the locations list', () => {
      Locations.addLocation(
        "Ganon's Tower",
        'Defeat Ganondorf',
      );

      expect(Locations.locationsList).toEqual([
        {
          generalLocation: 'Outset Island',
          detailedLocation: 'Savage Labyrinth - Floor 30',
        },
        {
          generalLocation: "Ganon's Tower",
          detailedLocation: 'Defeat Ganondorf',
        },
      ]);
    });
  });

  describe('splitLocationName', () => {
    test('returns the general location and detailed location', () => {
      const input = 'Outset Island - Savage Labyrinth - Floor 30';

      const {
        generalLocation,
        detailedLocation,
      } = Locations.splitLocationName(input);

      expect(generalLocation).toEqual('Outset Island');
      expect(detailedLocation).toEqual('Savage Labyrinth - Floor 30');
    });

    test('returns the correct location when there are dashes in the general location', () => {
      const input = 'Seven-Star Isles - Sunken Treasure';

      const {
        generalLocation,
        detailedLocation,
      } = Locations.splitLocationName(input);

      expect(generalLocation).toEqual('Seven-Star Isles');
      expect(detailedLocation).toEqual('Sunken Treasure');
    });

    test('returns the correct location when there are dashes in the detailed location', () => {
      const input = 'Windfall Island - Jail - Tingle - First Gift';

      const {
        generalLocation,
        detailedLocation,
      } = Locations.splitLocationName(input);

      expect(generalLocation).toEqual('Windfall Island');
      expect(detailedLocation).toEqual('Jail - Tingle - First Gift');
    });
  });
});
