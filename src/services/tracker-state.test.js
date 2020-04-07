import _ from 'lodash';

import TrackerState from './tracker-state';
import Locations from './locations';
import LogicHelper from './logic-helper';

describe('TrackerState', () => {
  afterEach(() => {
    Locations.reset();
    LogicHelper.reset();
  });

  describe('default', () => {
    beforeEach(() => {
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

      LogicHelper.startingItems = {
        "Hero's Shield": 1,
        'Wind Waker': 1,
        "Boat's Sail": 1,
        "Wind's Requiem": 1,
        'Ballad of Gales': 1,
        'Song of Passing': 1,
        'Progressive Sword': 1
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
  });

  describe('createStateManually', () => {
    test('creates the state with the provided entrances, items, and locations checked', () => {
      const items = {
        'Test Item': 2
      };
      const entrances = {
        'Test Entrance': 'Other Entrance'
      };
      const locationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true
        }
      };

      const newState = TrackerState.createStateManually({
        entrances,
        items,
        locationsChecked
      });

      expect(newState.entrances).toEqual(entrances);
      expect(newState.items).toEqual(items);
      expect(newState.locationsChecked).toEqual(locationsChecked);
    });
  });

  describe('getItemValue', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.items = {
        'Test Item': 2
      };
    });

    test('returns the value of the item', () => {
      const itemValue = state.getItemValue('Test Item');

      expect(itemValue).toEqual(2);
    });
  });

  describe('setItemValue', () => {
    let state; let initialItems; let initialEntrances; let
      initialLocationsChecked;

    beforeEach(() => {
      initialItems = {
        'Test Item': 2
      };
      initialEntrances = {
        'Test Entrance': 'Other Entrance'
      };
      initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true
        }
      };

      state = new TrackerState();

      state.items = _.clone(initialItems);
      state.entrances = _.clone(initialEntrances);
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
    });

    test('returns a new state with the item value modified', () => {
      const newState = state.setItemValue('Test Item', 3);

      expect(newState.items['Test Item']).toEqual(3);
    });

    test('keeps the other values unmodified', () => {
      const newState = state.setItemValue('Test Item', 3);

      expect(state.items).toEqual(initialItems);
      expect(state.entrances).toEqual(initialEntrances);
      expect(state.locationsChecked).toEqual(initialLocationsChecked);
      expect(newState.entrances).toEqual(initialEntrances);
      expect(newState.locationsChecked).toEqual(initialLocationsChecked);
    });
  });

  describe('getEntranceValue', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.entrances = {
        'Test Entrance': 'Other Entrance'
      };
    });

    test('returns the value of the entrance', () => {
      const entranceValue = state.getEntranceValue('Test Entrance');

      expect(entranceValue).toEqual('Other Entrance');
    });
  });

  describe('setEntranceValue', () => {
    let state; let initialItems; let initialEntrances; let
      initialLocationsChecked;

    beforeEach(() => {
      initialItems = {
        'Test Item': 2
      };
      initialEntrances = {
        'Test Entrance': 'Other Entrance'
      };
      initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true
        }
      };

      state = new TrackerState();

      state.items = _.clone(initialItems);
      state.entrances = _.clone(initialEntrances);
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
    });

    test('returns a new state with the entrance value modified', () => {
      const newState = state.setEntranceValue('Test Entrance', 'Other Entrance 2');

      expect(newState.entrances['Test Entrance']).toEqual('Other Entrance 2');
    });

    test('keeps the other values unmodified', () => {
      const newState = state.setEntranceValue('Test Entrance', 'Other Entrance 2');

      expect(state.items).toEqual(initialItems);
      expect(state.entrances).toEqual(initialEntrances);
      expect(state.locationsChecked).toEqual(initialLocationsChecked);
      expect(newState.items).toEqual(initialItems);
      expect(newState.locationsChecked).toEqual(initialLocationsChecked);
    });
  });

  describe('isLocationChecked', () => {
    let state;

    beforeEach(() => {
      state = new TrackerState();
      state.locationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true
        }
      };
    });

    test('returns whether the location is checked', () => {
      const isLocationChecked = state.isLocationChecked('Dragon Roost Cavern', "Bird's Nest");

      expect(isLocationChecked).toEqual(true);
    });
  });

  describe('setLocationChecked', () => {
    let state; let initialItems; let initialEntrances; let
      initialLocationsChecked;

    beforeEach(() => {
      initialItems = {
        'Test Item': 2
      };
      initialEntrances = {
        'Test Entrance': 'Other Entrance'
      };
      initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true
        }
      };

      state = new TrackerState();

      state.items = _.clone(initialItems);
      state.entrances = _.clone(initialEntrances);
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
    });

    test('returns a new state with the location checked value modified', () => {
      const newState = state.setLocationChecked('Dragon Roost Cavern', "Bird's Nest", false);

      const newIsLocationChecked = _.get(newState.locationsChecked, ['Dragon Roost Cavern', "Bird's Nest"]);

      expect(newIsLocationChecked).toEqual(false);
    });

    test('keeps the other values unmodified', () => {
      const newState = state.setLocationChecked('Dragon Roost Cavern', "Bird's Nest", false);

      expect(state.items).toEqual(initialItems);
      expect(state.entrances).toEqual(initialEntrances);
      expect(state.locationsChecked).toEqual(initialLocationsChecked);
      expect(newState.items).toEqual(initialItems);
      expect(newState.entrances).toEqual(initialEntrances);
    });
  });
});
