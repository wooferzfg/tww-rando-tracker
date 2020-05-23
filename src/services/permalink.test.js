import Permalink from './permalink';

describe('Permalink', () => {
  describe('_base64ToBinary', () => {
    test('returns a binary array from a base64 string', () => {
      const base64Input = 'MS44LjBfYjcy';
      const binaryArrayOutput = Permalink._base64ToBinary(base64Input);

      expect(binaryArrayOutput).toEqual([49, 46, 56, 46, 48, 95, 98, 55, 50]);
    });
  });

  describe('_binaryToBase64', () => {
    test('returns a base64 string from a binary array', () => {
      const binaryArrayInput = [49, 46, 56, 46, 48, 95, 98, 55, 50];
      const base64Output = Permalink._binaryToBase64(binaryArrayInput);

      expect(base64Output).toEqual('MS44LjBfYjcy');
    });
  });
});
