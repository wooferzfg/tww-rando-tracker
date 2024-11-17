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
          [Permalink.OPTIONS.REQUIRED_BOSSES]: false,
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: false,
          [Permalink.OPTIONS.MIX_ENTRANCES]: (
            Permalink.MIX_ENTRANCES_OPTIONS.SEPARATE_DUNGEONS_FROM_CAVES_AND_FOUNTAINS
          ),
          [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
          [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
          [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD,
          [Permalink.OPTIONS.LOGIC_OBSCURITY]: Permalink.LOGIC_DIFFICULTY_OPTIONS.NONE,
          [Permalink.OPTIONS.LOGIC_PRECISION]: Permalink.LOGIC_DIFFICULTY_OPTIONS.NONE,
        },
        startingGear: {
          [LogicHelper.ITEMS.BALLAD_OF_GALES]: 1,
          [LogicHelper.ITEMS.PROGRESSIVE_MAGIC_METER]: 1,
          [LogicHelper.ITEMS.PROGRESSIVE_SHIELD]: 1,
          [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
          [LogicHelper.ITEMS.SONG_OF_PASSING]: 1,
        },
        flags: [
          Settings.FLAGS.BOSS,
          Settings.FLAGS.RANDOMIZABLE_MINIBOSS_ROOM,
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
        ).toEqual(0);

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
        updateForItemAndLocation('Grappling Hook', 'Dragon Roost Cavern', 'Miniboss');
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
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });

        updateForItemAndLocation('Power Bracelets', 'Windfall Island', 'Tott - Teach Rhythm');

        trackerState = trackerState
          .setExitForEntrance('Bomb Island Secret Cave', 'Pawprint Isle Chuchu Cave')
          .setExitForEntrance('Savage Labyrinth', 'Dragon Roost Cavern')
          .setExitForEntrance('Cliff Plateau Isles Secret Cave', LogicHelper.NOTHING_EXIT);
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
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: false,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: false,
          },
        });

        updateForItemAndLocation('Power Bracelets', 'Windfall Island', 'Tott - Teach Rhythm');

        trackerState = trackerState
          .setExitForEntrance('Bomb Island Secret Cave', 'Dragon Roost Cavern');

        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'First Room');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Alcove With Water Jugs');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Boarded Up Chest');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', "Bird's Nest");
        updateForItemAndLocation('Deku Leaf', 'Dragon Roost Cavern', 'Pot Room Chest');
        updateForItemAndLocation('Grappling Hook', 'Dragon Roost Cavern', 'Miniboss');
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

    describe('when there are nested dungeon entrances', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });

        updateForItemAndLocation('Grappling Hook', 'Windfall Island', 'Jail - Tingle - First Gift');
        updateForItemAndLocation('Deku Leaf', 'Windfall Island', 'Jail - Tingle - Second Gift');
        updateForItemAndLocation('Bombs', 'Windfall Island', 'Mila - Follow the Thief');
        updateForItemAndLocation('Progressive Bow', 'Windfall Island', 'Maggie - Free Item');
        updateForItemAndLocation('Boomerang', 'Windfall Island', 'Tott - Teach Rhythm');
        updateForItemAndLocation('Command Melody', 'Windfall Island', 'House of Wealth Chest');

        trackerState = trackerState
          .setExitForEntrance('Bomb Island Secret Cave', 'Dragon Roost Cavern')
          .setExitForEntrance('Gohma Boss Arena', 'Forbidden Woods')
          .setExitForEntrance('Tower of the Gods Miniboss Arena', 'Forbidden Woods Miniboss Arena')
          .setExitForEntrance('Kalle Demos Boss Arena', 'Tower of the Gods')
          .setExitForEntrance('Forbidden Woods Miniboss Arena', 'Tower of the Gods Miniboss Arena')
          .setExitForEntrance('Gohdan Boss Arena', 'Gohdan Boss Arena');
      });

      test('includes all nested locations in the same sphere', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boarded Up Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boss Stairs Right Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Big Key Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'First Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Mothula Miniboss Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Past Seeds Hanging by Vines'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Big Key Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Tower of the Gods', 'Hop Across Floating Boxes'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Tower of the Gods', 'Skulls Room Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Tower of the Gods', 'Darknut Miniboss Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Tower of the Gods', 'Floating Platforms Room'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Tower of the Gods', 'Big Key Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Tower of the Gods', 'Gohdan Heart Container'),
        ).toEqual(1);
      });
    });

    describe('when small keys are guaranteed with nested dungeon entrances', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });

        updateForItemAndLocation('Deku Leaf', 'Windfall Island', 'Jail - Tingle - Second Gift');
        updateForItemAndLocation('Bombs', 'Windfall Island', 'Mila - Follow the Thief');
        updateForItemAndLocation('Boomerang', 'Windfall Island', 'Tott - Teach Rhythm');

        trackerState = trackerState
          .setExitForEntrance('Bomb Island Secret Cave', 'Forbidden Woods');

        updateForItemAndLocation('FW Big Key', 'Forbidden Woods', 'Double Mothula Room');

        trackerState = trackerState
          .setExitForEntrance('Kalle Demos Boss Arena', 'Dragon Roost Cavern');

        updateForItemAndLocation('Grappling Hook', 'Dragon Roost Cavern', 'Alcove With Water Jugs');

        trackerState = trackerState
          .setExitForEntrance('Gohma Boss Arena', 'Gohma Boss Arena');
      });

      test('uses the worst case scenario sphere for the nested dungeon', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Hole in Tree'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'First Room'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boarded Up Chest'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Chest Across Lava Pit'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Rat Room'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', "Bird's Nest"),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Dark Room'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Gohma Heart Container'),
        ).toEqual(3);
      });
    });

    describe('when there are nested dungeon entrances and small keys are found', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });

        updateForItemAndLocation('Deku Leaf', 'Windfall Island', 'Jail - Tingle - Second Gift');
        updateForItemAndLocation('Bombs', 'Windfall Island', 'Mila - Follow the Thief');
        updateForItemAndLocation('Boomerang', 'Windfall Island', 'Tott - Teach Rhythm');

        trackerState = trackerState
          .setExitForEntrance('Eastern Fairy Fountain', 'Forbidden Woods');

        updateForItemAndLocation('FW Big Key', 'Forbidden Woods', 'Double Mothula Room');

        trackerState = trackerState
          .setExitForEntrance('Kalle Demos Boss Arena', 'Dragon Roost Cavern');

        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'First Room');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Alcove With Water Jugs');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', 'Boarded Up Chest');
        updateForItemAndLocation('DRC Small Key', 'Dragon Roost Cavern', "Bird's Nest");
        updateForItemAndLocation('Grappling Hook', 'Dragon Roost Cavern', 'Miniboss');

        trackerState = trackerState
          .setExitForEntrance('Gohma Boss Arena', 'Gohma Boss Arena');
      });

      test('uses the worst case scenario sphere for the nested dungeon', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Hole in Tree'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'First Room'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Boarded Up Chest'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Chest Across Lava Pit'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Rat Room'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', "Bird's Nest"),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Dark Room'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Dragon Roost Cavern', 'Gohma Heart Container'),
        ).toEqual(3);
      });
    });

    describe('when there is a chain of inner caves and dungeons', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
            [Permalink.OPTIONS.MIX_ENTRANCES]: (
              Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
            ),
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES]: true,
            [Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES]: true,
          },
        });

        updateForItemAndLocation('Grappling Hook', 'Windfall Island', 'Jail - Tingle - First Gift');
        updateForItemAndLocation('Deku Leaf', 'Windfall Island', 'Jail - Tingle - Second Gift');
        updateForItemAndLocation('Bombs', 'Windfall Island', 'Mila - Follow the Thief');
        updateForItemAndLocation('Boomerang', 'Windfall Island', 'Tott - Teach Rhythm');

        trackerState = trackerState
          .setExitForEntrance('Southern Fairy Fountain', 'Cliff Plateau Isles Secret Cave');

        updateForItemAndLocation('Iron Boots', 'Cliff Plateau Isles', 'Cave');

        trackerState = trackerState
          .setExitForEntrance('Cliff Plateau Isles Inner Cave', 'Ice Ring Isle Secret Cave');

        updateForItemAndLocation('Progressive Bow', 'Ice Ring Isle', 'Cave - Chest');

        trackerState = trackerState
          .setExitForEntrance('Ice Ring Isle Inner Cave', 'Forbidden Woods')
          .setExitForEntrance('Kalle Demos Boss Arena', 'Cliff Plateau Isles Inner Cave');

        updateForItemAndLocation('Progressive Bow', 'Cliff Plateau Isles', 'Highest Isle');

        trackerState = trackerState
          .setExitForEntrance('Forbidden Woods Miniboss Arena', 'Ice Ring Isle Inner Cave');
      });

      test('includes all nested locations in the correct spheres', () => {
        const spheres = new Spheres(trackerState);

        expect(
          spheres.sphereForLocation('Cliff Plateau Isles', 'Cave'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Ice Ring Isle', 'Cave - Chest'),
        ).toEqual(1);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'First Room'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Mothula Miniboss Room'),
        ).toEqual(null);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Past Seeds Hanging by Vines'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Big Key Chest'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Forbidden Woods', 'Kalle Demos Heart Container'),
        ).toEqual(null);

        expect(
          spheres.sphereForLocation('Cliff Plateau Isles', 'Highest Isle'),
        ).toEqual(2);

        expect(
          spheres.sphereForLocation('Ice Ring Isle', 'Inner Cave - Chest'),
        ).toEqual(3);
      });
    });
  });
});
