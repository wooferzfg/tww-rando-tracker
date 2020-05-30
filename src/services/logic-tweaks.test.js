import TEST_ITEM_LOCATIONS from '../data/test-item-locations';
import TEST_MACROS from '../data/test-macros';

import LogicTweaks from './logic-tweaks';
import Locations from './locations';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';

describe('LogicTweaks', () => {
  describe('applyTweaks', () => {
    beforeEach(() => {
      Locations.initialize(TEST_ITEM_LOCATIONS);
      Macros.initialize(TEST_MACROS);
    });

    afterEach(() => {
      Locations.reset();
      Macros.reset();
      Settings.reset();
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
        Settings.initializeManually({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS
          }
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initializeManually({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES
          }
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when charts are randomized', () => {
      beforeEach(() => {
        Settings.initializeManually({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true
          }
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });
  });
});
