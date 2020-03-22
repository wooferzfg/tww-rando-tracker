import LogicTweaks from './logic-tweaks';
import Locations from './locations';

describe('LogicTweaks', () => {
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
});
