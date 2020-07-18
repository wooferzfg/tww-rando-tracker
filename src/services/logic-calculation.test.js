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

  beforeEach(() => {
    Settings.initializeRaw({
      options: {
        // don't run the guaranteed keys logic unless the test needs it
        [Permalink.OPTIONS.KEY_LUNACY]: true,
      },
    });

    logic = new LogicCalculation(TrackerState.default());
  });

  afterEach(() => {
    Locations.reset();
    LogicHelper.reset();
    Macros.reset();
    Settings.reset();
  });

  describe('constructor', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        options: {
          [Permalink.OPTIONS.KEY_LUNACY]: false,
          [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 0,
          [Permalink.OPTIONS.RACE_MODE]: false,
          [Permalink.OPTIONS.RANDOMIZE_CHARTS]: false,
          [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DISABLED,
          [Permalink.OPTIONS.SKIP_REMATCH_BOSSES]: true,
          [Permalink.OPTIONS.SWORD_MODE]: Permalink.SWORD_MODE_OPTIONS.START_WITH_SWORD,
        },
        startingGear: {
          [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: 0,
        },
      });

      Locations.initialize(TEST_ITEM_LOCATIONS);
      Macros.initialize(TEST_MACROS);

      LogicTweaks.applyTweaks();

      LogicHelper.initialize();
    });

    describe('setting guaranteed keys', () => {
      let state;

      describe('when doing key lunacy', () => {
        beforeEach(() => {
          Settings.initializeRaw({
            options: {
              [Permalink.OPTIONS.KEY_LUNACY]: true,
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
            { text: 'or', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
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
            { text: 'or', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
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
            { text: 'or', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: '(', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: 'Grappling Hook', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.INCONSEQUENTIAL_ITEM },
            { text: 'and', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: '(', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
            { text: 'Boomerang', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.AVAILABLE_ITEM },
            { text: 'or', color: LogicCalculation.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT },
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

  describe('itemsRemainingForLocation', () => {
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

      test('returns 0', () => {
        const isLocationAvailable = logic.itemsRemainingForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(0);
      });
    });

    describe('when multiple items are all required', () => {
      beforeEach(() => {
        setLocations({
          "Ganon's Tower": {
            'Defeat Ganondorf': {
              need: 'Triforce Shard x8 & Progressive Sword x4 & Progressive Bow x3 & Boomerang & Grappling Hook & Hookshot',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state
            .incrementItem('Triforce Shard')
            .incrementItem('Progressive Sword')
            .incrementItem('Grappling Hook'),
        );
      });

      test('returns the number of items remaining for the location', () => {
        const itemsRemaining = logic.itemsRemainingForLocation("Ganon's Tower", 'Defeat Ganondorf');

        expect(itemsRemaining).toEqual(15);
      });
    });

    describe('when at least one of the items is required', () => {
      beforeEach(() => {
        setLocations({
          "Ganon's Tower": {
            'Defeat Ganondorf': {
              need: 'Triforce Shard x8 | Progressive Sword x4 | Progressive Bow x3 | Boomerang | Grappling Hook | Hookshot',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state
            .incrementItem('Triforce Shard')
            .incrementItem('Progressive Sword')
            .incrementItem('Grappling Hook'),
        );
      });

      test('returns the number of items remaining for the location', () => {
        const itemsRemaining = logic.itemsRemainingForLocation("Ganon's Tower", 'Defeat Ganondorf');

        expect(itemsRemaining).toEqual(7);
      });
    });
  });

  describe('_nonKeyRequirementsMetForLocation', () => {
    describe('when the location is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state.toggleLocationChecked('Dragon Roost Cavern', 'First Room'),
        );
      });

      test('returns true', () => {
        const nonKeyRequirementsMet = logic._nonKeyRequirementsMetForLocation('Dragon Roost Cavern', 'First Room');

        expect(nonKeyRequirementsMet).toEqual(true);
      });
    });

    describe('when the location has no requirements', () => {
      beforeEach(() => {
        setLocations({
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Nothing',
            },
          },
        });
      });

      test('returns true', () => {
        const nonKeyRequirementsMet = logic._nonKeyRequirementsMetForLocation('Dragon Roost Cavern', 'First Room');

        expect(nonKeyRequirementsMet).toEqual(true);
      });
    });

    describe('when the location requires an item that is not obtained yet', () => {
      beforeEach(() => {
        setLocations({
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Grappling Hook & DRC Big Key',
            },
          },
        });
      });

      test('returns false', () => {
        const nonKeyRequirementsMet = logic._nonKeyRequirementsMetForLocation('Dragon Roost Cavern', 'First Room');

        expect(nonKeyRequirementsMet).toEqual(false);
      });
    });

    describe('when the location only requires a small key', () => {
      beforeEach(() => {
        setLocations({
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'DRC Small Key x1',
            },
          },
        });
      });

      test('returns true', () => {
        const nonKeyRequirementsMet = logic._nonKeyRequirementsMetForLocation('Dragon Roost Cavern', 'First Room');

        expect(nonKeyRequirementsMet).toEqual(true);
      });
    });

    describe('when all non-key requirements are met', () => {
      beforeEach(() => {
        setLocations({
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'DRC Small Key x1 & Grappling Hook & Deku Leaf',
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
        const nonKeyRequirementsMet = logic._nonKeyRequirementsMetForLocation('Dragon Roost Cavern', 'First Room');

        expect(nonKeyRequirementsMet).toEqual(true);
      });
    });

    describe('when the only non-key requirements are obsoleted by a key requirement', () => {
      beforeEach(() => {
        setLocations({
          'Dragon Roost Cavern': {
            'Big Key Chest': {
              need: 'DRC Small Key x1 & Grappling Hook & (DRC Small Key x4 | Deku Leaf | Progressive Bow x2)',
            },
          },
        });

        logic = new LogicCalculation(
          logic.state.incrementItem('Grappling Hook'),
        );
      });

      test('returns true', () => {
        const nonKeyRequirementsMet = logic._nonKeyRequirementsMetForLocation('Dragon Roost Cavern', 'Big Key Chest');

        expect(nonKeyRequirementsMet).toEqual(true);
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
              need: 'Grappling Hook',
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
