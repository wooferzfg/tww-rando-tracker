import Permalink from './permalink';

describe('Permalink', () => {
  describe('_binaryFromBase64', () => {
    test('returns a binary array from a base64 string', () => {
      const base64Input = 'MS44LjBfYjcy';
      const binaryArrayOutput = Permalink._binaryFromBase64(base64Input);

      expect(binaryArrayOutput).toEqual([49, 46, 56, 46, 48, 95, 98, 55, 50]);
    });
  });

  describe('_base64FromBinary', () => {
    test('returns a base64 string from a binary array', () => {
      const binaryArrayInput = [49, 46, 56, 46, 48, 95, 98, 55, 50];
      const base64Output = Permalink._base64FromBinary(binaryArrayInput);

      expect(base64Output).toEqual('MS44LjBfYjcy');
    });
  });
});
