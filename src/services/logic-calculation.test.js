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

  describe('_keysToMakeLocationAvailable', () => {
    describe('when the location is checked', () => {
      beforeEach(() => {
        logic = new LogicCalculation(
          logic.state.setLocationChecked('Dragon Roost Cavern', 'First Room', true)
        );
      });

      test('returns 0 small keys and 0 big keys', () => {
        const keysRequired = logic._keysToMakeLocationAvailable('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual({
          small: 0,
          big: 0
        });
      });
    });

    describe('when the location has no requirements', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Nothing'
            }
          }
        };
      });

      test('returns 0 small keys and 0 big keys', () => {
        const keysRequired = logic._keysToMakeLocationAvailable('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual({
          small: 0,
          big: 0
        });
      });
    });

    describe('when the location has non-key requirements that are not met', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Grappling Hook'
            }
          }
        };
      });

      test('returns false', () => {
        const keysRequired = logic._keysToMakeLocationAvailable('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual(false);
      });
    });

    describe('when the location only requires a small key', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'DRC Small Key x1'
            }
          }
        };
      });

      test('returns 1 small key and 0 big keys', () => {
        const keysRequired = logic._keysToMakeLocationAvailable('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual({
          small: 1,
          big: 0
        });
      });
    });

    describe('when the location requires some keys and some already obtained items', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'First Room': {
              need: 'Grappling Hook & Deku Leaf & DRC Small Key x2 & DRC Big Key x1'
            }
          }
        };

        logic = new LogicCalculation(
          logic.state
            .setItemValue('Grappling Hook', 1)
            .setItemValue('Deku Leaf', 1)
        );
      });

      test('returns 2 small keys and 1 big key', () => {
        const keysRequired = logic._keysToMakeLocationAvailable('Dragon Roost Cavern', 'First Room');

        expect(keysRequired).toEqual({
          small: 2,
          big: 1
        });
      });
    });

    describe('when the location has nested key requirements', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'Big Key Chest': {
              need: 'DRC Small Key x1 & Grappling Hook & (DRC Small Key x4 | Deku Leaf | Progressive Bow x2)'
            }
          }
        };
      });

      describe('when the non-key items have been obtained', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state
              .setItemValue('Grappling Hook', 1)
              .setItemValue('Progressive Bow', 2)
          );
        });

        test('returns 1 small key and 0 big keys', () => {
          const keysRequired = logic._keysToMakeLocationAvailable('Dragon Roost Cavern', 'Big Key Chest');

          expect(keysRequired).toEqual({
            small: 1,
            big: 0
          });
        });
      });

      describe('when the non-key items have not been obtained', () => {
        beforeEach(() => {
          logic = new LogicCalculation(
            logic.state.setItemValue('Grappling Hook', 1)
          );
        });

        test('returns 4 small keys and 0 big keys', () => {
          const keysRequired = logic._keysToMakeLocationAvailable('Dragon Roost Cavern', 'Big Key Chest');

          expect(keysRequired).toEqual({
            small: 4,
            big: 0
          });
        });
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
});
