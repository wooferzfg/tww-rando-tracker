export default class Permalink {
  static _binaryFromBase64(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return Array.from(buffer.values());
  }

  static _base64FromBinary(binaryArray) {
    return Buffer.from(binaryArray).toString('base64');
  }
}
