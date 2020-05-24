import _ from 'lodash';

export default class BinaryString {
  constructor(base64String) {
    this.binaryData = BinaryString._base64ToBinary(base64String);
    this.bitOffset = 0;
  }

  popString() {
    if (this.bitOffset !== 0) {
      throw Error('Bit offset must be 0 to pop a string');
    }

    const poppedBytes = _.takeWhile(this.binaryData, (byte) => byte !== 0);
    const poppedString = BinaryString._binaryToString(poppedBytes);

    this.binaryData = _.slice(this.binaryData, poppedBytes.length + 1);

    return poppedString;
  }

  popBoolean() {
    const firstByte = _.first(this.binaryData);
    const poppedBoolean = firstByte % 2 === 1;

    if (this.bitOffset < 7) {
      _.set(this.binaryData, 0, _.floor(firstByte / 2));
      this.bitOffset += 1;
    } else {
      this.binaryData = _.slice(this.binaryData, 1);
      this.bitOffset = 0;
    }

    return poppedBoolean;
  }

  popNumber(numBits) {
    let result = 0;
    let currentMultiplier = 1;

    for (let i = 0; i < numBits; i += 1) {
      const currentBit = this.popBoolean();
      if (currentBit) {
        result += currentMultiplier;
      }
      currentMultiplier *= 2;
    }

    return result;
  }

  toBase64() {
    return BinaryString._binaryToBase64(this.binaryData);
  }

  static _base64ToBinary(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return Array.from(buffer.values());
  }

  static _binaryToBase64(binaryArray) {
    return Buffer.from(binaryArray).toString('base64');
  }

  static _binaryToString(binaryArray) {
    return Buffer.from(binaryArray).toString();
  }
}
