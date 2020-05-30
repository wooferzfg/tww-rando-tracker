import Permalink from './permalink';

describe('Permalink', () => {
  describe('OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.OPTIONS).toMatchSnapshot();
    });
  });

  describe('DROPDOWN_OPTIONS', () => {
    test('returns the correct dropdown options', () => {
      expect(Permalink.DROPDOWN_OPTIONS).toMatchSnapshot();
    });
  });

  describe('decode', () => {
    test('decodes a permalink', () => {
      const options = Permalink.decode('MS44LjAAeWVldAAHAQMBP0DAyAAAACBQMgA=');

      expect(options).toMatchSnapshot();
    });

    test('throws errors for invalid permalinks', () => {
      expect(() => Permalink.decode('')).toThrow();
      expect(() => Permalink.decode('H')).toThrow();
      expect(() => Permalink.decode('AAAA')).toThrow();
      expect(() => Permalink.decode('BBBBBBBBBBBBBBBBBBBBBBB')).toThrow();
      expect(() => Permalink.decode('MS44LjAAeWVldAAfiwofnaslyAAAACBQMgA=')).toThrow();
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
      permalink = 'MS44LjAAeWVldAAHAQMBP0DAyAAAACBQMgA=';
      options = Permalink.decode(permalink);
    });

    test('encodes a permalink', () => {
      const encodedPermalink = Permalink.encode(options);

      expect(encodedPermalink).toEqual(permalink);
    });
  });
});
