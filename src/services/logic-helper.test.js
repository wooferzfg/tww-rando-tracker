import BooleanExpression from './boolean-expression';
import Locations from './locations';
import LogicHelper from './logic-helper';
import Macros from './macros';
import Settings from './settings';

describe('LogicHelper', () => {
  describe('allItems', () => {
    test('returns a list of all the items, including entrances, charts, and keys', () => {
      const allItems = LogicHelper.allItems();

      expect(allItems).toMatchSnapshot();
    });
  });

  describe('getRequirementsForLocation', () => {
    describe('when the location has no requirements', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Nothing'
            }
          }
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.getRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(expression).toEqual(
          BooleanExpression.and('Nothing')
        );
      });
    });

    describe('when the location requirements only contain items', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: "Grappling Hook | Hero's Sword | Skull Hammer"
            }
          }
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.getRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(expression).toEqual(
          BooleanExpression.or('Grappling Hook', "Hero's Sword", 'Skull Hammer')
        );
      });
    });

    describe('when the location requirements have parentheses', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: "Wind Waker | ((Grappling Hook & Hero's Bow) & Hero's Sword) | Skull Hammer"
            }
          }
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.getRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(expression).toEqual(
          BooleanExpression.or(
            'Wind Waker',
            BooleanExpression.and(
              BooleanExpression.and('Grappling Hook', "Hero's Bow"),
              "Hero's Sword"
            ),
            'Skull Hammer'
          )
        );
      });
    });

    describe('when the location requirements contain a macro', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Grappling Hook | My Fake Macro | Skull Hammer'
            }
          }
        };

        Macros.macros = {
          'My Fake Macro': "Grappling Hook | Hero's Sword"
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.getRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(expression).toEqual(
          BooleanExpression.or(
            'Grappling Hook',
            BooleanExpression.or(
              'Grappling Hook',
              "Hero's Sword"
            ),
            'Skull Hammer'
          )
        );
      });
    });

    describe('when the location requires another location', () => {
      beforeEach(() => {
        Locations.locations = {
          'Outset Island': {
            'Savage Labyrinth - Floor 30': {
              need: 'Can Access Other Location "Outset Island - Savage Labyrinth - Floor 50"'
            },
            'Savage Labyrinth - Floor 50': {
              need: "Grappling Hook | Hero's Bow"
            }
          }
        };
      });

      test('returns the requirements expression', () => {
        const expression = LogicHelper.getRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(expression).toEqual(
          BooleanExpression.and(
            BooleanExpression.or('Grappling Hook', "Hero's Bow")
          )
        );
      });
    });

    describe('option requirements', () => {
      const testOptionRequirements = ({
        requirements,
        options,
        expectedExpression
      }) => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: requirements
              }
            }
          };

          Settings.initialize({ options });
        });

        test('returns the requirements expression', () => {
          const expression = LogicHelper.getRequirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

          expect(expression).toEqual(expectedExpression);
        });
      };

      describe('when the location requires an option to be enabled', () => {
        describe('when the option is enabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Enabled',
            options: { skipRematchBosses: true },
            expectedExpression: BooleanExpression.and('Nothing')
          });
        });

        describe('when the option is disabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Enabled',
            options: { skipRematchBosses: false },
            expectedExpression: BooleanExpression.and('Impossible')
          });
        });
      });

      describe('when the location requires an option to be disabled', () => {
        describe('when the option is enabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Disabled',
            options: { skipRematchBosses: true },
            expectedExpression: BooleanExpression.and('Impossible')
          });
        });

        describe('when the option is disabled', () => {
          testOptionRequirements({
            requirements: 'Option "skip_rematch_bosses" Disabled',
            options: { skipRematchBosses: false },
            expectedExpression: BooleanExpression.and('Nothing')
          });
        });
      });

      describe('when the location requires an option to match a value', () => {
        describe('when the option matches the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is "Swordless"',
            options: { swordMode: 'Swordless' },
            expectedExpression: BooleanExpression.and('Nothing')
          });
        });

        describe('when the option does not match the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is "Swordless"',
            options: { swordMode: 'Swordless Start' },
            expectedExpression: BooleanExpression.and('Impossible')
          });
        });
      });

      describe('when the location requires an option not to match a value', () => {
        describe('when the option matches the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is Not "Swordless"',
            options: { swordMode: 'Swordless' },
            expectedExpression: BooleanExpression.and('Impossible')
          });
        });

        describe('when the option does not match the value', () => {
          testOptionRequirements({
            requirements: 'Option "sword_mode" Is Not "Swordless"',
            options: { swordMode: 'Swordless Start' },
            expectedExpression: BooleanExpression.and('Nothing')
          });
        });
      });

      describe('when the location requires an option to contain a value', () => {
        describe('when the option contains the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Contains "Grappling Hook"',
            options: { startingGear: ['Grappling Hook'] },
            expectedExpression: BooleanExpression.and('Nothing')
          });
        });

        describe('when the option does not contain the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Contains "Grappling Hook"',
            options: { randomized_gear: ['Grappling Hook'] },
            expectedExpression: BooleanExpression.and('Impossible')
          });
        });
      });

      describe('when the location requires an option not to contain a value', () => {
        describe('when the option contains the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Does Not Contain "Grappling Hook"',
            options: { startingGear: ['Grappling Hook'] },
            expectedExpression: BooleanExpression.and('Impossible')
          });
        });

        describe('when the option does not contain the value', () => {
          testOptionRequirements({
            requirements: 'Option "starting_gear" Does Not Contain "Grappling Hook"',
            options: { randomized_gear: ['Grappling Hook'] },
            expectedExpression: BooleanExpression.and('Nothing')
          });
        });
      });
    });
  });

  describe('isMainDungeon', () => {
    describe('when the dungeon is a main dungeon', () => {
      test('returns true', () => {
        const isMainDungeon = LogicHelper.isMainDungeon('Dragon Roost Cavern');

        expect(isMainDungeon).toEqual(true);
      });
    });

    describe('when the dungeon is Forsaken Fortress', () => {
      test('returns false', () => {
        const isMainDungeon = LogicHelper.isMainDungeon('Forsaken Fortress');

        expect(isMainDungeon).toEqual(false);
      });
    });

    describe("when the dungeon is Ganon's Tower", () => {
      test('returns false', () => {
        const isMainDungeon = LogicHelper.isMainDungeon("Ganon's Tower");

        expect(isMainDungeon).toEqual(false);
      });
    });

    describe('when the argument is not a dungeon', () => {
      test('returns false', () => {
        const isMainDungeon = LogicHelper.isMainDungeon('Pawprint Isle');

        expect(isMainDungeon).toEqual(false);
      });
    });
  });

  describe('shortDungeonName', () => {
    test('returns the short dungeon name based on the dungeon name', () => {
      const shortDungeonName = LogicHelper.shortDungeonName('Dragon Roost Cavern');

      expect(shortDungeonName).toEqual('DRC');
    });
  });

  describe('dungeonEntryName', () => {
    test('returns the entry name based on a dungeon name', () => {
      const entryName = LogicHelper.dungeonEntryName('Dragon Roost Cavern');

      expect(entryName).toEqual('Entered DRC');
    });
  });

  describe('shortCaveName', () => {
    test('returns the cave name without mentioning secret caves', () => {
      const shortCaveName = LogicHelper.shortCaveName('Dragon Roost Island Secret Cave');

      expect(shortCaveName).toEqual('Dragon Roost Island Cave');
    });

    test('returns the cave name without mentioning warp maze caves', () => {
      const shortCaveName = LogicHelper.shortCaveName('Diamond Steppe Island Warp Maze Cave');

      expect(shortCaveName).toEqual('Diamond Steppe Island Cave');
    });
  });

  describe('caveEntryName', () => {
    test('returns the entry name based on a cave name', () => {
      const entryName = LogicHelper.caveEntryName('Dragon Roost Island Secret Cave');

      expect(entryName).toEqual('Entered Dragon Roost Island Cave');
    });
  });

  describe('isRandomDungeonEntrances', () => {
    describe('when dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Separately)'
          }
        });
      });

      test('returns true', () => {
        const isRandomDungeonEntrances = LogicHelper.isRandomDungeonEntrances();

        expect(isRandomDungeonEntrances).toEqual(true);
      });
    });

    describe('when dungeon entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Secret Caves'
          }
        });
      });

      test('returns false', () => {
        const isRandomDungeonEntrances = LogicHelper.isRandomDungeonEntrances();

        expect(isRandomDungeonEntrances).toEqual(false);
      });
    });
  });

  describe('isRandomCaveEntrances', () => {
    describe('when cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Separately)'
          }
        });
      });

      test('returns true', () => {
        const isRandomCaveEntrances = LogicHelper.isRandomCaveEntrances();

        expect(isRandomCaveEntrances).toEqual(true);
      });
    });

    describe('when cave entrances are not randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons'
          }
        });
      });

      test('returns false', () => {
        const isRandomCaveEntrances = LogicHelper.isRandomCaveEntrances();

        expect(isRandomCaveEntrances).toEqual(false);
      });
    });
  });

  describe('isRandomEntrancesTogether', () => {
    describe('when dungeon and cave entrances are randomized together', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Together)'
          }
        });
      });

      test('returns true', () => {
        const isRandomEntrancesTogether = LogicHelper.isRandomEntrancesTogether();

        expect(isRandomEntrancesTogether).toEqual(true);
      });
    });

    describe('when dungeon and cave entrances are not randomized together', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons & Secret Caves (Separately)'
          }
        });
      });

      test('returns false', () => {
        const isRandomEntrancesTogether = LogicHelper.isRandomEntrancesTogether();

        expect(isRandomEntrancesTogether).toEqual(false);
      });
    });
  });

  describe('_setStartingAndImpossibleItems', () => {
    describe('with no starting shards, no starting gear, and starting with a sword', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 0,
            swordMode: 'Start with Sword'
          }
        });
      });

      test('sets the starting and impossible items', () => {
        LogicHelper._setStartingAndImpossibleItems();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual([]);
      });
    });

    describe('with starting shards', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 7,
            startingGear: 0,
            swordMode: 'Start with Sword'
          }
        });
      });

      test('sets the number of starting shards', () => {
        LogicHelper._setStartingAndImpossibleItems();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual([]);
      });
    });

    describe('with starting gear', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 549755813922, // Bombs, Deku Leaf, and 2 sword upgrades
            swordMode: 'Start with Sword'
          }
        });
      });

      test('sets the starting items based on the starting gear', () => {
        LogicHelper._setStartingAndImpossibleItems();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual([]);
      });
    });

    describe('when starting without a sword', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 0,
            swordMode: 'Randomized Sword'
          }
        });
      });

      test('sets sword to 0 in the starting items', () => {
        LogicHelper._setStartingAndImpossibleItems();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toEqual([]);
      });
    });

    describe('when in swordless mode', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            numStartingTriforceShards: 0,
            startingGear: 0,
            swordMode: 'Swordless'
          }
        });
      });

      test('sets sword to 0 in the starting items and adds impossible items', () => {
        LogicHelper._setStartingAndImpossibleItems();

        expect(LogicHelper.startingItems).toMatchSnapshot();
        expect(LogicHelper.impossibleItems).toMatchSnapshot();
      });
    });
  });

  describe('_splitExpression', () => {
    test('splits and trims an expression', () => {
      const input = "Can Defeat Darknuts & Can Play Wind's Requiem & (Grappling Hook | Hero's Sword | Skull Hammer)";

      const splitExpression = LogicHelper._splitExpression(input);

      expect(splitExpression).toEqual([
        'Can Defeat Darknuts',
        '&',
        "Can Play Wind's Requiem",
        '&',
        '(',
        'Grappling Hook',
        '|',
        "Hero's Sword",
        '|',
        'Skull Hammer',
        ')'
      ]);
    });
  });
});
