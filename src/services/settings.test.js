import _ from 'lodash';

import FLAGS from '../data/flags.json';

import Permalink from './permalink';
import Settings from './settings';

describe('Settings', () => {
  beforeEach(() => {
    Settings.reset();
  });

  describe('initializeFromPermalink', () => {
    describe('default settings', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink('MS4xMC4wAHllZXQABwEDAAygvgMA0AACAAAAAAGAIAAA');
      });

      test('initializes the version', () => {
        expect(Settings.version).toEqual('1.10.0');
      });

      test('initializes the starting gear', () => {
        expect(Settings.startingGear).toMatchSnapshot();
      });

      test('initializes the options', () => {
        expect(Settings.options).toMatchSnapshot();
      });

      test('initializes the flags', () => {
        expect(Settings.flags).toEqual([
          Settings.FLAGS.DUNGEON,
          Settings.FLAGS.GREAT_FAIRY,
          Settings.FLAGS.PUZZLE_SECRET_CAVE,
          Settings.FLAGS.FREE_GIFT,
          Settings.FLAGS.EXPENSIVE_PURCHASE,
          Settings.FLAGS.OTHER_CHEST,
          Settings.FLAGS.MISC,
        ]);
      });
    });

    describe('when using a development build', () => {
      beforeEach(() => {
        // version = 1.10.0_84fa5b4
        Settings.initializeFromPermalink('MS4xMC4wXzg0ZmE1YjQAeWVldAAHAQMADKC+AwDQAAIAAAAAAYAgAAA=');
      });

      test('sets the version to be the commit hash', () => {
        expect(Settings.version).toEqual('84fa5b4');
      });
    });

    describe('when using a beta build', () => {
      beforeEach(() => {
        // version = 1.10.0-BETA_2022-11-28
        Settings.initializeFromPermalink('MS4xMC4wLUJFVEFfMjAyMi0xMS0yOAB5ZWV0AAcBAwAMoL4DANAAAgAAAAABgCAAAA==');
      });

      test('sets the version to master', () => {
        expect(Settings.version).toEqual('master');
      });
    });

    describe('all flags set', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink('MS4xMC4wAHllZXQA//8/AAygvgMA0AACAAAAAAGAIAAA');
      });

      test('initializes all the flags', () => {
        expect(_.difference(FLAGS, Settings.flags)).toEqual([]);
        expect(_.difference(Settings.flags, FLAGS)).toEqual([]);
      });
    });

    describe('all starting gear set', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink('MS4xMC4wAHllZXQABwEDAAygvgMA0AD///////931QUA');
      });

      test('initializes the starting gear', () => {
        expect(Settings.startingGear).toMatchSnapshot();
      });
    });

    describe('only sunken triforce enabled', () => {
      describe('when charts are not randomized', () => {
        beforeEach(() => {
          Settings.initializeFromPermalink('MS4xMC4wAHllZXQAAEAAAAygvgMA0AACAAAAAAGAIAAA');
        });

        test('initializes the flags', () => {
          expect(Settings.flags).toEqual([
            Settings.FLAGS.SUNKEN_TRIFORCE,
          ]);
        });
      });

      describe('when charts are randomized', () => {
        beforeEach(() => {
          Settings.initializeFromPermalink('MS4xMC4wAHllZXQAAEAAgAygvgMA0AACAAAAAAGAIAAA');
        });

        test('initializes the flags', () => {
          expect(Settings.flags).toEqual([
            Settings.FLAGS.SUNKEN_TREASURE,
          ]);
        });
      });
    });
  });

  describe('initializeRaw', () => {
    test('initializes the flags, options, starting gear, and version', () => {
      const flags = [Settings.FLAGS.TINGLE_CHEST];
      const options = {
        [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: true,
      };
      const startingGear = {
        'Grappling Hook': 1,
      };
      const version = '1.0.0';

      Settings.initializeRaw({
        flags,
        options,
        startingGear,
        version,
      });

      expect(Settings.flags).toEqual(flags);
      expect(Settings.options).toEqual(options);
      expect(Settings.startingGear).toEqual(startingGear);
      expect(Settings.version).toEqual(version);
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        flags: [Settings.FLAGS.TINGLE_CHEST],
        options: {
          [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: true,
        },
        startingGear: {
          'Grappling Hook': 1,
        },
        version: '1.0.0',
      });
    });

    test('resets all the settings', () => {
      Settings.reset();

      expect(Settings.flags).toEqual(null);
      expect(Settings.options).toEqual(null);
      expect(Settings.startingGear).toEqual(null);
      expect(Settings.version).toEqual(null);
    });
  });

  describe('readAll', () => {
    let expectedFlags;
    let expectedOptions;
    let expectedStartingGear;
    let expectedVersion;

    beforeEach(() => {
      expectedFlags = [Settings.FLAGS.TINGLE_CHEST];
      expectedOptions = {
        [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: true,
      };
      expectedStartingGear = {
        'Grappling Hook': 1,
      };
      expectedVersion = '1.0.0';

      Settings.initializeRaw({
        flags: expectedFlags,
        options: expectedOptions,
        startingGear: expectedStartingGear,
        version: expectedVersion,
      });
    });

    test('returns all of the settings', () => {
      const allSettings = Settings.readAll();

      expect(allSettings).toEqual({
        flags: expectedFlags,
        options: expectedOptions,
        startingGear: expectedStartingGear,
        version: expectedVersion,
      });
    });
  });

  describe('FLAGS', () => {
    test('returns the correct flags', () => {
      expect(Settings.FLAGS).toMatchSnapshot();
    });
  });

  describe('isFlagActive', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        flags: [Settings.FLAGS.TINGLE_CHEST],
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
      Settings.initializeRaw({
        options: {
          [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 7,
        },
      });
    });

    test('returns the value of the given option', () => {
      const optionValue = Settings.getOptionValue(Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS);

      expect(optionValue).toEqual(7);
    });
  });

  describe('getStartingGear', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        startingGear: {
          'Deku Leaf': 1,
        },
      });
    });

    test('returns the provided starting gear', () => {
      const startingGear = Settings.getStartingGear();

      expect(startingGear).toEqual({ 'Deku Leaf': 1 });
    });
  });

  describe('getVersion', () => {
    beforeEach(() => {
      Settings.initializeRaw({
        version: '1.0.0',
      });
    });

    test('returns the provided version', () => {
      const version = Settings.getVersion();

      expect(version).toEqual('1.0.0');
    });
  });
});
