import Permalink from './permalink';

describe('Permalink', () => {
  describe('OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.OPTIONS).toMatchSnapshot();
    });
  });

  describe('decode', () => {
    test('decodes a default permalink', () => {
      Permalink.decode('MS44LjAAeWVldAAHAQMADgBACAAAAAAAAAA=');
    });
  });
});
