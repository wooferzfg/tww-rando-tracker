import BinaryString from './binary-string';

describe('BinaryString', () => {
  let binaryString;

  beforeEach(() => {
    binaryString = new BinaryString();
  });

  describe('fromBase64', () => {
    test('sets the binary data and bit offset', () => {
      binaryString = BinaryString.fromBase64('MS44LjAAeWVl');

      expect(binaryString.binaryData).toEqual([49, 46, 56, 46, 48, 0, 121, 101, 101]);
      expect(binaryString.bitOffset).toEqual(0);
    });
  });

  describe('toBase64', () => {
    beforeEach(() => {
      binaryString.binaryData = [49, 46, 56, 46, 48, 0, 121, 101, 101];
      binaryString.bitOffset = 0;
    });

    test('returns the correct base64 string', () => {
      const base64Output = binaryString.toBase64();

      expect(base64Output).toEqual('MS44LjAAeWVl');
    });
  });

  describe('popString', () => {
    beforeEach(() => {
      binaryString = BinaryString.fromBase64('MS44LjAAeWVl');
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
    describe('when the bit offset is at the start of a byte', () => {
      beforeEach(() => {
        binaryString.bitOffset = 0;
      });

      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString.binaryData = [129]; // 129 = 1000000[1]
        });

        test('returns true', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(true);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData).toEqual([64]);
          expect(binaryString.bitOffset).toEqual(1);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString.binaryData = [128]; // 128 = 1000000[0]
        });

        test('returns false', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(false);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData).toEqual([64]);
          expect(binaryString.bitOffset).toEqual(1);
        });
      });
    });

    describe('when the bit offset is in the middle of a byte', () => {
      beforeEach(() => {
        binaryString.bitOffset = 3;
      });

      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString.binaryData = [13]; // 13 = 0110[1]
        });

        test('returns true', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(true);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData).toEqual([6]);
          expect(binaryString.bitOffset).toEqual(4);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString.binaryData = [14]; // 14 = 0111[0]
        });

        test('returns false', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(false);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData).toEqual([7]);
          expect(binaryString.bitOffset).toEqual(4);
        });
      });
    });

    describe('when the bit offset is at the end of a byte', () => {
      beforeEach(() => {
        binaryString.bitOffset = 7;
      });

      describe('when the value is true', () => {
        beforeEach(() => {
          binaryString.binaryData = [1, 65];
        });

        test('returns true', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(true);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData).toEqual([65]);
          expect(binaryString.bitOffset).toEqual(0);
        });
      });

      describe('when the value is false', () => {
        beforeEach(() => {
          binaryString.binaryData = [0, 67];
        });

        test('returns false', () => {
          const poppedBoolean = binaryString.popBoolean();

          expect(poppedBoolean).toEqual(false);
        });

        test('removes the value from the binary data', () => {
          binaryString.popBoolean();

          expect(binaryString.binaryData).toEqual([67]);
          expect(binaryString.bitOffset).toEqual(0);
        });
      });
    });
  });

  describe('popNumber', () => {
    describe('when a number is contained within a byte', () => {
      beforeEach(() => {
        binaryString.bitOffset = 1;
        binaryString.binaryData = [82]; // 82 = 10[10010]
      });

      test('returns the correct number', () => {
        const poppedNumber = binaryString.popNumber(5);

        expect(poppedNumber).toEqual(18);
      });

      test('removes the number from the binary data', () => {
        binaryString.popNumber(5);

        expect(binaryString.binaryData).toEqual([2]);
        expect(binaryString.bitOffset).toEqual(6);
      });
    });

    describe('when a number is spread across multiple bytes', () => {
      beforeEach(() => {
        binaryString.bitOffset = 6;
        binaryString.binaryData = [2, 190]; // 2 = [10], 190 = 1011[1110]
      });

      test('returns the correct number', () => {
        const poppedNumber = binaryString.popNumber(6);

        expect(poppedNumber).toEqual(58); // 58 = 111010
      });

      test('removes the number from the binary data', () => {
        binaryString.popNumber(6);

        expect(binaryString.binaryData).toEqual([11]);
        expect(binaryString.bitOffset).toEqual(4);
      });
    });
  });
});
