import _ from 'lodash';

import BooleanExpression from './boolean-expression';

describe('BooleanExpression', () => {
  describe('and', () => {
    test('creates a boolean expression with type "and" and the given items', () => {
      const expression = BooleanExpression.and('Apple', 'Banana', 'Coconut');

      expect(expression).toEqual(
        new BooleanExpression(['Apple', 'Banana', 'Coconut'], BooleanExpression.TYPES.AND)
      );
    });
  });

  describe('or', () => {
    test('creates a boolean expression with type "or" and the given items', () => {
      const expression = BooleanExpression.or('Apple', 'Banana', 'Coconut');

      expect(expression).toEqual(
        new BooleanExpression(['Apple', 'Banana', 'Coconut'], BooleanExpression.TYPES.OR)
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

  describe('reduce', () => {
    let expression;

    beforeEach(() => {
      expression = BooleanExpression.or(
        'Apple',
        BooleanExpression.and('Banana', 'Coconut'),
        'Durian'
      );
    });

    test('correctly reduces an expression', () => {
      const reducedExpression = expression.reduce({
        andInitialValue: '[AND]',
        andReducer: ({
          accumulator, item, isReduced, index, collection
        }) => {
          const itemString = isReduced ? `(${item})` : item;
          if (index === 0) {
            return `${accumulator} ${itemString}`;
          }
          return `${accumulator} &${collection.length}& ${itemString}`;
        },
        orInitialValue: '[OR]',
        orReducer: ({
          accumulator, item, isReduced, index, collection
        }) => {
          const itemString = isReduced ? `(${item})` : item;
          if (index === 0) {
            return `${accumulator} ${itemString}`;
          }
          return `${accumulator} |${collection.length}| ${itemString}`;
        }
      });

      expect(reducedExpression).toEqual('[OR] Apple |3| ([AND] Banana &2& Coconut) |3| Durian');
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
          'True'
        );
      });

      test('returns true', () => {
        const evaluation = expression.evaluate({
          isItemTrue: (item) => item === 'True'
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
          BooleanExpression.or('False', 'False', 'False', 'False'),
          'True'
        );
      });

      test('returns false', () => {
        const evaluation = expression.evaluate({
          isItemTrue: (item) => item === 'True'
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
        initial: BooleanExpression.or(),
        expected: BooleanExpression.or()
      });

      testSimplification('test 2', {
        initial: BooleanExpression.or('Apple', 'Banana'),
        expected: BooleanExpression.or('Apple', 'Banana')
      });

      testSimplification('test 3', {
        initial: BooleanExpression.and('Banana', 'Coconut'),
        expected: BooleanExpression.and('Banana', 'Coconut')
      });

      testSimplification('test 4', {
        initial: BooleanExpression.and(
          'Apple',
          BooleanExpression.or('Banana', 'Coconut'),
          'Durian'
        ),
        expected: BooleanExpression.and(
          'Apple',
          BooleanExpression.or('Banana', 'Coconut'),
          'Durian'
        )
      });

      testSimplification('test 5', {
        initial: BooleanExpression.and(
          BooleanExpression.or('Apple', 'Banana'),
          BooleanExpression.or('Apple', 'Coconut')
        ),
        expected: BooleanExpression.and(
          BooleanExpression.or('Apple', 'Banana'),
          BooleanExpression.or('Apple', 'Coconut')
        )
      });
    });

    describe('when the expression can be flattened', () => {
      testSimplification('test 6', {
        initial: BooleanExpression.and(
          BooleanExpression.or(),
          BooleanExpression.or()
        ),
        expected: BooleanExpression.and()
      });

      testSimplification('test 7', {
        initial: BooleanExpression.or(
          'Apple',
          BooleanExpression.or('Banana', 'Coconut')
        ),
        expected: BooleanExpression.or('Apple', 'Banana', 'Coconut')
      });

      testSimplification('test 8', {
        initial: BooleanExpression.and(
          BooleanExpression.and('Banana', 'Coconut'),
          'Apple'
        ),
        expected: BooleanExpression.and('Banana', 'Coconut', 'Apple')
      });

      testSimplification('test 9', {
        initial: BooleanExpression.or(
          'Apple',
          BooleanExpression.and(),
          BooleanExpression.or(
            BooleanExpression.and()
          )
        ),
        expected: BooleanExpression.or('Apple')
      });

      testSimplification('test 10', {
        initial: BooleanExpression.and(
          BooleanExpression.or(
            'Apple',
            'Banana',
            BooleanExpression.or(
              'Coconut',
              'Durian'
            )
          ),
          'Egg'
        ),
        expected: BooleanExpression.and(
          BooleanExpression.or(
            'Apple',
            'Banana',
            'Coconut',
            'Durian'
          ),
          'Egg'
        )
      });
    });
  });
});
