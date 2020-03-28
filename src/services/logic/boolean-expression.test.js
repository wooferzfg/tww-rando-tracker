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
});
