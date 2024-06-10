import { deflateSync, unzipSync } from 'zlib';

import _ from 'lodash';

class BinaryString {
  constructor(binaryData = [], bitOffset = 0) {
    this.#binaryData = binaryData;
    this.#bitOffset = bitOffset;
  }

  static fromBase64(compressedString) {
    const base64String = BinaryString.#decompress(compressedString);
    const binaryData = BinaryString.#base64ToBinary(base64String);
    return new BinaryString(binaryData);
  }

  toBase64() {
    const base64String = BinaryString.#binaryToBase64(this.#binaryData, this.#bitOffset);
    return BinaryString.#compress(base64String);
  }

  popString() {
    const poppedBytes = [];
    let currentByte;

    while (currentByte !== 0) {
      currentByte = this.popNumber(BinaryString.#BYTE_SIZE);

      if (currentByte !== 0) {
        poppedBytes.push(currentByte);
      }
    }

    return BinaryString.#binaryToString(poppedBytes);
  }

  popBoolean() {
    const firstByte = _.first(this.#binaryData);

    if (_.isNil(firstByte)) {
      throw Error('Tried to pop when the binary data was empty');
    }

    const poppedBoolean = firstByte % 2 === 1;

    if (this.#bitOffset < BinaryString.#BYTE_SIZE - 1) {
      _.set(this.#binaryData, 0, _.floor(firstByte / 2));
      this.#bitOffset += 1;
    } else {
      this.#binaryData = _.slice(this.#binaryData, 1);
      this.#bitOffset = 0;
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
    const bytesToAdd = BinaryString.#stringToBinary(stringValue);

    _.forEach(
      bytesToAdd,
      (byte) => this.addNumber(byte, BinaryString.#BYTE_SIZE),
    );

    this.addNumber(0, BinaryString.#BYTE_SIZE);
  }

  addBoolean(booleanValue) {
    if (this.#bitOffset > 0) {
      this.#bitOffset -= 1;

      if (booleanValue) {
        const lastByte = _.last(this.#binaryData);
        const lastIndex = this.#binaryData.length - 1;
        const newValue = 2 ** (BinaryString.#BYTE_SIZE - this.#bitOffset - 1);

        _.set(this.#binaryData, lastIndex, lastByte + newValue);
      }
    } else {
      this.#binaryData.push(booleanValue ? 1 : 0);
      this.#bitOffset = BinaryString.#BYTE_SIZE - 1;
    }
  }

  addNumber(numberValue, numBits) {
    let remainingValue = numberValue;

    for (let i = 0; i < numBits; i += 1) {
      const currentValue = remainingValue % 2 === 1;
      this.addBoolean(currentValue);

      remainingValue = _.floor(remainingValue / 2);
    }
  }

  binaryData() {
    return this.#binaryData;
  }

  bitOffset() {
    return this.#bitOffset;
  }

  clone() {
    return new BinaryString(_.clone(this.#binaryData), _.clone(this.#bitOffset));
  }

  #binaryData;

  #bitOffset;

  static #BYTE_SIZE = 8;

  static #decompress(compressedString) {
    const buffer = this.#base64StringToBuffer(compressedString);
    return unzipSync(buffer).toString('base64');
  }

  static #compress(base64String) {
    const buffer = this.#base64StringToBuffer(base64String);
    return deflateSync(buffer).toString('base64');
  }

  static #base64ToBinary(base64String) {
    const buffer = this.#base64StringToBuffer(base64String);
    return Array.from(buffer.values());
  }

  static #base64StringToBuffer(base64String) {
    return Buffer.from(base64String, 'base64');
  }

  static #binaryToBase64(binaryArray, bitOffset) {
    let binaryDataToLoad = binaryArray;
    if (bitOffset === 0) {
      // If the bit offset ends up being exactly 0, add a 0 byte to the end of
      // the binary data. This matches the behavior of permalink encoding in
      // wwrando.
      binaryDataToLoad = _.concat(binaryArray, 0);
    }

    return Buffer.from(binaryDataToLoad).toString('base64');
  }

  static #stringToBinary(utf8String) {
    const buffer = Buffer.from(utf8String);
    return Array.from(buffer.values());
  }

  static #binaryToString(binaryArray) {
    return Buffer.from(binaryArray).toString();
  }
}

export default BinaryString;
