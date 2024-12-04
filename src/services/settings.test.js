import _ from 'lodash';

import FLAGS from '../data/flags.json';
import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';

import BinaryString from './binary-string';
import Locations from './locations';
import Permalink from './permalink';
import Settings from './settings';

describe('Settings', () => {
  beforeEach(() => {
    Settings.reset();
  });

  describe('initializeVersionFromPermalink', () => {
    test('initializes the version for the default settings', () => {
      Settings.initializeVersionFromPermalink(
        BinaryString.fromBase64(Permalink.DEFAULT_PERMALINK),
      );

      expect(Settings.version).toEqual('master'); // TODO: change to 1.11.0
    });

    test('initializes the version for a development build', () => {
      // version = 1.11.0_be1d4e2
      Settings.initializeVersionFromPermalink(
        BinaryString.fromBase64('eJwz1DM01DOIT0o1TDFJNWJwZPAUCGAgEkgwMPxmOqEKZjMCtTYwAABYqAdU'),
      );

      expect(Settings.version).toEqual('be1d4e2');
    });

    test('initializes the version for a beta build', () => {
      // version = 1.11.0-BETA_2022-11-28
      Settings.initializeVersionFromPermalink(
        BinaryString.fromBase64('eJwz1DM01DPQdXINcYw3MjAy0jU01DWyYHBk8BQIYCASSDAw/GY6oQpmMwK1NjAAALlcCGI='),
      );

      expect(Settings.version).toEqual('master');
    });
  });

  describe('initializeFromPermalink', () => {
    beforeEach(() => {
      Settings.initializeVersionFromPermalink(
        BinaryString.fromBase64(Permalink.DEFAULT_PERMALINK),
      );

      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
    });

    describe('default settings', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink(
          BinaryString.fromBase64(Permalink.DEFAULT_PERMALINK),
        );
      });

      test('initializes the starting gear', () => {
        expect(Settings.startingGear).toMatchSnapshot();
      });

      test('initializes the options', () => {
        expect(Settings.options).toMatchSnapshot();
      });

      test('initializes the flags', () => {
        expect(Settings.flags).toEqual([
          Settings.FLAGS.BOSS,
          Settings.FLAGS.RANDOMIZABLE_MINIBOSS_ROOM,
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

    describe('all flags set', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink(
          BinaryString.fromBase64('eJzLTSwuSS1icGT4/7+egUggwcDwm+mEKpjNCNTawAAAcGYIDw=='),
        );
      });

      test('initializes all the flags', () => {
        expect(_.difference(FLAGS, Settings.flags)).toEqual([]);
        expect(_.difference(Settings.flags, FLAGS)).toEqual([]);
      });
    });

    describe('all starting gear set', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink(
          BinaryString.fromBase64('eJzLTSwuSS1icGTwFAhgIBJIMDD8Zjrx9T8YvF/F3cAAAEUmDmc='),
        );
      });

      test('initializes the starting gear', () => {
        expect(Settings.startingGear).toMatchSnapshot();
      });
    });

    describe('only sunken triforce enabled', () => {
      describe('when charts are not randomized', () => {
        beforeEach(() => {
          Settings.initializeFromPermalink(
            BinaryString.fromBase64('eJzLTSwuSS1icGRgYGBhIBJIMDD8ZjqhCmYzArU2MAAA23cFlg=='),
          );
        });

        test('initializes the flags', () => {
          expect(Settings.flags).toEqual([
            Settings.FLAGS.SUNKEN_TRIFORCE,
          ]);
        });
      });

      describe('when charts are randomized', () => {
        beforeEach(() => {
          Settings.initializeFromPermalink(
            BinaryString.fromBase64('eJzLTSwuSS1icGRgYGBhIBJIMDT8ZjqhCmYzArU2MAAA43cGFg=='),
          );
        });

        test('initializes the flags', () => {
          expect(Settings.flags).toEqual([
            Settings.FLAGS.SUNKEN_TREASURE,
          ]);
        });
      });
    });

    describe('when some locations are excluded', () => {
      beforeEach(() => {
        Settings.initializeFromPermalink(
          BinaryString.fromBase64('eJzLTSwuSS1icGTwFAhgQAAFJDYjAxMDCpBgYPjNdEIVKunI0MAAAAh0Bl4='),
        );
      });

      test('sets the excluded locations', () => {
        // These 3 locations are excluded, so they are set to true
        expect(Settings.excludedLocations["Bird's Peak Rock"].Cave).toEqual(true);
        expect(Settings.excludedLocations['Forbidden Woods']['Double Mothula Room']).toEqual(true);
        expect(Settings.excludedLocations['Private Oasis']['Cabana Labyrinth - Upper Floor Chest']).toEqual(true);

        // All other locations should be set to false
        expect(Settings.excludedLocations['Outset Island']['Savage Labyrinth - Floor 30']).toEqual(false);
        expect(Settings.excludedLocations['Private Oasis']['Cabana Labyrinth - Lower Floor Chest']).toEqual(false);
        expect(Settings.excludedLocations['Dragon Roost Cavern']['First Room']).toEqual(false);
      });
    });
  });

  describe('initializeRaw', () => {
    test('initializes the flags, options, starting gear, and version', () => {
      const flags = [Settings.FLAGS.TINGLE_CHEST];
      const options = {
        [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
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
          [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
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
        [Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES]: true,
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
      test('returns false', () => {
        const isFlagActive = Settings.isFlagActive(Settings.FLAGS.DUNGEON);

        expect(isFlagActive).toEqual(false);
      });
    });
  });

  describe('isLocationExcluded', () => {
    beforeEach(() => {
      Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));

      Settings.initializeRaw({
        excludedLocations: Locations.mapLocations(
          (generalLocation, detailedLocation) => (
            generalLocation === 'Outset Island' && detailedLocation === 'Sunken Treasure'
          ),
        ),
      });
    });

    describe('when the location is excluded', () => {
      test('returns true', () => {
        const isLocationExcluded = Settings.isLocationExcluded('Outset Island', 'Sunken Treasure');

        expect(isLocationExcluded).toEqual(true);
      });
    });

    describe('when the location is not excluded', () => {
      test('returns false', () => {
        const isLocationExcluded = Settings.isLocationExcluded('Dragon Roost Cavern', 'First Room');

        expect(isLocationExcluded).toEqual(false);
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
