import _ from 'lodash';

import BooleanExpression from './boolean-expression';

describe('BooleanExpression', () => {
  describe('and', () => {
    test('creates a boolean expression with type "and" and the given items', () => {
      const expression = BooleanExpression.and('Apple', 'Banana', 'Coconut');

      expect(expression).toEqual(
        new BooleanExpression(['Apple', 'Banana', 'Coconut'], BooleanExpression._TYPES.AND),
      );
    });
  });

  describe('or', () => {
    test('creates a boolean expression with type "or" and the given items', () => {
      const expression = BooleanExpression.or('Apple', 'Banana', 'Coconut');

      expect(expression).toEqual(
        new BooleanExpression(['Apple', 'Banana', 'Coconut'], BooleanExpression._TYPES.OR),
      );
    });
  });

  describe('isAnd', () => {
    let expression;

    describe('when the expression has type "and"', () => {
      beforeEach(() => {
        expression = BooleanExpression.and('Apple');
      });

      test('returns true', () => {
        expect(expression.isAnd()).toEqual(true);
      });
    });

    describe('when the expression has type "or"', () => {
      beforeEach(() => {
        expression = BooleanExpression.or('Apple');
      });

      test('returns false', () => {
        expect(expression.isAnd()).toEqual(false);
      });
    });
  });

  describe('isOr', () => {
    let expression;

    describe('when the expression has type "or"', () => {
      beforeEach(() => {
        expression = BooleanExpression.or('Apple');
      });

      test('returns true', () => {
        expect(expression.isOr()).toEqual(true);
      });
    });

    describe('when the expression has type "and"', () => {
      beforeEach(() => {
        expression = BooleanExpression.and('Apple');
      });

      test('returns false', () => {
        expect(expression.isOr()).toEqual(false);
      });
    });
  });

  describe('_isEqualTo', () => {
    let expression;
    let mockAreItemsEqual;

    beforeEach(() => {
      expression = BooleanExpression.or(
        BooleanExpression.and('Apple ', ' Banana'),
        'Coconut ',
      );

      mockAreItemsEqual = ({ item, otherItem }) => _.trim(item) === _.trim(otherItem);
    });

    describe('when the other object is not a boolean expression', () => {
      let otherExpression;

      beforeEach(() => {
        otherExpression = { a: '1' };
      });

      test('returns false', () => {
        const isEqualTo = expression._isEqualTo({
          otherExpression,
          areItemsEqual: mockAreItemsEqual,
        });

        expect(isEqualTo).toEqual(false);
      });
    });

    describe('when the other expression has a different type', () => {
      let otherExpression;

      beforeEach(() => {
        otherExpression = BooleanExpression.and(
          BooleanExpression.and('Apple', 'Banana'),
          'Coconut',
        );
      });

      test('returns false', () => {
        const isEqualTo = expression._isEqualTo({
          otherExpression,
          areItemsEqual: mockAreItemsEqual,
        });

        expect(isEqualTo).toEqual(false);
      });
    });

    describe('when the other expression has a different number of items', () => {
      let otherExpression;

      beforeEach(() => {
        otherExpression = BooleanExpression.or(
          BooleanExpression.and('Apple', 'Banana'),
        );
      });

      test('returns false', () => {
        const isEqualTo = expression._isEqualTo({
          otherExpression,
          areItemsEqual: mockAreItemsEqual,
        });

        expect(isEqualTo).toEqual(false);
      });
    });

    describe('when the other expression has a different shallow item', () => {
      let otherExpression;

      beforeEach(() => {
        otherExpression = BooleanExpression.or(
          BooleanExpression.and('Apple', 'Banana'),
          'Durian',
        );
      });

      test('returns false', () => {
        const isEqualTo = expression._isEqualTo({
          otherExpression,
          areItemsEqual: mockAreItemsEqual,
        });

        expect(isEqualTo).toEqual(false);
      });
    });

    describe('when the other expression has a different deep item', () => {
      let otherExpression;

      beforeEach(() => {
        otherExpression = BooleanExpression.or(
          BooleanExpression.and('Apple', 'Durian'),
          'Coconut',
        );
      });

      test('returns false', () => {
        const isEqualTo = expression._isEqualTo({
          otherExpression,
          areItemsEqual: mockAreItemsEqual,
        });

        expect(isEqualTo).toEqual(false);
      });
    });

    describe('when the expressions have the same items in a different order', () => {
      let otherExpression;

      beforeEach(() => {
        otherExpression = BooleanExpression.or(
          'Coconut',
          BooleanExpression.and('Banana', 'Apple'),
        );
      });

      test('returns true', () => {
        const isEqualTo = expression._isEqualTo({
          otherExpression,
          areItemsEqual: mockAreItemsEqual,
        });

        expect(isEqualTo).toEqual(true);
      });
    });

    describe('when the expressions are identical', () => {
      let otherExpression;

      beforeEach(() => {
        otherExpression = BooleanExpression.or(
          BooleanExpression.and('Apple', 'Banana'),
          'Coconut',
        );
      });

      test('returns true', () => {
        const isEqualTo = expression._isEqualTo({
          otherExpression,
          areItemsEqual: mockAreItemsEqual,
        });

        expect(isEqualTo).toEqual(true);
      });
    });
  });

  describe('reduce', () => {
    let expression;

    beforeEach(() => {
      expression = BooleanExpression.or(
        'Apple',
        BooleanExpression.and(
          'Banana',
          BooleanExpression.or('Coconut', 'Egg'),
          'Durian',
        ),
      );
    });

    test('correctly reduces an expression', () => {
      const reducedExpression = expression.reduce({
        andInitialValue: '[AND]',
        andReducer: ({
          accumulator, item, isReduced, index, collection,
        }) => {
          const itemString = isReduced ? `(${item})` : item;
          if (index === 0) {
            return `${accumulator} ${itemString}`;
          }
          return `${accumulator} &${collection.length}& ${itemString}`;
        },
        orInitialValue: '[OR]',
        orReducer: ({
          accumulator, item, isReduced, index, collection,
        }) => {
          const itemString = isReduced ? `(${item})` : item;
          if (index === 0) {
            return `${accumulator} ${itemString}`;
          }
          return `${accumulator} |${collection.length}| ${itemString}`;
        },
      });

      expect(reducedExpression).toEqual('[OR] Apple |2| ([AND] Banana &3& ([OR] Coconut |2| Egg) &3& Durian)');
    });
  });

  describe('evaluate', () => {
    describe('when the expression is true', () => {
      let expression;

      beforeEach(() => {
        expression = BooleanExpression.and(
          BooleanExpression.and('True', 'True'),
          'True',
          BooleanExpression.or('False', 'False', 'True', 'False'),
          'True',
        );
      });

      test('returns true', () => {
        const evaluation = expression.evaluate({
          isItemTrue: (item) => item === 'True',
        });

        expect(evaluation).toEqual(true);
      });
    });

    describe('when the expression is false', () => {
      let expression;

      beforeEach(() => {
        expression = BooleanExpression.and(
          BooleanExpression.and('True', 'True'),
          'True',
          BooleanExpression.or(
            'False',
            'False',
            BooleanExpression.and('True', 'False'),
            'False',
          ),
          'True',
        );
      });

      test('returns false', () => {
        const evaluation = expression.evaluate({
          isItemTrue: (item) => item === 'True',
        });

        expect(evaluation).toEqual(false);
      });
    });
  });

  describe('simplify', () => {
    let mockImplies;

    beforeAll(() => {
      mockImplies = (first, second) => {
        if (first === 'Never') {
          return true;
        }
        if (second === 'Always') {
          return true;
        }
        if (first === second) {
          return true;
        }

        const quantifiedItemRegex = /(\d+)x (\w+)/;
        const firstMatch = first.match(quantifiedItemRegex);
        const secondMatch = second.match(quantifiedItemRegex);

        if (firstMatch && secondMatch) {
          return firstMatch[2] === secondMatch[2]
            && _.toSafeInteger(firstMatch[1]) > _.toSafeInteger(secondMatch[1]);
        }
        return false;
      };

      expect(mockImplies('6x Apple', '5x Apple')).toEqual(true);
      expect(mockImplies('5x Apple', '5x Apple')).toEqual(true);
      expect(mockImplies('Banana', 'Banana')).toEqual(true);
      expect(mockImplies('6x Apple', 'Always')).toEqual(true);
      expect(mockImplies('Banana', 'Always')).toEqual(true);
      expect(mockImplies('Never', '6x Apple')).toEqual(true);
      expect(mockImplies('Never', 'Banana')).toEqual(true);

      expect(mockImplies('4x Apple', '5x Apple')).toEqual(false);
      expect(mockImplies('6x Apple', '5x Banana')).toEqual(false);
      expect(mockImplies('Banana', 'Coconut')).toEqual(false);
      expect(mockImplies('Always', '6x Apple')).toEqual(false);
      expect(mockImplies('Always', 'Banana')).toEqual(false);
      expect(mockImplies('6x Apple', 'Never')).toEqual(false);
      expect(mockImplies('Banana', 'Never')).toEqual(false);
    });

    const testSimplification = (message, { initial, expected }) => {
      test(message, () => {
        const simplified = initial.simplify({ implies: mockImplies });

        expect(simplified).toEqual(expected);
      });
    };

    describe('when the expression cannot be simplified', () => {
      testSimplification('test 1', {
        initial: BooleanExpression.and(),
        expected: BooleanExpression.and(),
      });

      testSimplification('test 2', {
        initial: BooleanExpression.or('Apple', 'Banana'),
        expected: BooleanExpression.or('Apple', 'Banana'),
      });

      testSimplification('test 3', {
        initial: BooleanExpression.and('Banana', 'Coconut'),
        expected: BooleanExpression.and('Banana', 'Coconut'),
      });

      testSimplification('test 4', {
        initial: BooleanExpression.and(
          'Apple',
          BooleanExpression.or('Banana', 'Coconut'),
          'Durian',
        ),
        expected: BooleanExpression.and(
          'Apple',
          BooleanExpression.or('Banana', 'Coconut'),
          'Durian',
        ),
      });

      testSimplification('test 5', {
        initial: BooleanExpression.and(
          BooleanExpression.or('Apple', 'Banana'),
          BooleanExpression.or('Apple', 'Coconut'),
        ),
        expected: BooleanExpression.and(
          BooleanExpression.or('Apple', 'Banana'),
          BooleanExpression.or('Apple', 'Coconut'),
        ),
      });
    });

    describe('when the expression can be flattened', () => {
      testSimplification('test 6', {
        initial: BooleanExpression.and(
          BooleanExpression.or(),
          BooleanExpression.or(),
        ),
        expected: BooleanExpression.and(),
      });

      testSimplification('test 7', {
        initial: BooleanExpression.or(),
        expected: BooleanExpression.and(),
      });

      testSimplification('test 8', {
        initial: BooleanExpression.or('Apple'),
        expected: BooleanExpression.and('Apple'),
      });

      testSimplification('test 9', {
        initial: BooleanExpression.or(
          BooleanExpression.and('Apple'),
        ),
        expected: BooleanExpression.and('Apple'),
      });

      testSimplification('test 10', {
        initial: BooleanExpression.and(
          BooleanExpression.or(
            BooleanExpression.and('Apple'),
          ),
        ),
        expected: BooleanExpression.and('Apple'),
      });

      testSimplification('test 11', {
        initial: BooleanExpression.and(
          BooleanExpression.or('Apple', 'Banana'),
        ),
        expected: BooleanExpression.or('Apple', 'Banana'),
      });

      testSimplification('test 12', {
        initial: BooleanExpression.or(
          'Apple',
          BooleanExpression.or('Banana', 'Coconut'),
        ),
        expected: BooleanExpression.or('Apple', 'Banana', 'Coconut'),
      });

      testSimplification('test 13', {
        initial: BooleanExpression.and(
          BooleanExpression.and('Banana', 'Coconut'),
          'Apple',
        ),
        expected: BooleanExpression.and('Banana', 'Coconut', 'Apple'),
      });

      testSimplification('test 14', {
        initial: BooleanExpression.or(
          'Apple',
          BooleanExpression.and(),
          BooleanExpression.or(
            BooleanExpression.and(),
          ),
        ),
        expected: BooleanExpression.and('Apple'),
      });

      testSimplification('test 15', {
        initial: BooleanExpression.and(
          BooleanExpression.or(
            'Apple',
            'Banana',
            BooleanExpression.or(
              'Coconut',
              'Durian',
            ),
          ),
          'Egg',
        ),
        expected: BooleanExpression.and(
          BooleanExpression.or(
            'Apple',
            'Banana',
            'Coconut',
            'Durian',
          ),
          'Egg',
        ),
      });
    });

    describe('when there are duplicate items in the same expression', () => {
      testSimplification('test 16', {
        initial: BooleanExpression.and(
          'Apple',
          'Banana',
          'Banana',
        ),
        expected: BooleanExpression.and(
          'Apple',
          'Banana',
        ),
      });

      testSimplification('test 17', {
        initial: BooleanExpression.or(
          BooleanExpression.and(
            'Apple',
            'Apple',
            'Banana',
          ),
          BooleanExpression.and(
            'Durian',
            'Durian',
          ),
        ),
        expected: BooleanExpression.or(
          BooleanExpression.and(
            'Apple',
            'Banana',
          ),
          'Durian',
        ),
      });

      testSimplification('test 18', {
        initial: BooleanExpression.or(
          '5x Apple',
          '6x Apple',
        ),
        expected: BooleanExpression.and(
          '5x Apple',
        ),
      });

      testSimplification('test 19', {
        initial: BooleanExpression.and(
          '5x Apple',
          '6x Apple',
        ),
        expected: BooleanExpression.and(
          '6x Apple',
        ),
      });

      testSimplification('test 20', {
        initial: BooleanExpression.or(
          '5x Apple',
          '6x Apple',
          'Never',
        ),
        expected: BooleanExpression.and(
          '5x Apple',
        ),
      });

      testSimplification('test 21', {
        initial: BooleanExpression.or(
          '5x Apple',
          '6x Apple',
          'Always',
        ),
        expected: BooleanExpression.and(
          'Always',
        ),
      });

      testSimplification('test 22', {
        initial: BooleanExpression.and(
          '5x Apple',
          '6x Apple',
          'Never',
        ),
        expected: BooleanExpression.and(
          'Never',
        ),
      });

      testSimplification('test 23', {
        initial: BooleanExpression.and(
          '5x Apple',
          '6x Apple',
          'Always',
        ),
        expected: BooleanExpression.and(
          '6x Apple',
        ),
      });
    });

    describe('when an expression is a duplicate of another', () => {
      testSimplification('test 24', {
        initial: BooleanExpression.and(
          BooleanExpression.or('Apple'),
          BooleanExpression.or('Apple'),
        ),
        expected: BooleanExpression.and(
          'Apple',
        ),
      });

      testSimplification('test 25', {
        initial: BooleanExpression.or(
          BooleanExpression.and('Apple', 'Banana'),
          BooleanExpression.and('Apple', 'Banana'),
        ),
        expected: BooleanExpression.and('Apple', 'Banana'),
      });

      testSimplification('test 26', {
        initial: BooleanExpression.or(
          BooleanExpression.and('Apple', 'Banana', 'Coconut'),
          BooleanExpression.and('Apple', 'Banana'),
        ),
        expected: BooleanExpression.and('Apple', 'Banana'),
      });

      testSimplification('test 27', {
        initial: BooleanExpression.or(
          BooleanExpression.and('Apple', '5x Banana', 'Coconut'),
          BooleanExpression.and('Apple', '4x Banana'),
        ),
        expected: BooleanExpression.and('Apple', '4x Banana'),
      });

      testSimplification('test 28', {
        initial: BooleanExpression.and(
          BooleanExpression.or('3x Apple', '7x Banana', 'Coconut'),
          BooleanExpression.or('2x Apple', '4x Banana'),
          BooleanExpression.or('5x Apple', '6x Banana'),
          BooleanExpression.or('4x Apple', '5x Banana', 'Durian'),
        ),
        expected: BooleanExpression.and(
          BooleanExpression.or('3x Apple', '7x Banana', 'Coconut'),
          BooleanExpression.or('5x Apple', '6x Banana'),
        ),
      });

      testSimplification('test 29', {
        initial: BooleanExpression.or(
          BooleanExpression.and(
            BooleanExpression.or('Apple', 'Banana'),
            BooleanExpression.or('Apple', 'Banana', 'Coconut'),
            BooleanExpression.or('Eclair', 'Fruit'),
          ),
          'Durian',
        ),
        expected: BooleanExpression.or(
          BooleanExpression.and(
            BooleanExpression.or('Apple', 'Banana'),
            BooleanExpression.or('Eclair', 'Fruit'),
          ),
          'Durian',
        ),
      });

      testSimplification('test 30', {
        initial: BooleanExpression.and(
          BooleanExpression.or(
            'Apple',
            BooleanExpression.and('Banana', 'Eclair'),
            'Durian',
          ),
          BooleanExpression.or(
            'Apple',
            BooleanExpression.and('Banana', 'Coconut'),
            'Durian',
          ),
          BooleanExpression.or(
            'Apple',
            BooleanExpression.and('Banana', 'Coconut'),
            'Durian',
          ),
        ),
        expected: BooleanExpression.and(
          BooleanExpression.or(
            'Apple',
            BooleanExpression.and('Banana', 'Eclair'),
            'Durian',
          ),
          BooleanExpression.or(
            'Apple',
            BooleanExpression.and('Banana', 'Coconut'),
            'Durian',
          ),
        ),
      });
    });

    describe('when children are duplicates of parents', () => {
      testSimplification('test 31', {
        initial: BooleanExpression.and(
          'Apple',
          'Banana',
          BooleanExpression.or(
            'Coconut',
            BooleanExpression.and('Apple', 'Banana'),
          ),
        ),
        expected: BooleanExpression.and('Apple', 'Banana'),
      });

      testSimplification('test 32', {
        initial: BooleanExpression.or(
          'Apple',
          'Banana',
          BooleanExpression.and(
            'Coconut',
            BooleanExpression.or('Apple', 'Banana'),
          ),
        ),
        expected: BooleanExpression.or('Apple', 'Banana'),
      });

      testSimplification('test 33', {
        initial: BooleanExpression.and(
          'Apple',
          'Banana',
          BooleanExpression.or('Banana', 'Coconut'),
        ),
        expected: BooleanExpression.and('Apple', 'Banana'),
      });

      testSimplification('test 34', {
        initial: BooleanExpression.or(
          'Apple',
          'Banana',
          BooleanExpression.and('Banana', 'Coconut'),
        ),
        expected: BooleanExpression.or('Apple', 'Banana'),
      });

      testSimplification('test 35', {
        initial: BooleanExpression.and(
          'Apple',
          'Banana',
          BooleanExpression.or(
            'Coconut',
            BooleanExpression.and('Apple', 'Durian'),
          ),
        ),
        expected: BooleanExpression.and(
          'Apple',
          'Banana',
          BooleanExpression.or(
            'Coconut',
            'Durian',
          ),
        ),
      });

      testSimplification('test 36', {
        initial: BooleanExpression.or(
          'Apple',
          'Banana',
          BooleanExpression.and(
            'Coconut',
            BooleanExpression.or('Apple', 'Durian'),
          ),
        ),
        expected: BooleanExpression.or(
          'Apple',
          'Banana',
          BooleanExpression.and(
            'Coconut',
            'Durian',
          ),
        ),
      });

      testSimplification('test 37', {
        initial: BooleanExpression.and(
          'Apple',
          'Banana',
          BooleanExpression.or(
            'Coconut',
            BooleanExpression.and('Apple', 'Coconut'),
          ),
        ),
        expected: BooleanExpression.and('Apple', 'Banana', 'Coconut'),
      });

      testSimplification('test 38', {
        initial: BooleanExpression.or(
          'Apple',
          'Banana',
          BooleanExpression.and(
            'Coconut',
            BooleanExpression.or('Apple', 'Coconut'),
          ),
        ),
        expected: BooleanExpression.or('Apple', 'Banana', 'Coconut'),
      });

      testSimplification('test 39', {
        initial: BooleanExpression.and(
          'Apple',
          'Banana',
          BooleanExpression.or(
            'Coconut',
            BooleanExpression.and('Apple', 'Coconut', 'Durian'),
          ),
        ),
        expected: BooleanExpression.and('Apple', 'Banana', 'Coconut'),
      });

      testSimplification('test 40', {
        initial: BooleanExpression.or(
          'Apple',
          'Banana',
          BooleanExpression.and(
            'Coconut',
            BooleanExpression.or('Apple', 'Coconut', 'Durian'),
          ),
        ),
        expected: BooleanExpression.or('Apple', 'Banana', 'Coconut'),
      });

      testSimplification('test 41', {
        initial: BooleanExpression.and(
          'Apple',
          'Banana',
          BooleanExpression.or(
            'Apple',
            BooleanExpression.and('Apple', 'Banana'),
          ),
        ),
        expected: BooleanExpression.and('Apple', 'Banana'),
      });

      testSimplification('test 42', {
        initial: BooleanExpression.or(
          'Apple',
          'Banana',
          BooleanExpression.and(
            'Apple',
            BooleanExpression.or('Apple', 'Banana'),
          ),
        ),
        expected: BooleanExpression.or('Apple', 'Banana'),
      });

      testSimplification('test 43', {
        initial: BooleanExpression.and(
          '5x Apple',
          '5x Banana',
          BooleanExpression.or('4x Apple', '4x Banana'),
        ),
        expected: BooleanExpression.and('5x Apple', '5x Banana'),
      });

      testSimplification('test 44', {
        initial: BooleanExpression.or(
          '5x Apple',
          '5x Banana',
          BooleanExpression.and('6x Apple', '6x Banana'),
        ),
        expected: BooleanExpression.or('5x Apple', '5x Banana'),
      });

      testSimplification('test 45', {
        initial: BooleanExpression.and(
          '5x Apple',
          '5x Banana',
          BooleanExpression.or(
            'Coconut',
            BooleanExpression.and('4x Apple', '6x Banana'),
          ),
        ),
        expected: BooleanExpression.and(
          '5x Apple',
          '5x Banana',
          BooleanExpression.or('Coconut', '6x Banana'),
        ),
      });

      testSimplification('test 46', {
        initial: BooleanExpression.or(
          '5x Apple',
          '5x Banana',
          BooleanExpression.and(
            'Coconut',
            BooleanExpression.or('4x Apple', '6x Banana'),
          ),
        ),
        expected: BooleanExpression.or(
          '5x Apple',
          '5x Banana',
          BooleanExpression.and('Coconut', '4x Apple'),
        ),
      });

      testSimplification('test 47', {
        initial: BooleanExpression.and(
          'Apple',
          BooleanExpression.or('Always', 'Banana'),
        ),
        expected: BooleanExpression.and('Apple'),
      });

      testSimplification('test 48', {
        initial: BooleanExpression.or(
          'Apple',
          BooleanExpression.and('Never', 'Banana'),
        ),
        expected: BooleanExpression.and('Apple'),
      });
    });
  });
});
