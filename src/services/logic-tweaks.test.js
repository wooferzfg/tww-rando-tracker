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
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
          },
        });
      });

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
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
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
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
          },
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when there are nested dungeon entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
          },
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when there are nested cave entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
          },
        });
      });

      test('updates the macros', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when there are random fairy fountain entrances', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
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
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
            [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
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

    describe('when required bosses mode is enabled', () => {
      beforeEach(() => {
        Settings.initializeRaw({
          options: {
            [Permalink.OPTIONS.REQUIRED_BOSSES]: true,
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
            ),
          },
        });
      });

      test('updates the required bosses macro', () => {
        LogicTweaks.applyTweaks();

        expect(Macros.macros['Can Defeat All Required Bosses']).toMatchSnapshot();
      });
    });
  });
});
