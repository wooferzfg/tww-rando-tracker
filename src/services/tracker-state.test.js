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
        "Hero's Shield": 1,
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

      const newState = TrackerState.createStateRaw({
        entrances,
        items,
        locationsChecked,
      });

      expect(newState.entrances).toEqual(entrances);
      expect(newState.items).toEqual(items);
      expect(newState.locationsChecked).toEqual(locationsChecked);
    });
  });

  describe('readState', () => {
    let expectedItems;
    let expectedEntrances;
    let expectedLocationsChecked;
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

      trackerState = TrackerState.createStateRaw({
        entrances: expectedEntrances,
        items: expectedItems,
        locationsChecked: expectedLocationsChecked,
      });
    });

    test('returns an object with the entire state', () => {
      const stateData = trackerState.readState();

      expect(stateData).toEqual({
        entrances: expectedEntrances,
        items: expectedItems,
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
    let initialEntrances;
    let initialLocationsChecked;

    beforeEach(() => {
      initialEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
      initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };

      state = new TrackerState();

      state.entrances = _.clone(initialEntrances);
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
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

    test('keeps the other values unmodified', () => {
      const newState = state.incrementItem('Deku Leaf');

      expect(newState.entrances).toEqual(initialEntrances);
      expect(newState.locationsChecked).toEqual(initialLocationsChecked);
    });
  });

  describe('decrementItem', () => {
    let state;
    let initialEntrances;
    let initialLocationsChecked;

    beforeEach(() => {
      initialEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
      initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };

      state = new TrackerState();

      state.entrances = _.clone(initialEntrances);
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
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

    test('keeps the other values unmodified', () => {
      const newState = state.decrementItem('Deku Leaf');

      expect(newState.entrances).toEqual(initialEntrances);
      expect(newState.locationsChecked).toEqual(initialLocationsChecked);
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
    let initialItems;
    let initialLocationsChecked;

    beforeEach(() => {
      initialItems = {
        'Deku Leaf': 2,
      };
      const initialEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
      initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };

      state = new TrackerState();

      state.items = _.clone(initialItems);
      state.entrances = _.clone(initialEntrances);
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
    });

    test('returns a new state with the entrance value modified', () => {
      const newState = state.setEntranceForExit('Needle Rock Isle Secret Cave', 'Forbidden Woods');

      expect(newState.entrances['Needle Rock Isle Secret Cave']).toEqual('Forbidden Woods');
    });

    test('keeps the other values unmodified', () => {
      const newState = state.setEntranceForExit('Needle Rock Isle Secret Cave', 'Forbidden Woods');

      expect(newState.items).toEqual(initialItems);
      expect(newState.locationsChecked).toEqual(initialLocationsChecked);
    });
  });

  describe('unsetEntranceForExit', () => {
    let state;
    let initialItems;
    let initialLocationsChecked;

    beforeEach(() => {
      initialItems = {
        'Deku Leaf': 2,
      };
      const initialEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
        'Forbidden Woods': 'Tower of the Gods',
      };
      initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };

      state = new TrackerState();

      state.items = _.clone(initialItems);
      state.entrances = _.clone(initialEntrances);
      state.locationsChecked = _.cloneDeep(initialLocationsChecked);
    });

    test('returns a new state with the entrance value unset', () => {
      const newState = state.unsetEntranceForExit('Needle Rock Isle Secret Cave');

      expect(newState.entrances).toEqual({
        'Forbidden Woods': 'Tower of the Gods',
      });
    });

    test('keeps the other values unmodified', () => {
      const newState = state.unsetEntranceForExit('Needle Rock Isle Secret Cave');

      expect(newState.items).toEqual(initialItems);
      expect(newState.locationsChecked).toEqual(initialLocationsChecked);
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
    let initialItems;
    let initialEntrances;

    beforeEach(() => {
      initialItems = {
        'Deku Leaf': 2,
      };
      initialEntrances = {
        'Needle Rock Isle Secret Cave': 'Dragon Roost Cavern',
      };
      const initialLocationsChecked = {
        'Dragon Roost Cavern': {
          "Bird's Nest": true,
        },
      };

      state = new TrackerState();

      state.items = _.clone(initialItems);
      state.entrances = _.clone(initialEntrances);
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

    test('keeps the other values unmodified', () => {
      const newState = state.toggleLocationChecked('Dragon Roost Cavern', "Bird's Nest");

      expect(newState.items).toEqual(initialItems);
      expect(newState.entrances).toEqual(initialEntrances);
    });
  });
});
