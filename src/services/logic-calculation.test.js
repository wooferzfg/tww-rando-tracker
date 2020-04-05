import _ from 'lodash';

import Locations from './locations';
import LogicCalculation from './logic-calculation';
import TrackerState from './tracker-state';

describe('LogicCalculation', () => {
  let logic;

  beforeEach(() => {
    logic = new LogicCalculation(TrackerState.default());
  });

  describe('isLocationAvailable', () => {
    describe('when the location is checked', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf & Grappling Hook'
            }
          }
        };

        logic = new LogicCalculation(
          logic.state.setLocationChecked('Outset Island', 'Savage Labyrinth - Floor 30', true)
        );
      });

      test('returns true', () => {
        const isLocationAvailable = logic.isLocationAvailable('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(true);
      });
    });

    describe('when the location requirements are met', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf & Grappling Hook'
            }
          }
        };

        logic = new LogicCalculation(
          logic.state
            .setItemValue('Grappling Hook', 1)
            .setItemValue('Deku Leaf', 1)
        );
      });

      test('returns true', () => {
        const isLocationAvailable = logic.isLocationAvailable('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(true);
      });
    });

    describe('when the location requirements are not met', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf & Grappling Hook'
            }
          }
        };

        logic = new LogicCalculation(
          logic.state
            .setItemValue('Grappling Hook', 0)
            .setItemValue('Deku Leaf', 1)
        );
      });

      test('returns false', () => {
        const isLocationAvailable = logic.isLocationAvailable('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(false);
      });
    });
  });

  describe('itemsRemainingForLocation', () => {
    describe('when the location is checked', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Deku Leaf & Grappling Hook'
            }
          }
        };

        logic = new LogicCalculation(
          logic.state.setLocationChecked('Outset Island', 'Savage Labyrinth - Floor 30', true)
        );
      });

      test('returns 0', () => {
        const isLocationAvailable = logic.itemsRemainingForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(isLocationAvailable).toEqual(0);
      });
    });

    describe('when multiple items are all required', () => {
      beforeEach(() => {
        Locations.locations = {
          "Ganon's Tower": {
            'Defeat Ganondorf': {
              need: 'Triforce Shard x8 & Progressive Sword x4 & Progressive Bow x3 & Boomerang & Grappling Hook & Hookshot'
            }
          }
        };

        logic = new LogicCalculation(
          logic.state
            .setItemValue('Triforce Shard', 1)
            .setItemValue('Progressive Sword', 1)
            .setItemValue('Grappling Hook', 1)
        );
      });

      test('returns the number of items remaining for the location', () => {
        const itemsRemaining = logic.itemsRemainingForLocation("Ganon's Tower", 'Defeat Ganondorf');

        expect(itemsRemaining).toEqual(15);
      });
    });

    describe('when at least one of the items is required', () => {
      beforeEach(() => {
        Locations.locations = {
          "Ganon's Tower": {
            'Defeat Ganondorf': {
              need: 'Triforce Shard x8 | Progressive Sword x4 | Progressive Bow x3 | Boomerang | Grappling Hook | Hookshot'
            }
          }
        };

        logic = new LogicCalculation(
          logic.state
            .setItemValue('Triforce Shard', 1)
            .setItemValue('Progressive Sword', 1)
            .setItemValue('Grappling Hook', 1)
        );
      });

      test('returns the number of items remaining for the location', () => {
        const itemsRemaining = logic.itemsRemainingForLocation("Ganon's Tower", 'Defeat Ganondorf');

        expect(itemsRemaining).toEqual(7);
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
            logic.state.setItemValue('Deku Leaf', 1)
          );
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet('Deku Leaf');

          expect(isItemAvailable).toEqual(true);
        });
      });

      describe('when the item is not available', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.setItemValue('Deku Leaf', 0)
          );
        });

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
            logic.state.setItemValue('Progressive Sword', 3)
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
            logic.state.setItemValue('Triforce Shard', 4)
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
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Grappling Hook'
            }
          }
        };
      });

      describe('when the other location has not been checked', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.setLocationChecked('Outset Island', 'Savage Labyrinth - Floor 30', false)
          );
        });

        test('returns false', () => {
          const isItemAvailable = logic._isRequirementMet(
            'Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 30"'
          );

          expect(isItemAvailable).toEqual(false);
        });
      });

      describe('when the other location has been checked', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.setLocationChecked('Outset Island', 'Savage Labyrinth - Floor 30', true)
          );
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet(
            'Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 30"'
          );

          expect(isItemAvailable).toEqual(true);
        });
      });

      describe('when the requirements for the other location have been met', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.setItemValue('Grappling Hook', 1)
          );
        });

        test('returns true', () => {
          const isItemAvailable = logic._isRequirementMet(
            'Has Accessed Other Location "Outset Island - Savage Labyrinth - Floor 30"'
          );

          expect(isItemAvailable).toEqual(true);
        });
      });
    });
  });

  describe('_parseItemCountRequirement', () => {
    test('progressive item', () => {
      const itemCountRequirement = LogicCalculation._parseItemCountRequirement('Progressive Sword x4');

      expect(itemCountRequirement).toEqual({
        itemName: 'Progressive Sword',
        countRequired: 4
      });
    });

    test('small key', () => {
      const itemCountRequirement = LogicCalculation._parseItemCountRequirement('DRC Small Key x2');

      expect(itemCountRequirement).toEqual({
        itemName: 'DRC Small Key',
        countRequired: 2
      });
    });
  });
});
