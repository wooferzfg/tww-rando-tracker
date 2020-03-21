import TrackerState from './tracker-state';
import Locations from '../logic/locations';

describe('TrackerState', () => {
  describe('initialize', () => {
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
    });

    test('initializes the entrances as an empty object', () => {
      TrackerState.initialize();

      expect(TrackerState.entrances).toEqual({});
    });

    test('initializes the items', () => {
      TrackerState.initialize();

      expect(TrackerState.items).toMatchSnapshot();
    });

    test('initializes the checked locations', () => {
      TrackerState.initialize();

      expect(TrackerState.locationsChecked).toMatchSnapshot();
    });
  });
});
