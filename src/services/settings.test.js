import Settings from './settings';

describe('Settings', () => {
  afterEach(() => {
    Settings.flags = null;
    Settings.options = null;
    Settings.version = null;
  });

  describe('initialize', () => {
    test('initializes the flags, options, and version', () => {
      const flags = ['Tingle Chests'];
      const options = {
        randomizeEntrances: true
      };
      const version = '1.0.0';

      Settings.initialize({
        flags,
        options,
        version
      });

      expect(Settings.flags).toEqual(flags);
      expect(Settings.options).toEqual(options);
      expect(Settings.version).toEqual(version);
    });
  });

  describe('isFlagActive', () => {
    beforeEach(() => {
      Settings.initialize({
        flags: ['Tingle Chests']
      });
    });

    describe('when the flag is in the list of flags', () => {
      test('returns true', () => {
        const isFlagActive = Settings.isFlagActive('Tingle Chests');

        expect(isFlagActive).toEqual(true);
      });
    });

    describe('when the flag is not in the list of flags', () => {
      test('returns true', () => {
        const isFlagActive = Settings.isFlagActive('Dungeons');

        expect(isFlagActive).toEqual(false);
      });
    });
  });

  describe('getOptionValue', () => {
    beforeEach(() => {
      Settings.initialize({
        options: {
          numStartingTriforceShards: 7
        }
      });
    });

    test('returns the value of the given option', () => {
      const optionValue = Settings.getOptionValue('numStartingTriforceShards');

      expect(optionValue).toEqual(7);
    });
  });

  describe('getVersion', () => {
    beforeEach(() => {
      Settings.initialize({
        version: '1.0.0'
      });
    });

    test('returns the provided version', () => {
      const version = Settings.getVersion();

      expect(version).toEqual('1.0.0');
    });
  });
});
