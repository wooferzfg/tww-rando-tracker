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

  isAnd() {
    return this.type === BooleanExpression.TYPES.AND;
  }

  isOr() {
    return this.type === BooleanExpression.TYPES.OR;
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

    if (this.isAnd()) {
      return _.reduce(
        this.items,
        (...args) => andReducer(
          reducerArguments(args)
        ),
        andInitialValue
      );
    }

    if (this.isOr()) {
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

  simplify({ implies }) {
    return this._removeDuplicates(implies);
  }

  _flatten() {
    let newItems = [];

    _.forEach(this.items, (item) => {
      if (item instanceof BooleanExpression) {
        const flatItem = item._flatten();

        if (!_.isEmpty(flatItem.items)) {
          if (flatItem.type === this.type) {
            newItems = _.concat(newItems, flatItem.items);
          } else {
            newItems = _.concat(newItems, flatItem);
          }
        }
      } else {
        newItems.push(item);
      }
    });

    return new BooleanExpression(newItems, this.type);
  }

  _itemIsSubsumed(itemToCheck, indexToCheck, implies) {
    let itemIsSubsumed = false;

    _.forEach(this.items, (item, index) => {
      if (index !== indexToCheck && !(item instanceof BooleanExpression)) {
        if (this.isAnd()) {
          if (implies(item, itemToCheck) && (!implies(itemToCheck, item) || index < indexToCheck)) {
            itemIsSubsumed = true;
            return false; // break loop
          }
        } else if (this.isOr()) {
          if (implies(itemToCheck, item) && (!implies(item, itemToCheck) || index < indexToCheck)) {
            itemIsSubsumed = true;
            return false; // break loop
          }
        }
      }
      return true; // continue
    });

    return itemIsSubsumed;
  }

  _removeDuplicates(implies) {
    const newItems = [];

    _.forEach(this.items, (item, index) => {
      if (item instanceof BooleanExpression) {
        const itemWithoutDuplicates = item._removeDuplicates(implies);
        newItems.push(itemWithoutDuplicates);
      } else if (!this._itemIsSubsumed(item, index, implies)) {
        newItems.push(item);
      }
    });

    const newExpression = new BooleanExpression(newItems, this.type);
    return newExpression._flatten();
  }
}
