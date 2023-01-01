import Permalink from './permalink';

describe('Permalink', () => {
  describe('OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.OPTIONS).toMatchSnapshot();
    });
  });

  describe('RANDOMIZE_ENTRANCES_OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.RANDOMIZE_ENTRANCES_OPTIONS).toMatchSnapshot();
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
      const options = Permalink.decode('MS4xMC4wAHllZXQABwEDAQ2gvg8Q8AAwAAAAAABAAEgG');

      expect(options).toMatchSnapshot();
    });

    test('throws errors for invalid permalinks', () => {
      expect(() => Permalink.decode('')).toThrow();
      expect(() => Permalink.decode('H')).toThrow();
      expect(() => Permalink.decode('AAAA')).toThrow();
      expect(() => Permalink.decode('BBBBBBBBBBBBBBBBBBBBBBB')).toThrow();
      expect(() => Permalink.decode('MS4xMC4wAHllZXQfwijoi1+gIAHEAAAABAAgiAZAA==')).toThrow();
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
      permalink = 'MS4xMC4wAHllZXQABwEDAQ2gvg8Q8AAwAAAAAABAAEoG';
      options = Permalink.decode(permalink);
    });

    test('encodes a permalink', () => {
      const encodedPermalink = Permalink.encode(options);

      expect(encodedPermalink).toEqual(permalink);
    });
  });
});
