import BitString from './bit-string';

describe('BitString', () => {
  describe('_base64ToBinary', () => {
    test('converts a base64 string to a binary array', () => {
      const base64Input = 'MS44LjAAeWVl';
      const binaryArrayOutput = BitString._base64ToBinary(base64Input);

      expect(binaryArrayOutput).toEqual([49, 46, 56, 46, 48, 0, 121, 101, 101]);
    });
  });

  describe('_binaryToBase64', () => {
    test('converts a binary array to a base64 string', () => {
      const binaryArrayInput = [49, 46, 56, 46, 48, 0, 121, 101, 101];
      const base64Output = BitString._binaryToBase64(binaryArrayInput);

      expect(base64Output).toEqual('MS44LjAAeWVl');
    });
  });

  describe('_binaryToString', () => {
    test('converts a binary array to a UTF-8 string', () => {
      const binaryArrayInput = [49, 46, 56, 46, 48];
      const stringOutput = BitString._binaryToString(binaryArrayInput);

      expect(stringOutput).toEqual('1.8.0');
    });
  });
});
