import BooleanExpression from './boolean-expression';
import Locations from './locations';
import LogicHelper from './logic-helper';
import Macros from './macros';
import Settings from './settings';

describe('LogicHelper', () => {
  afterEach(() => {
    Locations.locations = null;
    LogicHelper.impossibleItems = null;
    LogicHelper.startingItems = null;
    Macros.macros = null;
    Settings.options = null;
  });

  describe('allItems', () => {
    test('returns a list of all the items, including entrances, charts, and keys', () => {
      const allItems = LogicHelper.allItems();

      expect(allItems).toMatchSnapshot();
    });
  });

  describe('requirementsForLocation', () => {
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
        const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
        const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

        expect(expression).toEqual(
          BooleanExpression.or('Grappling Hook', "Hero's Sword", 'Skull Hammer')
        );
      });
    });

    describe('when the location requirements contain a starting item', () => {
      describe('when the starting item is progressive', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Progressive Sword x2'
              }
            }
          };
        });

        describe('when the starting item meets the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Progressive Sword': 2
            };
          });

          test('replaces the item in the requirements expression', () => {
            const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

            expect(expression).toEqual(
              BooleanExpression.and('Nothing')
            );
          });
        });

        describe('when the starting item does not meet the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Progressive Sword': 1
            };
          });

          test('does not replace the item in the requirements expression', () => {
            const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

            expect(expression).toEqual(
              BooleanExpression.and('Progressive Sword x2')
            );
          });
        });
      });

      describe('when the starting item is a normal item', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Wind Waker'
              }
            }
          };
        });

        describe('when the starting item meets the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Wind Waker': 1
            };
          });

          test('replaces the item in the requirements expression', () => {
            const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

            expect(expression).toEqual(
              BooleanExpression.and('Nothing')
            );
          });
        });

        describe('when the starting item does not meet the requirement', () => {
          beforeEach(() => {
            LogicHelper.startingItems = {
              'Wind Waker': 0
            };
          });

          test('does not replace the item in the requirements expression', () => {
            const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

            expect(expression).toEqual(
              BooleanExpression.and('Wind Waker')
            );
          });
        });
      });
    });

    describe('when the location requirements contain an impossible item', () => {
      describe('when the impossible item is progressive', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Progressive Sword x2'
              }
            }
          };
        });

        describe('when the impossible item meets the requirement', () => {
          beforeEach(() => {
            LogicHelper.impossibleItems = {
              'Progressive Sword': 2
            };
          });

          test('replaces the item in the requirements expression', () => {
            const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

            expect(expression).toEqual(
              BooleanExpression.and('Impossible')
            );
          });
        });

        describe('when the impossible item is more than the requirement', () => {
          beforeEach(() => {
            LogicHelper.impossibleItems = {
              'Progressive Sword': 3
            };
          });

          test('does not replace the item in the requirements expression', () => {
            const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

            expect(expression).toEqual(
              BooleanExpression.and('Progressive Sword x2')
            );
          });
        });
      });

      describe('when the impossible item is a normal item', () => {
        beforeEach(() => {
          Locations.locations = {
            'Outset Island': {
              'Savage Labyrinth - Floor 30': {
                need: 'Wind Waker'
              }
            }
          };

          LogicHelper.impossibleItems = {
            'Wind Waker': 1
          };
        });

        test('replaces the item in the requirements expression', () => {
          const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

          expect(expression).toEqual(
            BooleanExpression.and('Impossible')
          );
        });
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
        const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
        const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
        const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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
          const expression = LogicHelper.requirementsForLocation('Outset Island', 'Savage Labyrinth - Floor 30');

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

  describe('parseItemCountRequirement', () => {
    test('progressive item', () => {
      const itemCountRequirement = LogicHelper.parseItemCountRequirement('Progressive Sword x4');

      expect(itemCountRequirement).toEqual({
        itemName: 'Progressive Sword',
        countRequired: 4
      });
    });

    test('small key', () => {
      const itemCountRequirement = LogicHelper.parseItemCountRequirement('DRC Small Key x2');

      expect(itemCountRequirement).toEqual({
        itemName: 'DRC Small Key',
        countRequired: 2
      });
    });
  });

  describe('isValidDungeonLocation', () => {
    describe('when the location is in a unique dungeon', () => {
      test('returns true', () => {
        const isValidDungeonLocation = LogicHelper.isValidDungeonLocation("Ganon's Tower", 'Defeat Ganondorf');

        expect(isValidDungeonLocation).toEqual(true);
      });
    });

    describe('when the location is on an island', () => {
      test('returns false', () => {
        const isValidDungeonLocation = LogicHelper.isValidDungeonLocation('Outset Island', 'Great Fairy');

        expect(isValidDungeonLocation).toEqual(false);
      });
    });

    describe('when the location is in a dungeon that is also an island', () => {
      beforeEach(() => {
        Locations.locations = {
          'Tower of the Gods': {
            'Light Two Torches': {
              types: 'Dungeon'
            }
          }
        };
      });

      test('returns true', () => {
        const isValidDungeonLocation = LogicHelper.isValidDungeonLocation('Tower of the Gods', 'Light Two Torches');

        expect(isValidDungeonLocation).toEqual(true);
      });
    });

    describe('when the location is on an island that is also a dungeon', () => {
      beforeEach(() => {
        Locations.locations = {
          'Tower of the Gods': {
            'Sunken Treasure': {
              types: 'Sunken Treasure'
            }
          }
        };
      });

      test('returns false', () => {
        const isValidDungeonLocation = LogicHelper.isValidDungeonLocation('Tower of the Gods', 'Sunken Treasure');

        expect(isValidDungeonLocation).toEqual(false);
      });
    });
  });

  describe('isValidIslandLocation', () => {
    describe('when the location is on a unique island', () => {
      test('returns true', () => {
        const isValidIslandLocation = LogicHelper.isValidIslandLocation('Windfall Island', 'Tott');

        expect(isValidIslandLocation).toEqual(true);
      });
    });

    describe('when the location is in a dungeon', () => {
      test('returns false', () => {
        const isValidIslandLocation = LogicHelper.isValidIslandLocation('Forbidden Woods', 'First Room');

        expect(isValidIslandLocation).toEqual(false);
      });
    });

    describe('when the location is on an island that is also a dungeon', () => {
      beforeEach(() => {
        Locations.locations = {
          'Forsaken Fortress': {
            'Sunken Treasure': {
              types: 'Sunken Treasure'
            }
          }
        };
      });

      test('returns true', () => {
        const isValidIslandLocation = LogicHelper.isValidIslandLocation('Forsaken Fortress', 'Sunken Treasure');

        expect(isValidIslandLocation).toEqual(true);
      });
    });

    describe('when the location is in a dungeon that is also an island', () => {
      beforeEach(() => {
        Locations.locations = {
          'Forsaken Fortress': {
            'Phantom Ganon': {
              types: 'Dungeon'
            }
          }
        };
      });

      test('returns false', () => {
        const isValidIslandLocation = LogicHelper.isValidIslandLocation('Forsaken Fortress', 'Phantom Ganon');

        expect(isValidIslandLocation).toEqual(false);
      });
    });
  });

  describe('isPotentialKeyLocation', () => {
    describe('when the location is a valid big key location', () => {
      beforeEach(() => {
        Locations.locations = {
          'Wind Temple': {
            'Big Key Chest': {
              need: 'Can Access Wind Temple',
              types: 'Dungeon'
            }
          }
        };
      });

      test('returns true', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Big Key Chest');

        expect(isPotentialKeyLocation).toEqual(true);
      });
    });

    describe('when the location is not in a main dungeon', () => {
      beforeEach(() => {
        Locations.locations = {
          'Forsaken Fortress': {
            'Phantom Ganon': {
              types: 'Dungeon'
            }
          }
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Forsaken Fortress', 'Phantom Ganon');

        expect(isPotentialKeyLocation).toEqual(false);
      });
    });

    describe('when the location is on an island that is also a dungeon', () => {
      beforeEach(() => {
        Locations.locations = {
          'Tower of the Gods': {
            'Sunken Treasure': {
              types: 'Sunken Treasure'
            }
          }
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Tower of the Gods', 'Sunken Treasure');

        expect(isPotentialKeyLocation).toEqual(false);
      });
    });

    describe('when the location is a tingle chest', () => {
      beforeEach(() => {
        Locations.locations = {
          'Wind Temple': {
            'Tingle Statue Chest': {
              need: 'Can Access Wind Temple',
              types: 'Tingle Chest, Dungeon'
            }
          }
        };
      });

      describe('when the tingle chest flag is active', () => {
        beforeEach(() => {
          Settings.initialize({ flags: ['Tingle Chest'] });
        });

        test('returns true', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Tingle Statue Chest');

          expect(isPotentialKeyLocation).toEqual(true);
        });
      });

      describe('when the tingle chest flag is not active', () => {
        beforeEach(() => {
          Settings.initialize({ flags: [] });
        });

        test('returns false', () => {
          const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Wind Temple', 'Tingle Statue Chest');

          expect(isPotentialKeyLocation).toEqual(false);
        });
      });
    });

    describe('when the location is a boss item drop', () => {
      beforeEach(() => {
        Locations.locations = {
          'Dragon Roost Cavern': {
            'Gohma Heart Container': {
              need: 'Grappling Hook & DRC Big Key',
              types: 'Dungeon'
            }
          }
        };
      });

      test('returns false', () => {
        const isPotentialKeyLocation = LogicHelper.isPotentialKeyLocation('Dragon Roost Cavern', 'Gohma Heart Container');

        expect(isPotentialKeyLocation).toEqual(false);
      });
    });
  });

  describe('smallKeyName', () => {
    test('returns the name of the small key for the dungeon', () => {
      const smallKeyName = LogicHelper.smallKeyName('Dragon Roost Cavern');

      expect(smallKeyName).toEqual('DRC Small Key');
    });
  });

  describe('bigKeyName', () => {
    test('returns the name of the small key for the dungeon', () => {
      const bigKeyName = LogicHelper.bigKeyName('Forbidden Woods');

      expect(bigKeyName).toEqual('FW Big Key');
    });
  });

  describe('maxSmallKeysForDungeon', () => {
    test('returns the max small keys for DRC', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Dragon Roost Cavern');

      expect(maxKeys).toEqual(4);
    });

    test('returns the max small keys for FW', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Forbidden Woods');

      expect(maxKeys).toEqual(1);
    });

    test('returns the max small keys for TotG', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Tower of the Gods');

      expect(maxKeys).toEqual(2);
    });

    test('returns the max small keys for ET', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Earth Temple');

      expect(maxKeys).toEqual(3);
    });

    test('returns the max small keys for WT', () => {
      const maxKeys = LogicHelper.maxSmallKeysForDungeon('Wind Temple');

      expect(maxKeys).toEqual(2);
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
