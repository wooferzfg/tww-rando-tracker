import Permalink from './permalink';

describe('Permalink', () => {
  describe('OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.OPTIONS).toMatchSnapshot();
    });
  });

  describe('decode', () => {
    test('decodes a permalink', () => {
      const options = Permalink.decode('MS44LjAAeWVldAAHAQMBP0DAyAAAACBQMgA=');

      expect(options).toMatchSnapshot();
    });
  });
});
