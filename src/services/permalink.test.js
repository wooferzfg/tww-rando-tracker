import Permalink from './permalink';

describe('Permalink', () => {
  describe('OPTIONS', () => {
    test('returns the correct options', () => {
      expect(Permalink.OPTIONS).toMatchSnapshot();
    });
  });

  describe('_base64ToBinary', () => {
    test('returns a binary array from a base64 string', () => {
      const base64Input = 'MS44LjAAeWVl';
      const binaryArrayOutput = Permalink._base64ToBinary(base64Input);

      expect(binaryArrayOutput).toEqual([49, 46, 56, 46, 48, 0, 121, 101, 101]);
    });
  });

  describe('_binaryToBase64', () => {
    test('returns a base64 string from a binary array', () => {
      const binaryArrayInput = [49, 46, 56, 46, 48, 0, 121, 101, 101];
      const base64Output = Permalink._binaryToBase64(binaryArrayInput);

      expect(base64Output).toEqual('MS44LjAAeWVl');
    });
  });

  describe('_binaryToString', () => {
    test('returns a UTF-8 string from a binary array', () => {
      const binaryArrayInput = [49, 46, 56, 46, 48];
      const stringOutput = Permalink._binaryToString(binaryArrayInput);

      expect(stringOutput).toEqual('1.8.0');
    });
  });
});
