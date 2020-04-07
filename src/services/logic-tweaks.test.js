import LogicTweaks from './logic-tweaks';
import Locations from './locations';
import Macros from './macros';
import Settings from './settings';

describe('LogicTweaks', () => {
  afterEach(() => {
    Locations.locations = null;
    Macros.macros = null;
    Settings.options = null;
  });

  describe('updateLocations', () => {
    beforeEach(() => {
      Locations.locations = {
        Mailbox: {
          'Letter from Baito': {
            need: 'Delivery Bag & Note to Mom & Song of Passing & Can Access Other Location "Earth Temple - Jalhalla Heart Container"'
          },
          'Letter from Orca': {
            need: 'Can Access Other Location "Forbidden Woods - Kalle Demos Heart Container"'
          },
          'Letter from Aryll': {
            need: 'Can Access Other Location "Forsaken Fortress - Helmaroc King Heart Container" & Song of Passing'
          },
          'Letter from Tingle': {
            need: 'Rescued Tingle & Any Wallet Upgrade & Can Access Other Location "Forsaken Fortress - Helmaroc King Heart Container" & Song of Passing'
          }
        },
        'Tingle Island': {
          'Ankle - Reward for All Tingle Statues': {
            need: 'Dragon Tingle Statue & Forbidden Tingle Statue & Goddess Tingle Statue & Earth Tingle Statue & Wind Tingle Statue'
          }
        }
      };
    });

    test('updates the locations', () => {
      LogicTweaks.updateLocations();

      expect(Locations.locations).toMatchSnapshot();
    });
  });

  describe('updateMacros', () => {
    beforeEach(() => {
      Macros.macros = {
        "Can Farm Knight's Crests": 'Grappling Hook & Can Access Other Location "Ice Ring Isle - Inner Cave - Chest"'
      };
    });

    describe('when no options are set', () => {
      test('updates the macros', () => {
        LogicTweaks.updateMacros();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when dungeon entrances are randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Dungeons'
          }
        });
      });

      test('updates the macros', () => {
        LogicTweaks.updateMacros();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when cave entrances are randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeEntrances: 'Secret Caves'
          }
        });
      });

      test('updates the macros', () => {
        LogicTweaks.updateMacros();

        expect(Macros.macros).toMatchSnapshot();
      });
    });

    describe('when charts are randomized', () => {
      beforeEach(() => {
        Settings.initialize({
          options: {
            randomizeCharts: true
          }
        });
      });

      test('updates the macros', () => {
        LogicTweaks.updateMacros();

        expect(Macros.macros).toMatchSnapshot();
      });
    });
  });
});
