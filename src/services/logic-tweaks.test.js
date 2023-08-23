import _ from 'lodash';

import ISLANDS from '../data/islands.json';
import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';
import TEST_MACROS from '../data/test-macros.json';

import Locations from './locations';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';

describe('LogicTweaks', () => {
  describe('applyTweaks', () => {
    beforeEach(() => {
      Locations.reset();
      Macros.reset();
      Settings.reset();

      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
      Macros.initialize(_.cloneDeep(TEST_MACROS));
    });

    describe('when no options are set', () => {
      test('updates the locations', () => {
        LogicTweaks.applyTweaks();

        expect(Locations.locations).toMatchSnapshot();
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
          },
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES,
          },
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when charts are randomized', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
          },
        });
      });

      test('keeps sunken Triforce Shard locations as Sunken Treasure', () => {
        LogicTweaks.applyTweaks();

        expect.assertions(ISLANDS.length);
        _.forEach(Locations.locations, (detailedLocations) => {
          _.forEach(detailedLocations, (locationData) => {
            if (_.includes(locationData[Locations.KEYS.NEED], 'Chart for Island')) {
              expect(locationData[Locations.KEYS.TYPES]).toEqual(Settings.FLAGS.SUNKEN_TREASURE);
            }
          });
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });
  });
});
