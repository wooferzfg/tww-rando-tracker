import Settings from './settings';

describe('Settings', () => {
  afterEach(() => {
    Settings.reset();
  });

  describe('initialize', () => {
    test('initializes the flags, options, starting gear, and version', () => {
      const flags = ['Tingle Chests'];
      const options = {
        randomizeEntrances: true
      };
      const startingGear = {
        'Grappling Hook': 1
      };
      const version = '1.0.0';

      Settings.initializeManually({
        flags,
        options,
        startingGear,
        version
      });

      expect(Settings.flags).toEqual(flags);
      expect(Settings.options).toEqual(options);
      expect(Settings.startingGear).toEqual(startingGear);
      expect(Settings.version).toEqual(version);
    });
  });

  describe('isFlagActive', () => {
    beforeEach(() => {
      Settings.initializeManually({
        flags: [Settings.FLAGS.TINGLE_CHEST]
      });
    });

    describe('when the flag is in the list of flags', () => {
      test('returns true', () => {
        const isFlagActive = Settings.isFlagActive(Settings.FLAGS.TINGLE_CHEST);

        expect(isFlagActive).toEqual(true);
      });
    });

    describe('when the flag is not in the list of flags', () => {
      test('returns true', () => {
        const isFlagActive = Settings.isFlagActive(Settings.FLAGS.DUNGEON);

        expect(isFlagActive).toEqual(false);
      });
    });
  });

  describe('getOptionValue', () => {
    beforeEach(() => {
      Settings.initializeManually({
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

  describe('getStartingGear', () => {
    beforeEach(() => {
      Settings.initializeManually({
        startingGear: {
          'Deku Leaf': 1
        }
      });
    });

    test('returns the provided starting gear', () => {
      const startingGear = Settings.getStartingGear();

      expect(startingGear).toEqual({ 'Deku Leaf': 1 });
    });
  });

  describe('getVersion', () => {
    beforeEach(() => {
      Settings.initializeManually({
        version: '1.0.0'
      });
    });

    test('returns the provided version', () => {
      const version = Settings.getVersion();

      expect(version).toEqual('1.0.0');
    });
  });
});
