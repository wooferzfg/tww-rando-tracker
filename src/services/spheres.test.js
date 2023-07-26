import _ from 'lodash';

import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';
import TEST_MACROS from '../data/test-macros.json';

import Locations from './locations';
import LogicHelper from './logic-helper';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';
import Spheres from './spheres';
import TrackerState from './tracker-state';

describe('Spheres', () => {
  describe('calculate', () => {
    let trackerState;

    const fullSetup = (settingsOverrides = {}) => {
      const defaultSettings = {
        options: {
          [Permalink.OPTIONS.KEYLUNACY]: false,
          [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
          [Permalink.OPTIONS.RACE_MODE]: false,
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
          [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
          [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
        },
        startingGear: {
          [LogicHelper.ITEMS.BALLAD_OF_GALES]: 1,
          [LogicHelper.ITEMS.PROGRESSIVE_MAGIC_METER]: 1,
          [LogicHelper.ITEMS.PROGRESSIVE_SHIELD]: 1,
          [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
          [LogicHelper.ITEMS.SONG_OF_PASSING]: 1,
        },
        flags: [
          Settings.FLAGS.DUNGEON,
          Settings.FLAGS.PUZZLE_SECRET_CAVE,
          Settings.FLAGS.GREAT_FAIRY,
          Settings.FLAGS.FREE_GIFT,
          Settings.FLAGS.MISC,
          Settings.FLAGS.OTHER_CHEST,
          Settings.FLAGS.EXPENSIVE_PURCHASE,
        ],
      };

      Settings.initializeRaw(_.merge(defaultSettings, settingsOverrides));

      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
      Macros.initialize(_.cloneDeep(TEST_MACROS));

      LogicTweaks.applyTweaks();

      LogicHelper.initialize();

      trackerState = TrackerState.default();
    };

    const updateForItemAndLocation = (itemName, generalLocation, detailedLocation) => {
      trackerState = trackerState
        .toggleLocationChecked(generalLocation, detailedLocation)
        .incrementItem(itemName)
        .setItemForLocation(itemName, generalLocation, detailedLocation);
    };

    beforeEach(() => {
      Locations.reset();
      LogicHelper.reset();
      Macros.reset();
      Settings.reset();
    });

    describe('when only having starting items', () => {
      beforeEach(() => {
        fullSetup();
      });

      test('only sets sphere to 0 for accessible locations', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Windfall Island', 'Jail - Tingle - First Gift'),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boarded Up Chest'),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('The Great Sea', 'Cyclos'),
        ).toEqual(null);

        expect(
          spheres.sphereForLocation('Forsaken Fortress', 'Chest on Bed'),
        ).toEqual(null);
      });
    });

    describe('when finding an item in each sphere', () => {
      beforeEach(() => {
        fullSetup();

        updateForItemAndLocation('Bombs', 'Windfall Island', 'Jail - Tingle - First Gift');
        updateForItemAndLocation('Deku Leaf', 'Pawprint Isle', 'Chuchu Cave - Behind Left Boulder');
        updateForItemAndLocation('Hookshot', 'Greatfish Isle', 'Hidden Chest');
      });

      test('increases the sphere by 1 for each additional location', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Windfall Island', 'Jail - Tingle - First Gift'),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('Pawprint Isle', 'Chuchu Cave - Behind Left Boulder'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Greatfish Isle', 'Hidden Chest'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Diamond Steppe Island', 'Warp Maze Cave - First Chest'),
        ).toEqual(3);

        expect(
          spheres.sphereForLocation("Bird's Peak Rock", 'Cave'),
        ).toEqual(null);
      });
    });

    describe('when small keys are guaranteed to be found', () => {
      beforeEach(() => {
        fullSetup();

        updateForItemAndLocation('Deku Leaf', 'Dragon Roost Cavern', 'Alcove With Water Jugs');
        updateForItemAndLocation('Grappling Hook', 'Dragon Roost Cavern', 'Boarded Up Chest');
      });

      test('assumes the highest possible sphere for each location', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boarded Up Chest'),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Chest Across Lava Pit'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Rat Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', "Bird's Nest"),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Dark Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Gohma Heart Container'),
        ).toEqual(1);
      });
    });

    describe('when small keys are found', () => {
      beforeEach(() => {
        fullSetup();

        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'First Room');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Alcove With Water Jugs');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Boarded Up Chest');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', "Bird's Nest");
        updateForItemAndLocation('Deku Leaf', 'Dragon Roost Cavern', 'Pot Room Chest');
        updateForItemAndLocation('Grappling Hook', 'Dragon Roost Cavern', 'Mini-Boss');
      });

      test('includes locations behind small keys in the same sphere', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boarded Up Chest'),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Chest Across Lava Pit'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Rat Room'),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', "Bird's Nest"),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Dark Room'),
        ).toEqual(0);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Gohma Heart Container'),
        ).toEqual(1);
      });
    });

    describe('when charts are randomized', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_CHARTS]: true,
          },
        });

        updateForItemAndLocation('Treasure Chart 30', 'Mother and Child Isles', 'Inside Mother Isle');
        updateForItemAndLocation('Grappling Hook', 'Windfall Island', 'Tott - Teach Rhythm');
      });

      test('tracks spheres for charts correctly before mapping', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Pawprint Isle', 'Sunken Treasure'),
        ).toEqual(null);

        expect(
          spheres.sphereForLocation('Dragon Roost Island', 'Sunken Treasure'),
        ).toEqual(null);
      });

      test('tracks spheres for charts correctly after mapping', () => {
        trackerState = trackerState.setChartMapping('Treasure Chart 30', 'Star Island');

        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Star Island', 'Sunken Treasure'),
        ).toEqual(1);
      });
    });

    describe('when entrances are randomized', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
          },
        });

        updateForItemAndLocation('Power Bracelets', 'Windfall Island', 'Tott - Teach Rhythm');

        trackerState = trackerState
          .setEntranceForExit('Pawprint Isle Chuchu Cave', 'Bomb Island Secret Cave')
          .setEntranceForExit('Dragon Roost Cavern', 'Savage Labyrinth');
      });

      test('sets spheres correctly through the entrances', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Pawprint Isle', 'Chuchu Cave - Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Pawprint Isle', 'Chuchu Cave - Scale the Wall'),
        ).toEqual(null);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'First Room'),
        ).toEqual(null);
      });
    });

    describe('when small keys are behind a random entrance', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
          },
        });

        updateForItemAndLocation('Power Bracelets', 'Windfall Island', 'Tott - Teach Rhythm');

        trackerState = trackerState.setEntranceForExit('Dragon Roost Cavern', 'Bomb Island Secret Cave');

        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'First Room');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Alcove With Water Jugs');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Boarded Up Chest');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', "Bird's Nest");
        updateForItemAndLocation('Deku Leaf', 'Dragon Roost Cavern', 'Pot Room Chest');
        updateForItemAndLocation('Grappling Hook', 'Dragon Roost Cavern', 'Mini-Boss');
      });

      test('includes locations behind small keys in the same sphere behind the random entrance', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boarded Up Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Chest Across Lava Pit'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Rat Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', "Bird's Nest"),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Dark Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Gohma Heart Container'),
        ).toEqual(2);
      });
    });
  });
});
