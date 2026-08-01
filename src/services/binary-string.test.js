import BinaryString from './binary-string';

describe('BinaryString', () => {
  let binaryString;

  beforeEach(() => {
    binaryString = new BinaryString();
  });

  describe('fromBase64', () => {
    test('sets the binary data and bit offset', () => {
      binaryString = BinaryString.fromBase64('MS44LjAAeWVl');

      expect(binaryString.binaryData()).toEqual([49, 46, 56, 46, 48, 0, 121, 101, 101]);
      expect(binaryString.bitOffset()).toEqual(0);
    });
  });

  describe('toBase64', () => {
    describe('when the bit offset is not 0', () => {
      beforeEach(() => {
        binaryString = new BinaryString([49, 46, 56, 46, 48, 0, 121, 101, 101], 1);
      });

      test('returns the correct base64 string without extra padding', () => {
        const base64Output = binaryString.toBase64();

        expect(base64Output).toEqual('MS44LjAAeWVl');
      });
    });

    describe('when the bit offset is 0', () => {
      beforeEach(() => {
        binaryString = new BinaryString(
          [
            49, 46, 49, 48, 46, 48, 0, 121, 101,
            101, 116, 0, 7, 1, 3, 1, 109, 126,
            128, 128, 7, 192, 0, 0, 0, 0, 0,
            1, 40, 25,
          ],
          0,
        );
      });

      test('returns the correct base64 string with a zero byte at the end', () => {
        const base64Output = binaryString.toBase64();

        expect(base64Output).toEqual('MS4xMC4wAHllZXQABwEDAW1+gIAHwAAAAAAAASgZAA==');
      });
    });
  });

  describe('popString', () => {
    beforeEach(() => {
      binaryString = BinaryString.fromBase64('MS44LjAAeWVl'); // 1.8.0 yee
    });

    test('returns the first string in the bit string', () => {
      const poppedString = binaryString.popString();

      expect(poppedString).toEqual('1.8.0');
    });

    test('removes the string and trailing null character from the binary data', () => {
      binaryString.popString();

      expect(binaryString.binaryData()).toEqual([121, 101, 101]); // yee
      expect(binaryString.bitOffset()).toEqual(0);
    });

    describe('when the binary string is empty', () => {
      beforeEach(() => {
        binaryString = new BinaryString([], 0);
      });

      test('throws an error', () => {
        expect(() => binaryString.popString()).toThrow();
      });
    });
  });

  describe('popBoolean', () => {
    describe('when the bit offset is at the start of a byte', () => {
      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString = new BinaryString([129], 0); // 129 = 1000000[1]
        });

        test('returns true', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(true);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData()).toEqual([64]); // 64 = 1000000
          expect(binaryString.bitOffset()).toEqual(1);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString = new BinaryString([128], 0); // 128 = 1000000[0]
        });

        test('returns false', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(false);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData()).toEqual([64]); // 64 = 1000000
          expect(binaryString.bitOffset()).toEqual(1);
        });
      });
    });

    describe('when the bit offset is in the middle of a byte', () => {
      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString = new BinaryString([13], 3); // 13 = 0110[1]
        });

        test('returns true', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(true);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData()).toEqual([6]); // 6 = 0110
          expect(binaryString.bitOffset()).toEqual(4);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString = new BinaryString([14], 3); // 14 = 0111[0]
        });

        test('returns false', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(false);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData()).toEqual([7]); // 7 = 0111
          expect(binaryString.bitOffset()).toEqual(4);
        });
      });
    });

    describe('when the bit offset is at the end of a byte', () => {
      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString = new BinaryString([1, 65], 7);
        });

        test('returns true', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(true);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData()).toEqual([65]);
          expect(binaryString.bitOffset()).toEqual(0);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString = new BinaryString([0, 67], 7);
        });

        test('returns false', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(false);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData()).toEqual([67]);
          expect(binaryString.bitOffset()).toEqual(0);
        });
      });
    });

    describe('when the binary string is empty', () => {
      beforeEach(() => {
        binaryString = new BinaryString([], 0);
      });

      test('throws an error', () => {
        expect(() => binaryString.popBoolean()).toThrow();
      });
    });
  });

  describe('popNumber', () => {
    describe('when a number is contained within a byte', () => {
      beforeEach(() => {
        binaryString = new BinaryString([82], 1); // 82 = 10[10010]
      });

      test('returns the correct number', () => {
        const poppedNumber = binaryString.popNumber(5);

        expect(poppedNumber).toEqual(18);
      });

      test('removes the number from the binary data', () => {
        binaryString.popNumber(5);

        expect(binaryString.binaryData()).toEqual([2]); // 2 = 10
        expect(binaryString.bitOffset()).toEqual(6);
      });
    });

    describe('when a number is spread across multiple bytes', () => {
      beforeEach(() => {
        binaryString = new BinaryString([2, 190], 6); // 2 = [10], 190 = 1011[1110]
      });

      test('returns the correct number', () => {
        const poppedNumber = binaryString.popNumber(6);

        expect(poppedNumber).toEqual(58); // 58 = 111010
      });

      test('removes the number from the binary data', () => {
        binaryString.popNumber(6);

        expect(binaryString.binaryData()).toEqual([11]); // 11 = 1011
        expect(binaryString.bitOffset()).toEqual(4);
      });
    });

    describe('when the binary string is empty', () => {
      beforeEach(() => {
        binaryString = new BinaryString([], 0);
      });

      test('throws an error', () => {
        expect(() => binaryString.popNumber(5)).toThrow();
      });
    });
  });

  describe('addString', () => {
    describe('when the binary data is empty', () => {
      beforeEach(() => {
        binaryString = new BinaryString([], 0);
      });

      test('adds the string to the binary data', () => {
        binaryString.addString('yeet');

        expect(binaryString.binaryData()).toEqual([121, 101, 101, 116, 0]);
        expect(binaryString.bitOffset()).toEqual(0);
      });
    });

    describe('when the binary data is not empty', () => {
      beforeEach(() => {
        binaryString = new BinaryString([49, 46, 56, 46, 48, 0], 0);
      });

      test('adds the string to the binary data', () => {
        binaryString.addString('yeet');

        expect(binaryString.binaryData()).toEqual([49, 46, 56, 46, 48, 0, 121, 101, 101, 116, 0]);
        expect(binaryString.bitOffset()).toEqual(0);
      });
    });
  });

  describe('addBoolean', () => {
    describe('when the bit offset is at the start of a byte', () => {
      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString = new BinaryString([70], 0);
        });

        test('adds the value to the binary data', () => {
          binaryString.addBoolean(true);

          expect(binaryString.binaryData()).toEqual([70, 1]);
          expect(binaryString.bitOffset()).toEqual(7);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString = new BinaryString([70], 0);
        });

        test('adds the value to the binary data', () => {
          binaryString.addBoolean(false);

          expect(binaryString.binaryData()).toEqual([70, 0]);
          expect(binaryString.bitOffset()).toEqual(7);
        });
      });
    });

    describe('when the bit offset is in the middle of a byte', () => {
      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString = new BinaryString([13], 3); // 13 = 01101
        });

        test('adds the value to the binary data', () => {
          binaryString.addBoolean(true);

          expect(binaryString.binaryData()).toEqual([45]); // 45 = [1]01101
          expect(binaryString.bitOffset()).toEqual(2);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString = new BinaryString([13], 3); // 13 = 01101
        });

        test('adds the value to the binary data', () => {
          binaryString.addBoolean(false);

          expect(binaryString.binaryData()).toEqual([13]);
          expect(binaryString.bitOffset()).toEqual(2);
        });
      });
    });

    describe('when the bit offset is at the end of a byte', () => {
      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString = new BinaryString([99], 1); // 99 = 1100011
        });

        test('adds the value to the binary data', () => {
          binaryString.addBoolean(true);

          expect(binaryString.binaryData()).toEqual([227]); // 227 = [1]1100011
          expect(binaryString.bitOffset()).toEqual(0);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString = new BinaryString([99], 1); // 13 = 01101
        });

        test('adds the value to the binary data', () => {
          binaryString.addBoolean(false);

          expect(binaryString.binaryData()).toEqual([99]);
          expect(binaryString.bitOffset()).toEqual(0);
        });
      });
    });
  });

  describe('addNumber', () => {
    describe('when a number is contained within a byte', () => {
      beforeEach(() => {
        binaryString = new BinaryString([2], 6); // 2 = 10
      });

      test('adds the number to the binary data', () => {
        binaryString.addNumber(18, 5); // 18 = 10010

        expect(binaryString.binaryData()).toEqual([74]); // 74 = [10010]10
        expect(binaryString.bitOffset()).toEqual(1);
      });
    });

    describe('when a number is spread across multiple bytes', () => {
      beforeEach(() => {
        binaryString = new BinaryString([11], 4); // 11 = 1011
      });

      test('adds the number to the binary data', () => {
        binaryString.addNumber(58, 6); // 58 = 111010

        expect(binaryString.binaryData()).toEqual([171, 3]); // 171 = [1010]1011, 3 = [11]
        expect(binaryString.bitOffset()).toEqual(6);
      });
    });
  });
});
