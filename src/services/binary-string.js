import _ from 'lodash';

export default class BinaryString {
  constructor(binaryData = [], bitOffset = 0) {
    this.binaryData = binaryData;
    this.bitOffset = bitOffset;
  }

  static fromBase64(base64String) {
    const binaryData = BinaryString._base64ToBinary(base64String);
    return new BinaryString(binaryData);
  }

  toBase64() {
    return BinaryString._binaryToBase64(this.binaryData);
  }

  popString() {
    if (this.bitOffset !== 0) {
      throw Error('Bit offset must be 0 to pop a string');
    }

    const poppedBytes = [];
    let currentByte;

    while (currentByte !== 0) {
      currentByte = this.popNumber(8);

      if (currentByte !== 0) {
        poppedBytes.push(currentByte);
      }
    }

    return BinaryString._binaryToString(poppedBytes);
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

  addString(stringValue) {
    if (this.bitOffset !== 0) {
      throw Error('Bit offset must be 0 to add a string');
    }

    const bytesToAdd = BinaryString._stringToBinary(stringValue);

    _.forEach(
      bytesToAdd,
      (byte) => this.addNumber(byte, 8)
    );
  }

  addBoolean(booleanValue) {

  }

  addNumber(numberValue, numBits) {

  }

  static _base64ToBinary(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return Array.from(buffer.values());
  }

  static _binaryToBase64(binaryArray) {
    return Buffer.from(binaryArray).toString('base64');
  }

  static _stringToBinary(utf8String) {
    const buffer = Buffer.from(utf8String);
    return Array.from(buffer.values());
  }

  static _binaryToString(binaryArray) {
    return Buffer.from(binaryArray).toString();
  }
}
