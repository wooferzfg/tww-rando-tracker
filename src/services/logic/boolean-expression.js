import _ from 'lodash';

export default class BooleanExpression {
  constructor(items, type) {
    this.items = items;
    this.type = type;
  }

  static get TYPES() {
    return {
      AND: 'and',
      OR: 'or'
    };
  }

  static and(...items) {
    return new BooleanExpression(items, this.TYPES.AND);
  }

  static or(...items) {
    return new BooleanExpression(items, this.TYPES.OR);
  }

  reduce({
    andInitialValue,
    andReducer,
    orInitialValue,
    orReducer
  }) {
    const reducerArguments = ([accumulator, item, index, collection]) => {
      if (item instanceof BooleanExpression) {
        const reducedItem = item.reduce({
          andInitialValue,
          andReducer,
          orInitialValue,
          orReducer
        });

        return {
          accumulator,
          item: reducedItem,
          isReduced: true,
          index,
          collection
        };
      }
      return {
        accumulator,
        item,
        isReduced: false,
        index,
        collection
      };
    };

    if (this.type === BooleanExpression.TYPES.AND) {
      return _.reduce(
        this.items,
        (...args) => andReducer(
          reducerArguments(args)
        ),
        andInitialValue
      );
    }

    if (this.type === BooleanExpression.TYPES.OR) {
      return _.reduce(
        this.items,
        (...args) => orReducer(
          reducerArguments(args)
        ),
        orInitialValue
      );
    }

    throw Error(`Invalid type: ${this.type}`);
  }

  evaluate({ isItemTrue }) {
    return this.reduce({
      andInitialValue: true,
      andReducer: ({
        accumulator,
        item,
        isReduced
      }) => accumulator && (isReduced ? item : isItemTrue(item)),
      orInitialValue: false,
      orReducer: ({
        accumulator,
        item,
        isReduced
      }) => accumulator || (isReduced ? item : isItemTrue(item))
    });
  }
}
