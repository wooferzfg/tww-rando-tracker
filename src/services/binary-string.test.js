import BinaryString from './binary-string';

describe('BinaryString', () => {
  let binaryString;

  beforeEach(() => {
    binaryString = new BinaryString('');
  });

  describe('constructor', () => {
    test('sets the binary data and bit offset', () => {
      binaryString = new BinaryString('MS44LjAAeWVl');

      expect(binaryString.binaryData).toEqual([49, 46, 56, 46, 48, 0, 121, 101, 101]);
      expect(binaryString.bitOffset).toEqual(0);
    });
  });

  describe('popString', () => {
    beforeEach(() => {
      binaryString = new BinaryString('MS44LjAAeWVl');
    });

    test('returns the first string in the bit string', () => {
      const poppedString = binaryString.popString();

      expect(poppedString).toEqual('1.8.0');
    });

    test('removes the string and trailing null character from the binary data', () => {
      binaryString.popString();

      expect(binaryString.binaryData).toEqual([121, 101, 101]);
      expect(binaryString.bitOffset).toEqual(0);
    });
  });

  describe('popBoolean', () => {
    describe('when the bit offset is 0', () => {
      beforeEach(() => {
        binaryString.bitOffset = 0;
      });

      describe('when the value is true', () => {
        test('removes the value from the binary data', () => {

        });
      });
    });
  });

  describe('_binaryToBase64', () => {
    test('converts a binary array to a base64 string', () => {
      const binaryArrayInput = [49, 46, 56, 46, 48, 0, 121, 101, 101];
      const base64Output = BinaryString._binaryToBase64(binaryArrayInput);

      expect(base64Output).toEqual('MS44LjAAeWVl');
    });
  });
});
