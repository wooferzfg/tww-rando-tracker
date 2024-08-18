import _ from 'lodash';

import TEST_ITEM_LOCATIONS from '../data/test-item-locations.json';

import Locations from './locations';
import Permalink from './permalink';

describe('Permalink', () => {
  beforeEach(() => {
    Locations.initialize(_.cloneDeep(TEST_ITEM_LOCATIONS));
  });

  describe('OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.OPTIONS).toMatchSnapshot();
    });
  });

  describe('MIX_ENTRANCES_OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.MIX_ENTRANCES_OPTIONS).toMatchSnapshot();
    });
  });

  describe('SWORD_MODE_OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.SWORD_MODE_OPTIONS).toMatchSnapshot();
    });
  });

  describe('DROPDOWN_OPTIONS', () => {
    test('returns the correct dropdown options', () => {
      expect(Permalink.DROPDOWN_OPTIONS).toMatchSnapshot();
    });
  });

  describe('DEFAULT_PERMALINK', () => {
    test('returns the default options', () => {
      const options = Permalink.decode(Permalink.DEFAULT_PERMALINK);

      expect(options).toMatchSnapshot();
    });
  });

  describe('decode', () => {
    test('decodes a permalink', () => {
      const options = Permalink.decode('eJzLTSwuSS1iKE5NTWHwFAhgQAAFFgjdAGIzoAHZA26/mU6wMguCOB0MBp0MAJR7Cd0=');

      expect(options).toMatchSnapshot();
    });

    test('throws errors for invalid permalinks', () => {
      expect(() => Permalink.decode('')).toThrow();
      expect(() => Permalink.decode('H')).toThrow();
      expect(() => Permalink.decode('AAAA')).toThrow();
      expect(() => Permalink.decode('BBBBBBBBBBBBBBBBBBBBBBB')).toThrow();
      expect(() => Permalink.decode('eJzLTSwuSS1icGTwFAhgIBJIMDD8ZnohBGAwMjABAPuRBZU=')).toThrow();
      expect(() => Permalink.decode('VIOEWJAFOEIWAJVEOWAIVJN')).toThrow();
      expect(() => Permalink.decode('vdsccccccccccccccccccccccccccccccccc')).toThrow();
      expect(() => Permalink.decode('AAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHH')).toThrow();
      expect(() => Permalink.decode('abcdefghijklmnopqrstuvwxyzABCDEFGHIJ')).toThrow();
      expect(() => Permalink.decode('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')).toThrow();
    });
  });

  describe('encode', () => {
    let options;
    let permalink;

    beforeEach(() => {
      permalink = 'eJzLTSwuSS1iKE5NTWHwFAhgQAAFFgjdAGIzoAHZA26/mU6wMguCOB0MBp0MAJR7Cd0=';
      options = Permalink.decode(permalink);
    });

    test('encodes a permalink', () => {
      const encodedPermalink = Permalink.encode(options);

      expect(encodedPermalink).toEqual(permalink);
    });
  });
});
