import _ from 'lodash';

import Permalink from './permalink';
import Settings from './settings';

import FLAGS from '../data/flags';

describe('Settings', () => {
  afterEach(() => {
    Settings.reset();
  });

  describe('initializeFromPermalink', () => {
    describe('default settings', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink('MS44LjAAeWVldAAHAQMADgBACAAAAAAAAAA=');
      });

      test('initializes the version', () => {
        expect(Settings.version).toEqual('1.8.0');
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
          Settings.FLAGS.MISC
        ]);
      });
    });

    describe('all flags set', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink('MS44LjAAeWVldAD//z8ADgBACAAAAAAAAAA=');
      });

      test('initializes all the flags', () => {
        expect(_.difference(FLAGS, Settings.flags)).toEqual([]);
        expect(_.difference(Settings.flags, FLAGS)).toEqual([]);
      });
    });

    describe('all starting gear set', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink('MS44LjAAeWVldAAHAQMADgBA+P///7suAAA=');
      });

      test('initializes the starting gear', () => {
        expect(Settings.startingGear).toMatchSnapshot();
      });
    });

    describe('only sunken triforce enabled', () => {
      describe('when charts are not randomized', () => {
        beforeEach(() => {
          Settings.initializeFromPermalink('MS44LjAAeWVldAAAQAAADgBACAAAAAAAAAA=');
        });

        test('initializes the flags', () => {
          expect(Settings.flags).toEqual([
            Settings.FLAGS.SUNKEN_TRIFORCE
          ]);
        });
      });

      describe('when charts are randomized', () => {
        beforeEach(() => {
          Settings.initializeFromPermalink('MS44LjAAeWVldAAAQACADgBACAAAAAAAAAA=');
        });

        test('initializes the flags', () => {
          expect(Settings.flags).toEqual([
            Settings.FLAGS.SUNKEN_TREASURE
          ]);
        });
      });
    });
  });

  describe('initializeManually', () => {
    test('initializes the flags, options, starting gear, and version', () => {
      const flags = [Settings.FLAGS.TINGLE_CHEST];
      const options = {
        [Permalink.OPTIONS.RANDOMIZE_ENTRANCES]: true
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

  describe('FLAGS', () => {
    test('returns the correct flags', () => {
      expect(Settings.FLAGS).toMatchSnapshot();
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
          [Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: 7
        }
      });
    });

    test('returns the value of the given option', () => {
      const optionValue = Settings.getOptionValue(Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS);

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
