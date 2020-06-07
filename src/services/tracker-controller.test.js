import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';
import TEST_MACROS from '../data/test-macros.json';
import TEST_SAVE_DATA from '../data/test-save-data.json';

import Locations from './locations';
import LogicHelper from './logic-helper';
import LogicLoader from './logic-loader';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';
import TrackerController from './tracker-controller';

describe('TrackerController', () => {
  afterEach(() => {
    TrackerController.reset();
  });

  describe('initializeFromPermalink', () => {
    beforeEach(() => {
      jest.spyOn(LogicLoader, 'loadLogicFiles').mockReturnValue(
        Promise.resolve({
          itemLocationsFile: TEST_ITEM_LOCATIONS,
          macrosFile: TEST_MACROS,
        }),
      );
    });

    test('returns the correct initial data', async () => {
      const initialData = await TrackerController.initializeFromPermalink(
        Permalink.DEFAULT_PERMALINK,
      );

      expect(initialData).toMatchSnapshot();
    });
  });

  describe('initializeFromSaveData', () => {
    let saveData;

    beforeEach(() => {
      saveData = JSON.stringify(TEST_SAVE_DATA);
    });

    test('returns the correct initial data', () => {
      const initialData = TrackerController.initializeFromSaveData(saveData);

      expect(initialData).toMatchSnapshot();
    });
  });

  describe('reset', () => {
    beforeEach(async () => {
      await TrackerController.initializeFromPermalink(
        Permalink.DEFAULT_PERMALINK,
      );
    });

    test('resets all static classes', () => {
      TrackerController.reset();

      expect(Locations.locations).toEqual(null);
      expect(LogicHelper.impossibleItems).toEqual(null);
      expect(LogicHelper.startingItems).toEqual(null);
      expect(Macros.macros).toEqual(null);
      expect(Settings.flags).toEqual(null);
      expect(Settings.options).toEqual(null);
      expect(Settings.startingGear).toEqual(null);
      expect(Settings.version).toEqual(null);
    });
  });

  describe('refreshState', () => {
    let newTrackerState;

    beforeEach(async () => {
      const { trackerState } = await TrackerController.initializeFromPermalink(
        Permalink.DEFAULT_PERMALINK,
      );

      newTrackerState = trackerState.setItemValue('Deku Leaf', 1);
    });

    test('returns the correct refreshed data', () => {
      const refreshedData = TrackerController.refreshState(newTrackerState);

      expect(refreshedData).toMatchSnapshot();
    });
  });
});
