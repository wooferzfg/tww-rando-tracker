import BitString from './bit-string';

describe('BitString', () => {
  let bitString;

  describe('constructor', () => {
    test('sets the binary data and bit offset', () => {
      bitString = new BitString('MS44LjAAeWVl');

      expect(bitString.binaryData).toEqual([49, 46, 56, 46, 48, 0, 121, 101, 101]);
      expect(bitString.bitOffset).toEqual(0);
    });
  });

  describe('popString', () => {
    beforeEach(() => {
      bitString = new BitString('MS44LjAAeWVl');
    });

    test('returns the first string in the bit string', () => {
      const poppedString = bitString.popString();

      expect(poppedString).toEqual('1.8.0');
    });

    test('removes the string and trailing null character from the binary data', () => {
      bitString.popString();

      expect(bitString.binaryData).toEqual([121, 101, 101]);
      expect(bitString.bitOffset).toEqual(0);
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
