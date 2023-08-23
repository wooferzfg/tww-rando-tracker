import _ from 'lodash';

import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';
import TEST_MACROS from '../data/test-macros.json';

import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Permalink from './permalink';
import Settings from './settings';
import TrackerState from './tracker-state';

describe('LogicCalculation', () => {
  let logic;

  const setLocations = (locationsList) => {
    Locations.locations = locationsList;
    LogicHelper.reset();
  };

  const setMacros = (macrosList) => {
    Macros.macros = macrosList;
    LogicHelper.reset();
  };

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

    logic = new LogicCalculation(TrackerState.default());
  };

  beforeEach(() => {
    Locations.reset();
    LogicHelper.reset();
    Macros.reset();
    Settings.reset();

    Settings.initializeRaw({
      options: {
        // don't run the guaranteed keys logic unless the test needs it
        [Permalink.OPTIONS.KEYLUNACY]: true,
      },
    });

    logic = new LogicCalculation(TrackerState.default());
  });

  describe('constructor', () => {
    beforeEach(() => {
      fullSetup();
    });

    describe('setting guaranteed keys', () => {
      let state;

      describe('when doing key lunacy', () => {
        beforeEach(() => {
          Settings.initializeRaw({
            options: {
              [Permalink.OPTIONS.KEYLUNACY]: true,
            },
          });

          state = TrackerState.default();
        });

        test('sets no guaranteed keys', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 0,
            'DRC Big Key': 0,
            'FW Small Key': 0,
            'FW Big Key': 0,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });
      });

      describe('when only having the default items', () => {
        beforeEach(() => {
          state = TrackerState.default();
        });

        test('sets the guaranteed keys', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 1,
            'DRC Big Key': 0,
            'FW Small Key': 0,
            'FW Big Key': 0,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });

        test('shows the unlocked locations as available', () => {
          logic = new LogicCalculation(state);

          const isLocationAvailable = logic.isLocationAvailable('Dragon Roost Cavern', 'Boarded Up Chest');

          expect(isLocationAvailable).toEqual(true);
        });
      });

      describe('when setting the DRC Big Key Chest as checked', () => {
        beforeEach(() => {
          state = TrackerState.default()
            .toggleLocationChecked('Dragon Roost Cavern', 'Big Key Chest');
        });

        test('guarantees 2 small keys in DRC', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 2,
            'DRC Big Key': 0,
            'FW Small Key': 0,
            'FW Big Key': 0,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });
      });

      describe('when only having the Grappling Hook', () => {
        beforeEach(() => {
          state = TrackerState.default().incrementItem('Grappling Hook');
        });

        test('does not guarantee additional keys in DRC', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 1,
            'DRC Big Key': 0,
            'FW Small Key': 0,
            'FW Big Key': 0,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });
      });

      describe('when having the required items for DRC', () => {
        beforeEach(() => {
          state = TrackerState.default()
            .incrementItem('Grappling Hook')
            .incrementItem('Deku Leaf');
        });

        test('guarantees all the keys for DRC', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 4,
            'DRC Big Key': 1,
            'FW Small Key': 0,
            'FW Big Key': 0,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });
      });

      describe('when having 2 DRC small keys', () => {
        beforeEach(() => {
          state = TrackerState.default()
            .incrementItem('DRC Small Key')
            .incrementItem('DRC Small Key');
        });

        test('does not guarantee any additional keys in DRC', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 2,
            'DRC Big Key': 0,
            'FW Small Key': 0,
            'FW Big Key': 0,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });
      });

      describe('when having the required items for DRC and FW', () => {
        beforeEach(() => {
          state = TrackerState.default()
            .incrementItem('Boomerang')
            .incrementItem('Grappling Hook')
            .incrementItem('Deku Leaf');
        });

        test('guarantees all the keys for DRC and FW', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 4,
            'DRC Big Key': 1,
            'FW Small Key': 1,
            'FW Big Key': 1,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });
      });

      describe('when checking or unlocking all potential key locations in FW', () => {
        beforeEach(() => {
          state = TrackerState.default()
            .incrementItem('Grappling Hook')
            .incrementItem('Deku Leaf')
            .incrementItem('Hookshot')
            .toggleLocationChecked('Forbidden Woods', 'Chest Across Red Hanging Flower')
            .toggleLocationChecked('Forbidden Woods', 'Chest in Locked Tree Trunk')
            .toggleLocationChecked('Forbidden Woods', 'Big Key Chest');
        });

        test('guarantees all the keys in FW', () => {
          logic = new LogicCalculation(state);

          expect(logic.guaranteedKeys).toEqual({
            'DRC Small Key': 4,
            'DRC Big Key': 1,
            'FW Small Key': 1,
            'FW Big Key': 1,
            'TotG Small Key': 0,
            'TotG Big Key': 0,
            'ET Small Key': 0,
            'ET Big Key': 0,
            'WT Small Key': 0,
            'WT Big Key': 0,
          });
        });
      });
    });
  });

  describe('formattedRequirementsForLocation', () => {
    describe('when the location requirements are a single "or" expression', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Empty Bottle | Grappling Hook',
            },
          },
        });
      });

      test('returns the formatted requirements', () => {
        const formattedRequirements = logic.formattedRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(formattedRequirements).toEqual([
          [
            { text: 'Empty Bottle', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.UNAVAILABLE_ITEM },
            { text: ' or ', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: 'Grappling Hook', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.UNAVAILABLE_ITEM },
          ],
        ]);
      });
    });

    describe('when the location requirements include a progressive item', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Progressive Sword x2',
            },
          },
        });
      });

      test('uses the pretty name for the item', () => {
        const formattedRequirements = logic.formattedRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(formattedRequirements).toEqual([
          [{ text: 'Master Sword', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.UNAVAILABLE_ITEM }],
        ]);
      });
    });

    describe('when the location requirements include a has accessed other location requirement', () => {
      beforeEach(() => {
        setLocations({
          'Forsaken Fortress': {
            'Helmaroc King Heart Container': {
              need: 'Grappling Hook & Deku Leaf',
            },
          },
          Mailbox: {
            'Letter from Aryll': {
              need: 'Has Accessed Other Location "Forsaken Fortress - Helmaroc King Heart Container"',
            },
          },
        });
      });

      test('uses only the name of the location', () => {
        const formattedRequirements = logic.formattedRequirementsForLocation('Mailbox', 'Letter from Aryll');

        expect(formattedRequirements).toEqual([
          [{ text: 'Forsaken Fortress - Helmaroc King Heart Container', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.UNAVAILABLE_ITEM }],
        ]);
      });
    });

    describe('when the location requirements are partially met', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: '(Empty Bottle | Grappling Hook) & Deku Leaf',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state.incrementItem('Grappling Hook'),
        );
      });

      test('returns the formatted requirements', () => {
        const formattedRequirements = logic.formattedRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(formattedRequirements).toEqual([
          [
            { text: 'Deku Leaf', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.UNAVAILABLE_ITEM },
          ],
          [
            { text: 'Grappling Hook', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.AVAILABLE_ITEM },
            { text: ' or ', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: 'Empty Bottle', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.INCONSEQUENTIAL_ITEM },
          ],
        ]);
      });
    });

    describe('when the location requirements are a complex expression that requires parentheses', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf | (Grappling Hook & (Bombs | Boomerang))',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state
            .incrementItem('Deku Leaf')
            .incrementItem('Boomerang'),
        );
      });

      test('returns the formatted requirements', () => {
        const formattedRequirements = logic.formattedRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(formattedRequirements).toEqual([
          [
            { text: 'Deku Leaf', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.AVAILABLE_ITEM },
            { text: ' or ', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: '(', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: 'Grappling Hook', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.INCONSEQUENTIAL_ITEM },
            { text: ' and ', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: '(', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: 'Boomerang', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.AVAILABLE_ITEM },
            { text: ' or ', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: 'Bombs', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.INCONSEQUENTIAL_ITEM },
            { text: ')', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: ')', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
          ],
        ]);
      });
    });
  });

  describe('formattedRequirementsForEntrance', () => {
    beforeEach(() => {
      setMacros({
        'Can Access Dungeon Entrance On Headstone Island': 'Power Bracelets',
      });

      logic = new LogicCalculation(
        logic.state.incrementItem('Power Bracelets'),
      );
    });

    test('returns the formatted requirements', () => {
      const formattedRequirements = logic.formattedRequirementsForEntrance('Earth Temple');

      expect(formattedRequirements).toEqual([
        [{ text: 'Power Bracelets', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.AVAILABLE_ITEM }],
      ]);
    });
  });

  describe('locationCounts', () => {
    beforeEach(() => {
      fullSetup();
    });

    test('returns the correct counts for Dragon Roost Cavern', () => {
      const locationCounts = logic.locationCounts('Dragon Roost Cavern', {
        isDungeon: true,
        onlyProgressLocations: true,
        disableLogic: false,
      });

      expect(locationCounts).toEqual({
        numAvailable: 3,
        numRemaining: 15,
        color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
      });
    });

    test('returns the correct counts for Forbidden Woods', () => {
      const locationCounts = logic.locationCounts('Forbidden Woods', {
        isDungeon: true,
        onlyProgressLocations: true,
        disableLogic: false,
      });

      expect(locationCounts).toEqual({
        numAvailable: 0,
        numRemaining: 15,
        color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
      });
    });

    test('returns the correct counts for Windfall Island', () => {
      const locationCounts = logic.locationCounts('Windfall Island', {
        isDungeon: false,
        onlyProgressLocations: true,
        disableLogic: false,
      });

      expect(locationCounts).toEqual({
        numAvailable: 5,
        numRemaining: 5,
        color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
      });
    });

    test('returns the correct counts for the Forsaken Fortress dungeon', () => {
      const locationCounts = logic.locationCounts('Forsaken Fortress', {
        isDungeon: true,
        onlyProgressLocations: true,
        disableLogic: false,
      });

      expect(locationCounts).toEqual({
        numAvailable: 0,
        numRemaining: 6,
        color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
      });
    });

    test('returns the correct counts for The Great Sea', () => {
      const locationCounts = logic.locationCounts('The Great Sea', {
        isDungeon: false,
        onlyProgressLocations: true,
        disableLogic: false,
      });

      expect(locationCounts).toEqual({
        numAvailable: 2,
        numRemaining: 4,
        color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
      });
    });

    describe('when showing non-progress locations', () => {
      test('returns the correct counts for the Forsaken Fortress island', () => {
        const locationCounts = logic.locationCounts('Forsaken Fortress', {
          isDungeon: false,
          onlyProgressLocations: false,
          disableLogic: false,
        });

        expect(locationCounts).toEqual({
          numAvailable: 0,
          numRemaining: 1,
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        });
      });

      test('returns the correct counts for Rock Spire Isle', () => {
        const locationCounts = logic.locationCounts('Rock Spire Isle', {
          isDungeon: false,
          onlyProgressLocations: false,
          disableLogic: false,
        });

        expect(locationCounts).toEqual({
          numAvailable: 1,
          numRemaining: 9,
          color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
        });
      });

      test('returns the correct counts for Windfall Island', () => {
        const locationCounts = logic.locationCounts('Windfall Island', {
          isDungeon: false,
          onlyProgressLocations: false,
          disableLogic: false,
        });

        expect(locationCounts).toEqual({
          numAvailable: 17,
          numRemaining: 38,
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        });
      });
    });

    describe('when locations are checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .toggleLocationChecked('Dragon Roost Cavern', 'First Room')
            .toggleLocationChecked('Dragon Roost Cavern', 'Rat Room')
            .toggleLocationChecked('Mother and Child Isles', 'Inside Mother Isle'),
        );
      });

      test('returns the correct counts for Dragon Roost Cavern', () => {
        const locationCounts = logic.locationCounts('Dragon Roost Cavern', {
          isDungeon: true,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationCounts).toEqual({
          numAvailable: 2,
          numRemaining: 13,
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        });
      });

      test('returns the correct counts for Mother and Child Isles', () => {
        const locationCounts = logic.locationCounts('Mother and Child Isles', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationCounts).toEqual({
          numAvailable: 0,
          numRemaining: 0,
          color: LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION,
        });
      });
    });

    describe('when more locations are available', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .incrementItem('Grappling Hook')
            .incrementItem('Deku Leaf'),
        );
      });

      test('returns the correct counts for Dragon Roost Cavern', () => {
        const locationCounts = logic.locationCounts('Dragon Roost Cavern', {
          isDungeon: true,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationCounts).toEqual({
          numAvailable: 15,
          numRemaining: 15,
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        });
      });

      test('returns the correct counts for Forbidden Woods', () => {
        const locationCounts = logic.locationCounts('Forbidden Woods', {
          isDungeon: true,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationCounts).toEqual({
          numAvailable: 7,
          numRemaining: 15,
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        });
      });
    });

    describe('when location logic is disabled', () => {
      test('returns the correct count for Outset Island', () => {
        const locationCounts = logic.locationCounts('Outset Island', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: true,
        });

        expect(locationCounts).toEqual({
          numAvailable: 3,
          numRemaining: 3,
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        });
      });

      test('returns the correct count for Islet of Steel', () => {
        const locationCounts = logic.locationCounts('Islet of Steel', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: true,
        });

        expect(locationCounts).toEqual({
          numAvailable: 1,
          numRemaining: 1,
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        });
      });

      test('returns the correct count for Greatfish Isle', () => {
        const locationCounts = logic.locationCounts('Greatfish Isle', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: true,
        });

        expect(locationCounts).toEqual({
          numAvailable: 0,
          numRemaining: 0,
          color: LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION,
        });
      });

      describe('when showing non-progress locations', () => {
        test('returns the correct count for Spectacle Island', () => {
          const locationCounts = logic.locationCounts('Spectacle Island', {
            isDungeon: false,
            onlyProgressLocations: false,
            disableLogic: true,
          });

          expect(locationCounts).toEqual({
            numAvailable: 3,
            numRemaining: 3,
            color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
          });
        });

        test('returns the correct count for Windfall Island', () => {
          const locationCounts = logic.locationCounts('Windfall Island', {
            isDungeon: false,
            onlyProgressLocations: false,
            disableLogic: true,
          });

          expect(locationCounts).toEqual({
            numAvailable: 38,
            numRemaining: 38,
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          });
        });
      });

      describe('when locations are checked', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state
              .toggleLocationChecked('Dragon Roost Cavern', 'First Room')
              .toggleLocationChecked('Dragon Roost Cavern', 'Rat Room'),
          );
        });

        test('returns the correct count for Dragon Roost Cavern', () => {
          const locationCounts = logic.locationCounts('Dragon Roost Cavern', {
            isDungeon: true,
            onlyProgressLocations: true,
            disableLogic: true,
          });

          expect(locationCounts).toEqual({
            numAvailable: 13,
            numRemaining: 13,
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          });
        });
      });
    });
  });

  describe('locationsList', () => {
    beforeEach(() => {
      fullSetup();
    });

    test('returns the correct locations for the Forsaken Fortress dungeon', () => {
      const locationsList = logic.locationsList('Forsaken Fortress', {
        isDungeon: true,
        onlyProgressLocations: true,
        disableLogic: false,
      });

      expect(locationsList).toEqual([
        {
          location: 'Phantom Ganon',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
        {
          location: 'Chest Outside Upper Jail Cell',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
        {
          location: 'Chest Inside Lower Jail Cell',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
        {
          location: 'Chest Guarded By Bokoblin',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
        {
          location: 'Chest on Bed',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
        {
          location: 'Helmaroc King Heart Container',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
      ]);
    });

    test('returns the correct locations for The Great Sea', () => {
      const locationsList = logic.locationsList('The Great Sea', {
        isDungeon: false,
        onlyProgressLocations: true,
        disableLogic: false,
      });

      expect(locationsList).toEqual([
        {
          location: "Beedle's Shop Ship - 20 Rupee Item",
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        },
        {
          location: 'Salvage Corp Gift',
          color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
        },
        {
          location: 'Cyclos',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
        {
          location: 'Ghost Ship',
          color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
        },
      ]);
    });

    describe('when showing non-progress locations', () => {
      test('returns the correct locations for the Forsaken Fortress island', () => {
        const locationsList = logic.locationsList('Forsaken Fortress', {
          isDungeon: false,
          onlyProgressLocations: false,
          disableLogic: false,
        });

        expect(locationsList).toEqual([
          {
            location: 'Sunken Treasure',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });

      test('returns the correct locations for Rock Spire Isle', () => {
        const locationsList = logic.locationsList('Rock Spire Isle', {
          isDungeon: false,
          onlyProgressLocations: false,
          disableLogic: false,
        });

        expect(locationsList).toEqual([
          {
            location: 'Cave',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: "Beedle's Special Shop Ship - 500 Rupee Item",
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: "Beedle's Special Shop Ship - 950 Rupee Item",
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: "Beedle's Special Shop Ship - 900 Rupee Item",
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: 'Western Lookout Platform - Destroy the Cannons',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: 'Eastern Lookout Platform - Destroy the Cannons',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: 'Center Lookout Platform',
            color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
          },
          {
            location: 'Southeast Gunboat',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: 'Sunken Treasure',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });
    });

    describe('when locations are checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .toggleLocationChecked('Cliff Plateau Isles', 'Cave')
            .toggleLocationChecked('Mother and Child Isles', 'Inside Mother Isle'),
        );
      });

      test('returns the correct locations for Cliff Plateau Isles', () => {
        const locationsList = logic.locationsList('Cliff Plateau Isles', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationsList).toEqual([
          {
            location: 'Cave',
            color: LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION,
          },
          {
            location: 'Highest Isle',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });

      test('returns the correct locations for Mother and Child Isles', () => {
        const locationsList = logic.locationsList('Mother and Child Isles', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationsList).toEqual([
          {
            location: 'Inside Mother Isle',
            color: LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION,
          },
        ]);
      });
    });

    describe('when more locations are available', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .incrementItem('Bombs')
            .incrementItem('Skull Hammer'),
        );
      });

      test('returns the correct locations for Pawprint Isle', () => {
        const locationsList = logic.locationsList('Pawprint Isle', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationsList).toEqual([
          {
            location: 'Chuchu Cave - Chest',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: 'Chuchu Cave - Behind Left Boulder',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: 'Chuchu Cave - Behind Right Boulder',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: 'Chuchu Cave - Scale the Wall',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });

      test('returns the correct locations for Forsaken Fortress', () => {
        const locationsList = logic.locationsList('Forsaken Fortress', {
          isDungeon: true,
          onlyProgressLocations: true,
          disableLogic: false,
        });

        expect(locationsList).toEqual([
          {
            location: 'Phantom Ganon',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: 'Chest Outside Upper Jail Cell',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            location: 'Chest Inside Lower Jail Cell',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: 'Chest Guarded By Bokoblin',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: 'Chest on Bed',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: 'Helmaroc King Heart Container',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });
    });

    describe('when location logic is disabled', () => {
      test('returns the correct locations for Outset Island', () => {
        const locationsList = logic.locationsList('Outset Island', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: true,
        });

        expect(locationsList).toEqual([
          {
            location: "Underneath Link's House",
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: "Mesa the Grasscutter's House",
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            location: 'Great Fairy',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
        ]);
      });

      test('returns the correct locations for Islet of Steel', () => {
        const locationsList = logic.locationsList('Islet of Steel', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: true,
        });

        expect(locationsList).toEqual([
          {
            location: 'Interior',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
        ]);
      });

      test('returns the correct locations for Greatfish Isle', () => {
        const locationsList = logic.locationsList('Greatfish Isle', {
          isDungeon: false,
          onlyProgressLocations: true,
          disableLogic: true,
        });

        expect(locationsList).toEqual([]);
      });

      describe('when showing non-progress locations', () => {
        test('returns the correct locations for Spectacle Island', () => {
          const locationsList = logic.locationsList('Spectacle Island', {
            isDungeon: false,
            onlyProgressLocations: false,
            disableLogic: true,
          });

          expect(locationsList).toEqual([
            {
              location: 'Barrel Shooting - First Prize',
              color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
            },
            {
              location: 'Barrel Shooting - Second Prize',
              color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
            },
            {
              location: 'Sunken Treasure',
              color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
            },
          ]);
        });

        test('returns the correct locations for Bomb Island', () => {
          const locationsList = logic.locationsList('Bomb Island', {
            isDungeon: false,
            onlyProgressLocations: false,
            disableLogic: true,
          });

          expect(locationsList).toEqual([
            {
              location: 'Cave',
              color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
            },
            {
              location: 'Lookout Platform - Defeat the Enemies',
              color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
            },
            {
              location: 'Submarine',
              color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
            },
            {
              location: 'Sunken Treasure',
              color: LogicCalculation.LOCATION_COLORS.NON_PROGRESS_LOCATION,
            },
          ]);
        });
      });

      describe('when locations are checked', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.toggleLocationChecked("Ganon's Tower", 'Defeat Ganondorf'),
          );
        });

        test("returns the correct locations for Ganon's Tower", () => {
          const locationsList = logic.locationsList("Ganon's Tower", {
            isDungeon: true,
            onlyProgressLocations: true,
            disableLogic: true,
          });

          expect(locationsList).toEqual([
            {
              location: 'Maze Chest',
              color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
            },
            {
              location: 'Defeat Ganondorf',
              color: LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION,
            },
          ]);
        });
      });
    });
  });

  describe('entrancesList', () => {
    describe('when entrances are not randomized', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
          },
        });
      });

      test('returns an empty array', () => {
        const entrancesList = logic.entrancesList({ disableLogic: false });

        expect(entrancesList).toEqual([]);
      });
    });

    describe('when entrances are randomized', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
          },
        });
      });

      test('returns the list of entrances', () => {
        const entrancesList = logic.entrancesList({ disableLogic: false });

        expect(entrancesList).toEqual([
          {
            entrance: 'Dragon Roost Cavern',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            entrance: 'Forbidden Woods',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Tower of the Gods',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Earth Temple',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Wind Temple',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });
    });

    describe('when logic is disabled', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
          },
        });
      });

      test('returns the list of entrances as all available', () => {
        const entrancesList = logic.entrancesList({ disableLogic: true });

        expect(entrancesList).toEqual([
          {
            entrance: 'Dragon Roost Cavern',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            entrance: 'Forbidden Woods',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            entrance: 'Tower of the Gods',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            entrance: 'Earth Temple',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            entrance: 'Wind Temple',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
        ]);
      });
    });

    describe('when an entrance is checked', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
          },
        });

        logic = new LogicCalculation(
          logic.state
            .setEntranceForExit('Dragon Roost Cavern', 'Forbidden Woods')
            .incrementItem('Entered DRC'),
        );
      });

      test('returns the list of entrances with FW checked', () => {
        const entrancesList = logic.entrancesList({ disableLogic: false });

        expect(entrancesList).toEqual([
          {
            entrance: 'Dragon Roost Cavern',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            entrance: 'Forbidden Woods',
            color: LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION,
          },
          {
            entrance: 'Tower of the Gods',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Earth Temple',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Wind Temple',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });
    });
  });

  describe('entrancesListForExit', () => {
    describe('when all entrances are randomized separately', () => {
      beforeEach(() => {
        fullSetup({
          options: {
            [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]:
              Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
          },
        });
      });

      test('returns only the dungeon entrances', () => {
        const entrancesListForExit = logic.entrancesListForExit(
          'Tower of the Gods',
          { disableLogic: false },
        );

        expect(entrancesListForExit).toEqual([
          {
            entrance: 'Dragon Roost Cavern',
            color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
          },
          {
            entrance: 'Forbidden Woods',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Tower of the Gods',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Earth Temple',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
          {
            entrance: 'Wind Temple',
            color: LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION,
          },
        ]);
      });
    });
  });

  describe('totalLocationsChecked', () => {
    beforeEach(() => {
      fullSetup();
    });

    describe('when no locations are checked', () => {
      test('returns 0', () => {
        const totalLocationsChecked = logic.totalLocationsChecked(
          { onlyProgressLocations: true },
        );

        expect(totalLocationsChecked).toEqual(0);
      });
    });

    describe('when some locations are checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .toggleLocationChecked('Dragon Roost Cavern', 'First Room')
            .toggleLocationChecked('Mother and Child Isles', 'Inside Mother Isle')
            .toggleLocationChecked('Windfall Island', 'Transparent Chest'),
        );
      });

      test('returns the number of checked progress locations', () => {
        const totalLocationsChecked = logic.totalLocationsChecked(
          { onlyProgressLocations: true },
        );

        expect(totalLocationsChecked).toEqual(2);
      });
    });

    describe('when showing non-progress locations', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .toggleLocationChecked('Dragon Roost Cavern', 'First Room')
            .toggleLocationChecked('Mother and Child Isles', 'Inside Mother Isle')
            .toggleLocationChecked('Windfall Island', 'Transparent Chest'),
        );
      });

      test('returns the number of checked locations', () => {
        const totalLocationsChecked = logic.totalLocationsChecked(
          { onlyProgressLocations: false },
        );

        expect(totalLocationsChecked).toEqual(3);
      });
    });

    describe('when Defeat Ganondorf is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .toggleLocationChecked('Dragon Roost Cavern', 'First Room')
            .toggleLocationChecked("Ganon's Tower", 'Defeat Ganondorf'),
        );
      });

      test('excludes the Defeat Ganondorf location from the total', () => {
        const totalLocationsChecked = logic.totalLocationsChecked(
          { onlyProgressLocations: true },
        );

        expect(totalLocationsChecked).toEqual(1);
      });
    });
  });

  describe('totalLocationsAvailable', () => {
    beforeEach(() => {
      fullSetup();
    });

    describe('when only showing progress locations', () => {
      test('returns the correct total', () => {
        const totalLocationsAvailable = logic.totalLocationsAvailable({
          onlyProgressLocations: true,
        });

        expect(totalLocationsAvailable).toEqual(18);
      });
    });

    describe('when showing non-progress locations', () => {
      test('returns the correct total', () => {
        const totalLocationsAvailable = logic.totalLocationsAvailable({
          onlyProgressLocations: false,
        });

        expect(totalLocationsAvailable).toEqual(59);
      });
    });

    describe('when a location is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state.toggleLocationChecked('Dragon Roost Cavern', 'First Room'),
        );
      });

      test('excludes the location from the total', () => {
        const totalLocationsAvailable = logic.totalLocationsAvailable({
          onlyProgressLocations: true,
        });

        expect(totalLocationsAvailable).toEqual(17);
      });
    });

    describe('when Defeat Ganondorf is available', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard') // Triforce Shard x8
            .incrementItem('Progressive Sword')
            .incrementItem('Progressive Sword')
            .incrementItem('Progressive Sword') // Progressive Sword x4
            .incrementItem('Progressive Bow')
            .incrementItem('Progressive Bow')
            .incrementItem('Progressive Bow') // Progressive Bow x3
            .incrementItem('Boomerang')
            .incrementItem('Grappling Hook')
            .incrementItem('Hookshot'),
        );
      });

      test('excludes the Defeat Ganondorf location from the total', () => {
        const totalLocationsAvailable = logic.totalLocationsAvailable({
          onlyProgressLocations: true,
        });

        expect(totalLocationsAvailable).toEqual(40);
      });
    });
  });

  describe('totalLocationsRemaining', () => {
    beforeEach(() => {
      fullSetup();
    });

    describe('when only showing progress locations', () => {
      test('returns the correct total', () => {
        const totalLocationsRemaining = logic.totalLocationsRemaining({
          onlyProgressLocations: true,
        });

        expect(totalLocationsRemaining).toEqual(120);
      });
    });

    describe('when showing non-progress locations', () => {
      test('returns the correct total', () => {
        const totalLocationsRemaining = logic.totalLocationsRemaining({
          onlyProgressLocations: false,
        });

        expect(totalLocationsRemaining).toEqual(305);
      });
    });

    describe('when a location is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state.toggleLocationChecked('Dragon Roost Cavern', 'First Room'),
        );
      });

      test('excludes the location from the total', () => {
        const totalLocationsRemaining = logic.totalLocationsRemaining({
          onlyProgressLocations: true,
        });

        expect(totalLocationsRemaining).toEqual(119);
      });
    });
  });

  describe('itemsNeededToFinishGame', () => {
    beforeEach(() => {
      fullSetup();
    });

    test('returns the correct total', () => {
      const itemsNeededToFinishGame = logic.itemsNeededToFinishGame();

      expect(itemsNeededToFinishGame).toEqual(17);
    });

    describe('when some required items are obtained', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .incrementItem('Deku Leaf') // not required to finish game
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard') // Triforce Shard x4
            .incrementItem('Progressive Sword') // Progressive Sword x2
            .incrementItem('Progressive Bow'),
        );
      });

      test('returns the correct total', () => {
        const itemsNeededToFinishGame = logic.itemsNeededToFinishGame();

        expect(itemsNeededToFinishGame).toEqual(11);
      });
    });

    describe('when Defeat Ganondorf is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state.toggleLocationChecked("Ganon's Tower", 'Defeat Ganondorf'),
        );
      });

      test('returns 0', () => {
        const itemsNeededToFinishGame = logic.itemsNeededToFinishGame();

        expect(itemsNeededToFinishGame).toEqual(0);
      });
    });

    describe('when all required items are obtained', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard') // Triforce Shard x8
            .incrementItem('Progressive Sword')
            .incrementItem('Progressive Sword')
            .incrementItem('Progressive Sword') // Progressive Sword x4
            .incrementItem('Progressive Bow')
            .incrementItem('Progressive Bow')
            .incrementItem('Progressive Bow') // Progressive Bow x3
            .incrementItem('Boomerang')
            .incrementItem('Grappling Hook')
            .incrementItem('Hookshot'),
        );
      });

      test('returns 0', () => {
        const itemsNeededToFinishGame = logic.itemsNeededToFinishGame();

        expect(itemsNeededToFinishGame).toEqual(0);
      });
    });
  });

  describe('estimatedLocationsLeftToCheck', () => {
    beforeEach(() => {
      fullSetup();
    });

    test('returns the correct total', () => {
      const estimatedLocationsLeftToCheck = logic.estimatedLocationsLeftToCheck();

      expect(estimatedLocationsLeftToCheck).toEqual(114);
    });

    describe('when some locations are checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .toggleLocationChecked('Dragon Roost Cavern', 'First Room')
            .toggleLocationChecked('Mother and Child Isles', 'Inside Mother Isle'),
        );
      });

      test('returns the correct total', () => {
        const estimatedLocationsLeftToCheck = logic.estimatedLocationsLeftToCheck();

        expect(estimatedLocationsLeftToCheck).toEqual(112);
      });
    });

    describe('when some required items are obtained', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .incrementItem('Deku Leaf') // not required to finish game
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard') // Triforce Shard x4
            .incrementItem('Progressive Sword') // Progressive Sword x2
            .incrementItem('Progressive Bow'),
        );
      });

      test('returns the correct total', () => {
        const estimatedLocationsLeftToCheck = logic.estimatedLocationsLeftToCheck();

        expect(estimatedLocationsLeftToCheck).toEqual(111);
      });
    });

    describe('when all required items are obtained', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard')
            .incrementItem('Triforce Shard') // Triforce Shard x8
            .incrementItem('Progressive Sword')
            .incrementItem('Progressive Sword')
            .incrementItem('Progressive Sword') // Progressive Sword x4
            .incrementItem('Progressive Bow')
            .incrementItem('Progressive Bow')
            .incrementItem('Progressive Bow') // Progressive Bow x3
            .incrementItem('Boomerang')
            .incrementItem('Grappling Hook')
            .incrementItem('Hookshot'),
        );
      });

      test('returns 0', () => {
        const estimatedLocationsLeftToCheck = logic.estimatedLocationsLeftToCheck();

        expect(estimatedLocationsLeftToCheck).toEqual(0);
      });
    });

    describe('when Defeat Ganondorf is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state.toggleLocationChecked("Ganon's Tower", 'Defeat Ganondorf'),
        );
      });

      test('returns 0', () => {
        const estimatedLocationsLeftToCheck = logic.estimatedLocationsLeftToCheck();

        expect(estimatedLocationsLeftToCheck).toEqual(0);
      });
    });

    describe('when all locations are checked', () => {
      beforeEach(() => {
        let { state } = logic;

        _.forEach(Locations.locations, (detailedLocations, generalLocation) => {
          _.forEach(detailedLocations, (locationData, detailedLocation) => {
            if (detailedLocation !== 'Defeat Ganondorf') {
              state = state.toggleLocationChecked(generalLocation, detailedLocation);
            }
          });
        });

        logic = new LogicCalculation(state);
      });

      test('returns 0', () => {
        const estimatedLocationsLeftToCheck = logic.estimatedLocationsLeftToCheck();

        expect(estimatedLocationsLeftToCheck).toEqual(0);
      });
    });
  });

  describe('isBossDefeated', () => {
    beforeEach(() => {
      setLocations({
        'Dragon Roost Cavern': {
          'Gohma Heart Container': {
            need: 'DRC Big Key',
            originalItem: 'Heart Container',
          },
        },
      });
    });

    describe('when the boss location is not checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(TrackerState.default());
      });

      test('returns false', () => {
        const isBossDefeated = logic.isBossDefeated('Dragon Roost Cavern');

        expect(isBossDefeated).toEqual(false);
      });
    });

    describe('when the boss location is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          TrackerState.default()
            .toggleLocationChecked('Dragon Roost Cavern', 'Gohma Heart Container'),
        );
      });

      test('returns true', () => {
        const isBossDefeated = logic.isBossDefeated('Dragon Roost Cavern');

        expect(isBossDefeated).toEqual(true);
      });
    });
  });

  describe('isLocationAvailable', () => {
    describe('when the location is checked', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf & Grappling Hook',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state.toggleLocationChecked('Outset Island', 'Savage Labyrinth - Floor 30'),
        );
      });

      test('returns true', () => {
        const isLocationAvailable = logic.isLocationAvailable('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(true);
      });
    });

    describe('when the location requirements are met', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf & Grappling Hook',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state
            .incrementItem('Grappling Hook')
            .incrementItem('Deku Leaf'),
        );
      });

      test('returns true', () => {
        const isLocationAvailable = logic.isLocationAvailable('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(true);
      });
    });

    describe('when the location requirements are not met', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf & Grappling Hook',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state
            .incrementItem('Deku Leaf'),
        );
      });

      test('returns false', () => {
        const isLocationAvailable = logic.isLocationAvailable('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(false);
      });
    });
  });

  describe('isEntranceAvailable', () => {
    describe('when the entrance requirements are met', () => {
      beforeEach(() => {
        setMacros({
          'Can Access Dungeon Entrance On Headstone Island': 'Power Bracelets',
        });

        logic = new LogicCalculation(
          logic.state.incrementItem('Power Bracelets'),
        );
      });

      test('returns true', () => {
        const isEntranceAvailable = logic.isEntranceAvailable('Earth Temple');

        expect(isEntranceAvailable).toEqual(true);
      });
    });

    describe('when the location requirements are not met', () => {
      beforeEach(() => {
        setMacros({
          'Can Access Secret Cave Entrance on Diamond Steppe Island': 'Hookshot',
        });
      });

      test('returns false', () => {
        const isEntranceAvailable = logic.isEntranceAvailable('Diamond Steppe Island Warp Maze Cave');

        expect(isEntranceAvailable).toEqual(false);
      });
    });
  });

  describe('_isRequirementMet', () => {
    describe('when the requirement is nothing', () => {
      test('returns true', () => {
        const isItemAvailable = logic._isRequirementMet('Nothing');

        expect(isItemAvailable).toEqual(true);
      });
    });

    describe('when the requirement is nothing', () => {
      test('returns false', () => {
        const isItemAvailable = logic._isRequirementMet('Impossible');

        expect(isItemAvailable).toEqual(false);
      });
    });

    describe('when the requirement is a normal item', () => {
      describe('when the item is available', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.incrementItem('Deku Leaf'),
          );
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet('Deku Leaf');

          expect(isItemAvailable).toEqual(true);
        });
      });

      describe('when the item is not available', () => {
        test('returns false', () => {
          const isItemAvailable = logic._isRequirementMet('Deku Leaf');

          expect(isItemAvailable).toEqual(false);
        });
      });
    });

    describe('when the requirement is a progressive item', () => {
      describe('when the item count meets the requirement', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state
              .incrementItem('Progressive Sword')
              .incrementItem('Progressive Sword')
              .incrementItem('Progressive Sword'),
          );
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet('Progressive Sword x3');

          expect(isItemAvailable).toEqual(true);
        });
      });

      describe('when the item count does not meet the requirement', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state
              .incrementItem('Triforce Shard')
              .incrementItem('Triforce Shard')
              .incrementItem('Triforce Shard')
              .incrementItem('Triforce Shard'),
          );
        });

        test('returns false', () => {
          const isItemAvailable = logic._isRequirementMet('Triforce Shard x5');

          expect(isItemAvailable).toEqual(false);
        });
      });
    });

    describe('when the requirement is a small key', () => {
      describe('when the key count meets the requirement', () => {
        beforeEach(() => {
          _.set(logic.guaranteedKeys, 'DRC Small Key', 2);
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet('DRC Small Key x2');

          expect(isItemAvailable).toEqual(true);
        });
      });

      describe('when the key count does not meet the requirement', () => {
        beforeEach(() => {
          _.set(logic.guaranteedKeys, 'DRC Small Key', 1);
        });

        test('returns false', () => {
          const isItemAvailable = logic._isRequirementMet('DRC Small Key x2');

          expect(isItemAvailable).toEqual(false);
        });
      });
    });

    describe('when the requirement is having accessed another location', () => {
      beforeEach(() => {
        setLocations({
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Grappling Hook | Bombs',
            },
          },
        });
      });

      describe('when the other location has not been checked', () => {
        test('returns false', () => {
          const isItemAvailable = logic._isRequirementMet(
            'Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 30"',
          );

          expect(isItemAvailable).toEqual(false);
        });
      });

      describe('when the other location has been checked', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.toggleLocationChecked('Outset Island', 'Savage Labyrinth - Floor 30'),
          );
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet(
            'Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 30"',
          );

          expect(isItemAvailable).toEqual(true);
        });
      });

      describe('when the requirements for the other location have been met', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.incrementItem('Grappling Hook'),
          );
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet(
            'Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 30"',
          );

          expect(isItemAvailable).toEqual(true);
        });
      });
    });
  });
});
