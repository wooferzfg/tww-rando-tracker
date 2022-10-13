import _ from 'lodash';

import Locations from './locations';
import LogicHelper from './logic-helper';
import TrackerState from './tracker-state';

describe('TrackerState', () => {
  beforeEach(() => {
    Locations.reset();
    LogicHelper.reset();
  });

  describe('default', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data',
          },
        },
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            test: 'data',
          },
        },
      };

      LogicHelper.startingItems = {
        'Progressive Shield': 1,
        'Wind Waker': 1,
        "Boat's Sail": 1,
        "Wind's Requiem": 1,
        'Ballad of Gales': 1,
        'Song of Passing': 1,
        'Progressive Sword': 1,
      };
    });

    test('initializes the entrances as an empty object', () => {
      const defaultState = TrackerState.default();

      expect(defaultState.entrances).toEqual({});
    });

    test('initializes the items', () => {
      const defaultState = TrackerState.default();

      expect(defaultState.items).toMatchSnapshot();
    });

    test('initializes the checked locations', () => {
      const defaultState = TrackerState.default();

      expect(defaultState.locationsChecked).toMatchSnapshot();
    });

    test('initializes the items for locations', () => {
      const defaultState = TrackerState.default();

      expect(defaultState.itemsForLocations).toMatchSnapshot();
    });
  });

  describe('createStateRaw', () => {
    test('creates the state with the provided entrances, items, and locations checked', () => {
      const items = {
        'Deku Leaf': 2,
      };
      const entrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
      const locationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };
      const itemsForLocations = {
        'Dragon Roost Cavern': {
          "Bird's Nest": 'Deku Leaf',
        },
      };

      const newState = TrackerState.createStateRaw({
        entrances,
        items,
        itemsForLocations,
        locationsChecked,
      });

      expect(newState.entrances).toEqual(entrances);
      expect(newState.items).toEqual(items);
      expect(newState.itemsForLocations).toEqual(itemsForLocations);
      expect(newState.locationsChecked).toEqual(locationsChecked);
    });
  });

  describe('readState', () => {
    let expectedItems;
    let expectedEntrances;
    let expectedLocationsChecked;
    let expectedItemsForLocations;
    let trackerState;

    beforeEach(() => {
      expectedItems = {
        'Deku Leaf': 2,
      };
      expectedEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
      expectedLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };
      expectedItemsForLocations = {
        'Dragon Roost Cavern': {
          "Bird's Nest": 'Deku Leaf',
        },
      };

      trackerState = TrackerState.createStateRaw({
        entrances: expectedEntrances,
        items: expectedItems,
        itemsForLocations: expectedItemsForLocations,
        locationsChecked: expectedLocationsChecked,
      });
    });

    test('returns an object with the entire state', () => {
      const stateData = trackerState.readState();

      expect(stateData).toEqual({
        entrances: expectedEntrances,
        items: expectedItems,
        itemsForLocations: expectedItemsForLocations,
        locationsChecked: expectedLocationsChecked,
      });
    });
  });

  describe('getItemValue', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.items = {
        'Deku Leaf': 2,
      };
    });

    test('returns the value of the item', () => {
      const itemValue = state.getItemValue('Deku Leaf');

      expect(itemValue).toEqual(2);
    });
  });

  describe('incrementItem', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
    });

    describe('when the item is already at max quantity', () => {
      beforeEach(() => {
        LogicHelper.startingItems = {
          'Progressive Sword': 2,
        };

        state.items = {
          'Progressive Sword': 4,
        };
      });

      test('returns a new state with the item reset to the minimum quantity', () => {
        const newState = state.incrementItem('Progressive Sword');

        expect(newState.items['Progressive Sword']).toEqual(2);
      });
    });

    describe('when the item is not already at max quantity', () => {
      beforeEach(() => {
        state.items = {
          'Deku Leaf': 0,
        };
      });

      test('returns a new state with the item count incremented by 1', () => {
        const newState = state.incrementItem('Deku Leaf');

        expect(newState.items['Deku Leaf']).toEqual(1);
      });
    });
  });

  describe('decrementItem', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
    });

    describe('when the item is already at min quantity', () => {
      beforeEach(() => {
        LogicHelper.startingItems = {
          'Progressive Sword': 2,
        };

        state.items = {
          'Progressive Sword': 2,
        };
      });

      test('returns a new state with the item reset to the maximum quantity', () => {
        const newState = state.decrementItem('Progressive Sword');

        expect(newState.items['Progressive Sword']).toEqual(4);
      });
    });

    describe('when the item is not already at min quantity', () => {
      beforeEach(() => {
        state.items = {
          'Deku Leaf': 1,
        };
      });

      test('returns a new state with the item count decremented by 1', () => {
        const newState = state.decrementItem('Deku Leaf');

        expect(newState.items['Deku Leaf']).toEqual(0);
      });
    });
  });

  describe('getEntranceForExit', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.entrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
    });

    test('returns the value of the entrance', () => {
      const entranceValue = state.getEntranceForExit('Needle Rock Isle Secret Cave');

      expect(entranceValue).toEqual('Dragon Roost Cavern');
    });
  });

  describe('getExitForEntrance', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.entrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
    });

    test('returns the value of the entrance', () => {
      const entranceValue = state.getExitForEntrance('Dragon Roost Cavern');

      expect(entranceValue).toEqual('Needle Rock Isle Secret Cave');
    });
  });

  describe('setEntranceForExit', () => {
    let state;

    beforeEach(() => {
      const initialEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };

      state = new TrackerState();
      state.entrances = _.clone(initialEntrances);
    });

    test('returns a new state with the entrance value modified', () => {
      const newState = state.setEntranceForExit('Needle Rock Isle Secret Cave', 'Forbidden Woods');

      expect(newState.entrances['Needle Rock Isle Secret Cave']).toEqual('Forbidden Woods');
    });
  });

  describe('unsetEntranceForExit', () => {
    let state;

    beforeEach(() => {
      const initialEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
        'Forbidden Woods': 'Tower of the Gods',
      };

      state = new TrackerState();
      state.entrances = _.clone(initialEntrances);
    });

    test('returns a new state with the entrance value unset', () => {
      const newState = state.unsetEntranceForExit('Needle Rock Isle Secret Cave');

      expect(newState.entrances).toEqual({
        'Forbidden Woods': 'Tower of the Gods',
      });
    });
  });

  describe('isEntranceChecked', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.entrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
        'Forbidden Woods': 'Tower of the Gods',
      };
    });

    describe('when the entrance is checked', () => {
      test('returns true', () => {
        const isEntranceChecked = state.isEntranceChecked('Dragon Roost Cavern');

        expect(isEntranceChecked).toEqual(true);
      });
    });

    describe('when the entrance is not checked', () => {
      test('returns false', () => {
        const isEntranceChecked = state.isEntranceChecked('Forbidden Woods');

        expect(isEntranceChecked).toEqual(false);
      });
    });
  });

  describe('isLocationChecked', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.locationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };
    });

    test('returns whether the location is checked', () => {
      const isLocationChecked = state.isLocationChecked('Dragon Roost Cavern', "Bird's Nest");

      expect(isLocationChecked).toEqual(true);
    });
  });

  describe('toggleLocationChecked', () => {
    let state;

    beforeEach(() => {
      const initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };

      state = new TrackerState();
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
    });

    describe('when the location is already checked', () => {
      beforeEach(() => {
        state.locationsChecked = {
          'Dragon Roost Cavern': {
            "Bird's Nest": true,
          },
        };
      });

      test('returns a new state with the location not checked', () => {
        const newState = state.toggleLocationChecked('Dragon Roost Cavern', "Bird's Nest");

        const newIsLocationChecked = _.get(newState.locationsChecked, ['Dragon Roost Cavern', "Bird's Nest"]);

        expect(newIsLocationChecked).toEqual(false);
      });
    });

    describe('when the location is not already checked', () => {
      beforeEach(() => {
        state.locationsChecked = {
          'Dragon Roost Cavern': {
            "Bird's Nest": false,
          },
        };
      });

      test('returns a new state with the location not checked', () => {
        const newState = state.toggleLocationChecked('Dragon Roost Cavern', "Bird's Nest");

        const newIsLocationChecked = _.get(newState.locationsChecked, ['Dragon Roost Cavern', "Bird's Nest"]);

        expect(newIsLocationChecked).toEqual(true);
      });
    });
  });

  describe('getLocationsForItem', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.itemsForLocations = {
        'Windfall Island': {
          'Maggie - Free Item': 'Progressive Sword',
          'House of Wealth Chest': 'Progressive Sword',
          'Tott - Play Rhythm': 'Bombs',
        },
        'Dragon Roost Cavern': {
          'First Room': 'Boomerang',
          "Bird's Nest": 'Progressive Sword',
        },
      };
    });

    test('returns the location for the item', () => {
      const location = state.getLocationsForItem('Progressive Sword');

      expect(location).toEqual([{
        generalLocation: 'Windfall Island',
        detailedLocation: 'Maggie - Free Item',
      }, {
        generalLocation: 'Windfall Island',
        detailedLocation: 'House of Wealth Chest',
      }, {
        generalLocation: 'Dragon Roost Cavern',
        detailedLocation: "Bird's Nest",
      }]);
    });
  });

  describe('getItemForLocation', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.itemsForLocations = {
        'Windfall Island': {
          'Maggie - Free Item': 'Deku Leaf',
        },
      };
    });

    test('returns the value of the entrance', () => {
      const entranceValue = state.getItemForLocation('Windfall Island', 'Maggie - Free Item');

      expect(entranceValue).toEqual('Deku Leaf');
    });
  });

  describe('setItemForLocation', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();

      state.itemsForLocations = {
        'Dragon Roost Cavern': {
          "Bird's Nest": null,
        },
      };
    });

    test('returns a new state with the item for location value modified', () => {
      const newState = state.setItemForLocation('Grappling Hook', 'Windfall Island', 'Maggie - Free Item');

      const newItemForLocation = _.get(newState.itemsForLocations, ['Windfall Island', 'Maggie - Free Item']);

      expect(newItemForLocation).toEqual('Grappling Hook');
    });
  });

  describe('getChartFromChartMapping', () => {
    test('returns chart', () => {
      const state = new TrackerState();

      state.islandsForCharts = {
        'Treasure Chart 24': 'Windfall Island',
      };

      const chart = state.getChartFromChartMapping('Windfall Island');

      expect(chart).toBe('Treasure Chart 24');
    });
  });

  describe('getIslandFromChartMapping', () => {
    test('returns island', () => {
      const state = new TrackerState();

      state.islandsForCharts = {
        'Treasure Chart 24': 'Windfall Island',
      };

      const island = state.getIslandFromChartMapping('Treasure Chart 24');

      expect(island).toBe('Windfall Island');
    });
  });

  describe('setChartMapping', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();

      state.islandsForCharts = {};
    });

    test('sets chart mapping', () => {
      const newState = state.setChartMapping('Treasure Chart 10', 'Chart for Outset Island');

      const newIslandsForCharts = _.get(newState.islandsForCharts, 'Treasure Chart 10');

      expect(newIslandsForCharts).toBe('Outset Island');
    });
  });

  describe('unsetChartMapping', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();

      state.islandsForCharts = {
        'Treasure Chart 23': 'Pawprint Isle',
      };
    });

    test('removes chart mapping', () => {
      const newState = state.unsetChartMapping('Chart for Pawprint Isle');

      const newIslandsForCharts = _.get(newState.islandsForCharts, 'Treasure Chart 23', null);

      expect(newIslandsForCharts).toBe(null);
    });

    test('does not remove chart mapping for different chart', () => {
      const newState = state.unsetChartMapping('Chart for Windfall Island');

      const newIslandsForCharts = _.get(newState.islandsForCharts, 'Treasure Chart 23', null);

      expect(newIslandsForCharts).toBe('Pawprint Isle');
    });
  });

  describe('unsetItemForLocation', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();

      state.itemsForLocations = {
        'Dragon Roost Cavern': {
          "Bird's Nest": 'Bombs',
        },
      };
    });

    test('returns a new state with the item for location value set to null', () => {
      const newState = state.unsetItemForLocation('Dragon Roost Cavern', "Bird's Nest");

      const newItemForLocation = _.get(newState.itemsForLocations, ['Dragon Roost Cavern', "Bird's Nest"]);

      expect(newItemForLocation).toEqual(null);
    });
  });
});
