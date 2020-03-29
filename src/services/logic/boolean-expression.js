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

  isEqualTo({
    otherExpression,
    areItemsEqual
  }) {
    if (!(otherExpression instanceof BooleanExpression)
      || this.type !== otherExpression.type
      || this.items.length !== otherExpression.items.length) {
      return false;
    }

    const difference = _.xorWith(
      this.items,
      otherExpression.items,
      (item, otherItem) => {
        if (item instanceof BooleanExpression) {
          return item.isEqualTo({
            otherExpression: otherItem,
            areItemsEqual
          });
        }
        if (otherItem instanceof BooleanExpression) {
          return false;
        }

        return areItemsEqual({
          item,
          otherItem
        });
      }
    );
    return difference.length === 0;
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

  simplify({
    depth = 3,
    implies
  }) {
    let updatedExpression = this;

    for (let i = 1; i <= depth; i += 1) {
      updatedExpression = updatedExpression._removeDuplicateItems(implies);
      updatedExpression = updatedExpression._removeDuplicateExpressions(implies);
    }

    return updatedExpression;
  }

  _flatten() {
    let newItems = [];

    _.forEach(this.items, (item) => {
      if (item instanceof BooleanExpression) {
        const flatItem = item._flatten();

        if (!_.isEmpty(flatItem.items)) {
          if (flatItem.type === this.type || flatItem.items.length === 1) {
            newItems = _.concat(newItems, flatItem.items);
          } else {
            newItems = _.concat(newItems, flatItem);
          }
        }
      } else {
        newItems.push(item);
      }
    });

    if (newItems.length === 1) {
      const firstItem = _.first(newItems);
      if (firstItem instanceof BooleanExpression) {
        return firstItem;
      }
    }

    if (newItems.length <= 1) {
      return BooleanExpression.and(...newItems);
    }

    return new BooleanExpression(newItems, this.type);
  }

  _itemIsSubsumed({
    item,
    index = this.items.length,
    implies
  }) {
    let itemIsSubsumed = false;

    _.forEach(this.items, (otherItem, otherIndex) => {
      if (otherItem !== index && !(otherItem instanceof BooleanExpression)) {
        if (this.isAnd()) {
          if (implies(otherItem, item) && (!implies(item, otherItem) || otherIndex < index)) {
            itemIsSubsumed = true;
            return false; // break loop
          }
        } else if (this.isOr()) {
          if (implies(item, otherItem) && (!implies(otherItem, item) || otherIndex < index)) {
            itemIsSubsumed = true;
            return false; // break loop
          }
        }
      }
      return true; // continue
    });

    return itemIsSubsumed;
  }

  _removeDuplicateItems(implies) {
    const newItems = [];

    _.forEach(this.items, (item, index) => {
      if (item instanceof BooleanExpression) {
        const itemWithoutDuplicates = item._removeDuplicateItems(implies);
        newItems.push(itemWithoutDuplicates);
      } else if (!this._itemIsSubsumed({
        item,
        index,
        implies
      })) {
        newItems.push(item);
      }
    });

    const newExpression = new BooleanExpression(newItems, this.type);
    return newExpression._flatten();
  }

  _isSubsumedBy({
    otherExpression,
    implies,
    removeIfIdentical
  }) {
    if (this.type !== otherExpression.type) {
      return false;
    }

    if (this.isEqualTo({
      otherExpression,
      areItemsEqual: ({ item, otherItem }) => implies(item, otherItem) && implies(otherItem, item)
    })) {
      return removeIfIdentical;
    }

    return _.every(
      otherExpression.items,
      (otherItem) => this._itemIsSubsumed({
        item: otherItem,
        implies
      })
    );
  }

  _expressionIsSubsumed({ expression, index, implies }) {
    let expressionIsSubsumed = false;

    _.forEach(this.items, (otherExpression, otherIndex) => {
      if (otherIndex !== index && otherExpression instanceof BooleanExpression) {
        const isSubsumed = expression._isSubsumedBy({
          otherExpression,
          implies,
          removeIfIdentical: otherIndex < index
        });

        if (isSubsumed) {
          expressionIsSubsumed = true;
          return false; // break loop
        }
      }
      return true; // continue
    });

    return expressionIsSubsumed;
  }

  _removeDuplicateExpressions(implies) {
    const newItems = [];

    _.forEach(this.items, (item, index) => {
      if (item instanceof BooleanExpression) {
        const simplifiedExpression = item._removeDuplicateExpressions(implies);

        if (!this._expressionIsSubsumed({
          expression: simplifiedExpression,
          index,
          implies
        })) {
          newItems.push(simplifiedExpression);
        }
      } else {
        newItems.push(item);
      }
    });

    const newExpression = new BooleanExpression(newItems, this.type);
    return newExpression._flatten();
  }
}
