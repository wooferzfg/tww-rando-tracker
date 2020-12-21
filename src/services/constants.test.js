import Constants from './constants';

describe('Constants', () => {
  describe('createFromArray', () => {
    test('converts plain values correctly', () => {
      const input = [
        'Dungeon',
        'Mail',
        'Platform',
      ];

      const output = Constants.createFromArray(input);

      expect(output).toEqual({
        DUNGEON: 'Dungeon',
        MAIL: 'Mail',
        PLATFORM: 'Platform',
      });
    });

    test('converts snake case values correctly', () => {
      const input = [
        'progression_combat_secret_caves',
        'progression_platforms_rafts',
        'progression_expensive_purchases',
      ];

      const output = Constants.createFromArray(input);

      expect(output).toEqual({
        PROGRESSION_COMBAT_SECRET_CAVES: 'progression_combat_secret_caves',
        PROGRESSION_PLATFORMS_RAFTS: 'progression_platforms_rafts',
        PROGRESSION_EXPENSIVE_PURCHASES: 'progression_expensive_purchases',
      });
    });

    test('converts values with spaces correctly', () => {
      const input = [
        'Tingle Chest',
        'Secret Caves',
      ];

      const output = Constants.createFromArray(input);

      expect(output).toEqual({
        TINGLE_CHEST: 'Tingle Chest',
        SECRET_CAVES: 'Secret Caves',
      });
    });

    test('converts values with special characters correctly', () => {
      const input = [
        'Dungeons and Secret Caves (Separately)',
        'Dungeons and Secret Caves (Together)',
      ];

      const output = Constants.createFromArray(input);

      expect(output).toEqual({
        DUNGEONS_AND_SECRET_CAVES_SEPARATELY: 'Dungeons and Secret Caves (Separately)',
        DUNGEONS_AND_SECRET_CAVES_TOGETHER: 'Dungeons and Secret Caves (Together)',
      });
    });
  });
});
