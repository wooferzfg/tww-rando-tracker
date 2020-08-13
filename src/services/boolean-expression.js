import _ from 'lodash';

export default class BooleanExpression {
  constructor(items, type) {
    this.items = items;
    this.type = type;
  }

  static and(...items) {
    return new BooleanExpression(items, this._TYPES.AND);
  }

  static or(...items) {
    return new BooleanExpression(items, this._TYPES.OR);
  }

  isAnd() {
    return this.type === BooleanExpression._TYPES.AND;
  }

  isOr() {
    return this.type === BooleanExpression._TYPES.OR;
  }

  reduce({
    andInitialValue,
    andReducer,
    orInitialValue,
    orReducer,
  }) {
    const reducerArguments = ([accumulator, item, index, collection]) => {
      if (item instanceof BooleanExpression) {
        const reducedItem = item.reduce({
          andInitialValue,
          andReducer,
          orInitialValue,
          orReducer,
        });

        return {
          accumulator,
          item: reducedItem,
          isReduced: true,
          index,
          collection,
        };
      }
      return {
        accumulator,
        item,
        isReduced: false,
        index,
        collection,
      };
    };

    if (this.isAnd()) {
      return _.reduce(
        this.items,
        (...args) => andReducer(
          reducerArguments(args),
        ),
        andInitialValue,
      );
    }

    if (this.isOr()) {
      return _.reduce(
        this.items,
        (...args) => orReducer(
          reducerArguments(args),
        ),
        orInitialValue,
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
        isReduced,
      }) => accumulator && (isReduced ? item : isItemTrue(item)),
      orInitialValue: false,
      orReducer: ({
        accumulator,
        item,
        isReduced,
      }) => accumulator || (isReduced ? item : isItemTrue(item)),
    });
  }

  simplify({
    implies,
    iterations = 3,
  }) {
    let updatedExpression = this._flatten();

    for (let i = 1; i <= iterations; i += 1) {
      updatedExpression = updatedExpression._removeDuplicateChildren(implies);
      updatedExpression = updatedExpression._removeDuplicateExpressions(implies);
    }

    return updatedExpression;
  }

  static _TYPES = {
    AND: 'and',
    OR: 'or',
  };

  _oppositeType() {
    if (this.isAnd()) {
      return BooleanExpression._TYPES.OR;
    }
    if (this.isOr()) {
      return BooleanExpression._TYPES.AND;
    }
    throw Error(`Invalid type: ${this.type}`);
  }

  _isEqualTo({
    otherExpression,
    areItemsEqual,
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
          return item._isEqualTo({
            otherExpression: otherItem,
            areItemsEqual,
          });
        }
        if (otherItem instanceof BooleanExpression) {
          return false;
        }

        return areItemsEqual({
          item,
          otherItem,
        });
      },
    );
    return _.isEmpty(difference);
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

  static _createFlatExpression(items, type) {
    const newExpression = new BooleanExpression(items, type);
    return newExpression._flatten();
  }

  static _itemIsSubsumed({
    itemsCollection,
    item,
    expressionType,
    implies,
  }) {
    let itemIsSubsumed = false;

    _.forEach(itemsCollection, (otherItem) => {
      if (otherItem instanceof BooleanExpression) {
        return true; // continue
      }

      if (expressionType === BooleanExpression._TYPES.AND) {
        if (implies(otherItem, item)) {
          itemIsSubsumed = true;
          return false; // break loop
        }
      } else if (expressionType === BooleanExpression._TYPES.OR) {
        if (implies(item, otherItem)) {
          itemIsSubsumed = true;
          return false; // break loop
        }
      } else {
        throw Error(`Invalid type: ${expressionType}`);
      }

      return true; // continue
    });

    return itemIsSubsumed;
  }

  _getUpdatedParentItems(parentItems) {
    return _.mergeWith(
      {},
      parentItems,
      { [this.type]: this.items },
      (objectValue, sourceValue) => {
        if (_.isArray(objectValue)) {
          return _.concat(
            objectValue,
            _.filter(sourceValue, (value) => !(value instanceof BooleanExpression)),
          );
        }
        return undefined;
      },
    );
  }

  _removeDuplicateChildrenHelper({
    implies,
    parentItems,
  }) {
    const newItems = [];

    const updatedParentItems = this._getUpdatedParentItems(parentItems);

    const sameTypeItems = _.get(parentItems, this.type);
    const oppositeTypeItems = _.get(parentItems, this._oppositeType());

    let removeSelf = false;

    _.forEach(this.items, (item) => {
      if (item instanceof BooleanExpression) {
        const {
          expression: childExpression,
          removeParent: childRemoveParent,
        } = item._removeDuplicateChildrenHelper({
          implies,
          parentItems: updatedParentItems,
        });

        if (childRemoveParent) {
          removeSelf = true;
          return false; // break loop
        }

        newItems.push(childExpression);
      } else {
        if (BooleanExpression._itemIsSubsumed({
          itemsCollection: oppositeTypeItems,
          item,
          expressionType: this._oppositeType(),
          implies,
        })) {
          removeSelf = true;
          return false; // break loop
        }

        if (!BooleanExpression._itemIsSubsumed({
          itemsCollection: sameTypeItems,
          item,
          expressionType: this.type,
          implies,
        })) {
          newItems.push(item);
        }
      }
      return true; // continue
    });

    if (removeSelf) {
      return {
        expression: BooleanExpression.and(),
        removeParent: false,
      };
    }

    const expression = BooleanExpression._createFlatExpression(newItems, this.type);

    if (_.isEmpty(expression.items)) {
      return {
        expression: BooleanExpression.and(),
        removeParent: true,
      };
    }

    return {
      expression,
      removeParent: false,
    };
  }

  _removeDuplicateChildren(implies) {
    const { expression } = this._removeDuplicateChildrenHelper({
      implies,
      parentItems: {
        [BooleanExpression._TYPES.AND]: [],
        [BooleanExpression._TYPES.OR]: [],
      },
    });

    return expression;
  }

  _isSubsumedBy({
    otherExpression,
    implies,
    removeIfIdentical,
    expressionType,
  }) {
    if (this._isEqualTo({
      otherExpression,
      areItemsEqual: ({ item, otherItem }) => implies(item, otherItem) && implies(otherItem, item),
    })) {
      return removeIfIdentical;
    }

    return _.every(
      otherExpression.items,
      (otherItem) => {
        if (otherItem instanceof BooleanExpression) {
          return this._isSubsumedBy({
            otherExpression: otherItem,
            implies,
            removeIfIdentical: true,
            expressionType,
          });
        }

        return BooleanExpression._itemIsSubsumed({
          itemsCollection: this.items,
          item: otherItem,
          expressionType,
          implies,
        });
      },
    );
  }

  static _expressionIsSubsumed({
    parentExpression,
    expression,
    index,
    implies,
  }) {
    let expressionIsSubsumed = false;

    _.forEach(parentExpression.items, (otherItem, otherIndex) => {
      if (otherIndex === index) {
        return true; // continue
      }

      let otherExpression;
      if (otherItem instanceof BooleanExpression) {
        otherExpression = otherItem;
      } else {
        otherExpression = BooleanExpression.and(otherItem);
      }

      const isSubsumed = expression._isSubsumedBy({
        otherExpression,
        implies,
        removeIfIdentical: otherIndex < index,
        expressionType: parentExpression._oppositeType(),
      });

      if (isSubsumed) {
        expressionIsSubsumed = true;
        return false; // break loop
      }

      return true; // continue
    });

    return expressionIsSubsumed;
  }

  _removeDuplicateExpressionsInChildren(implies) {
    const newItems = [];

    _.forEach(this.items, (item) => {
      let newItem;
      if (item instanceof BooleanExpression) {
        newItem = item._removeDuplicateExpressions(implies);
      } else {
        newItem = item;
      }

      newItems.push(newItem);
    });

    return BooleanExpression._createFlatExpression(newItems, this.type);
  }

  _removeDuplicateExpressions(implies) {
    const parentExpression = this._removeDuplicateExpressionsInChildren(implies);

    const newItems = [];

    _.forEach(parentExpression.items, (item, index) => {
      let newExpression;
      if (item instanceof BooleanExpression) {
        newExpression = item;
      } else {
        newExpression = BooleanExpression.and(item);
      }

      if (!BooleanExpression._expressionIsSubsumed({
        parentExpression,
        expression: newExpression,
        index,
        implies,
      })) {
        newItems.push(newExpression);
      }
    });

    return BooleanExpression._createFlatExpression(newItems, this.type);
  }
}
