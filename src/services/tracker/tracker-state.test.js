import TrackerState from './tracker-state';
import Locations from '../logic/locations';

const LOCATIONS_LIST = [
  {
    generalLocation: 'Outset Island',
    detailedLocation: 'Savage Labyrinth - Floor 30'
  },
  {
    generalLocation: 'Dragon Roost Cavern',
    detailedLocation: "Bird's Nest"
  }
];

describe('TrackerState', () => {
  describe('initialize', () => {
    beforeEach(() => {
      jest.spyOn(Locations, 'allLocations').mockReturnValue(LOCATIONS_LIST);
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
