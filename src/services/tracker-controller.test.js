import _ from 'lodash';

import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';
import TEST_MACROS from '../data/test-macros.json';
import TEST_SAVE_DATA from '../data/test-save-data.json';

import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import LogicLoader from './logic-loader';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';
import Spheres from './spheres';
import TrackerController from './tracker-controller';
import TrackerState from './tracker-state';

describe('TrackerController', () => {
  beforeEach(() => {
    TrackerController.reset();

    jest.spyOn(LogicLoader, 'loadLogicFiles').mockReturnValue(
      Promise.resolve({
        itemLocationsFile: _.cloneDeep(TEST_ITEM_LOCATIONS),
        macrosFile: _.cloneDeep(TEST_MACROS),
      }),
    );
  });

  const validateReturnedData = (refreshedData) => {
    const {
      logic,
      saveData,
      spheres,
      trackerState,
    } = refreshedData;

    expect(saveData).toMatchSnapshot();
    expect(trackerState).toBeInstanceOf(TrackerState);
    expect(logic).toBeInstanceOf(LogicCalculation);
    expect(logic.state()).toBe(trackerState);
    expect(spheres).toBeInstanceOf(Spheres);
    expect(spheres.state()).toBe(trackerState);
  };

  describe('initializeFromPermalink', () => {
    test('returns the correct initial data', async () => {
      const initialData = await TrackerController.initializeFromPermalink(
        Permalink.DEFAULT_PERMALINK,
      );

      validateReturnedData(initialData);
    });
  });

  describe('initializeFromSaveData', () => {
    let saveData;

    beforeEach(() => {
      saveData = JSON.stringify(TEST_SAVE_DATA);
    });

    test('returns the correct initial data', () => {
      const initialData = TrackerController.initializeFromSaveData(saveData);

      validateReturnedData(initialData);
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

      newTrackerState = trackerState.incrementItem('Deku Leaf');
    });

    test('returns the correct refreshed data', () => {
      const refreshedData = TrackerController.refreshState(newTrackerState);

      validateReturnedData(refreshedData);
    });
  });
});
