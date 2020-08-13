import _ from 'lodash';

import ITEMS from '../data/items.json';
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
import TrackerController from './tracker-controller';
import TrackerState from './tracker-state';

describe('TrackerController', () => {
  afterEach(() => {
    TrackerController.reset();
  });

  const validateReturnedData = (refreshedData) => {
    const {
      logic,
      saveData,
      trackerState,
    } = refreshedData;

    expect(saveData).toMatchSnapshot();
    expect(trackerState).toBeInstanceOf(TrackerState);
    expect(logic).toBeInstanceOf(LogicCalculation);
    expect(logic.state).toBe(trackerState);
  };

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

  describe('logic simplification', () => {
    const testLogicSimplification = (testCaseName, permalink) => {
      describe(testCaseName, () => {
        let itemsList;
        let logic;
        let trackerState;

        beforeEach(async () => {
          jest.spyOn(LogicLoader, 'loadLogicFiles').mockReturnValue(
            Promise.resolve({
              itemLocationsFile: TEST_ITEM_LOCATIONS,
              macrosFile: TEST_MACROS,
            }),
          );

          ({
            logic,
            trackerState,
          } = await TrackerController.initializeFromPermalink(permalink));

          const remainingItems = _.mapValues(
            ITEMS,
            (itemCount, itemName) => (
              LogicHelper.maxItemCount(itemName) - LogicHelper.startingItemCount(itemName)
            ),
          );

          // choose a random permutation of all the remaining items
          itemsList = _.shuffle(
            _.flatMap(
              remainingItems,
              (itemCount, itemName) => _.times(
                itemCount,
                _.constant(itemName),
              ),
            ),
          );
        });

        test('returns requirements that are logically equivalent to the raw requirements', () => {
          _.forEach(itemsList, (itemName) => {
            Locations.mapLocations((generalLocation, detailedLocation) => {
              const simplifiedRequirements = LogicHelper.requirementsForLocation(
                generalLocation,
                detailedLocation,
              );
              const rawRequirements = LogicHelper._rawRequirementsForLocation(
                generalLocation,
                detailedLocation,
              );

              const simplifiedRequirementsMet = logic._areRequirementsMet(simplifiedRequirements);
              const rawRequirementsMet = logic._areRequirementsMet(rawRequirements);

              if (simplifiedRequirementsMet !== rawRequirementsMet) {
                throw Error(
                  `Incorrect result for location: ${generalLocation} - ${detailedLocation}\n\n`
                  + `Raw requirements result: ${rawRequirementsMet}\n`
                  + `Simplified requirements result: ${simplifiedRequirementsMet}\n\n`
                  + `Raw requirements: ${JSON.stringify(rawRequirements, null, 2)}\n\n`
                  + `Simplified requirements: ${JSON.stringify(simplifiedRequirements, null, 2)}\n\n`
                  + `Current items:\n${JSON.stringify(trackerState.items, null, 2)}`,
                );
              }
            });

            trackerState = trackerState.incrementItem(itemName);
            logic = new LogicCalculation(trackerState);
          });
        });
      });
    };

    testLogicSimplification(
      'default settings',
      Permalink.DEFAULT_PERMALINK,
    );

    testLogicSimplification(
      'default settings with randomized sword',
      'MS44LjAARmF0YWxBbm90aGVyRGVtYW5kAAcBAwAOQEAIAAAAAAAAAA==',
    );

    testLogicSimplification(
      'default settings with swordless',
      'MS44LjAARmF0YWxBbm90aGVyRGVtYW5kAAcBAwAOgEAIAAAAAAAAAA==',
    );
  });
});
