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
    return this._map({
      handleAnd: (items, recursiveMappingFunc) => (
        _.reduce(
          items,
          (accumulator, unmappedItem) => {
            const { isMapped, item } = recursiveMappingFunc(unmappedItem);

            return andReducer({
              accumulator,
              item,
              isReduced: isMapped,
            });
          },
          andInitialValue,
        )
      ),
      handleOr: (items, recursiveMappingFunc) => (
        _.reduce(
          items,
          (accumulator, unmappedItem) => {
            const { isMapped, item } = recursiveMappingFunc(unmappedItem);

            return orReducer({
              accumulator,
              item,
              isReduced: isMapped,
            });
          },
          orInitialValue,
        )
      ),
    });
  }

  evaluate({ isItemTrue }) {
    return this._map({
      handleAnd: (items, recursiveMappingFunc) => (
        _.every(items, (unmappedItem) => {
          const { isMapped, item } = recursiveMappingFunc(unmappedItem);

          return isMapped ? item : isItemTrue(item);
        })
      ),
      handleOr: (items, recursiveMappingFunc) => (
        _.some(items, (unmappedItem) => {
          const { isMapped, item } = recursiveMappingFunc(unmappedItem);

          return isMapped ? item : isItemTrue(item);
        })
      ),
    });
  }

  simplify({ implies }) {
    let updatedExpression = this._flatten();

    for (let i = 1; i <= 3; i += 1) {
      updatedExpression = updatedExpression._removeDuplicateChildren(implies);
      updatedExpression = updatedExpression._removeDuplicateExpressions(implies);
    }

    return updatedExpression;
  }

  static _TYPES = {
    AND: 'and',
    OR: 'or',
  };

  _map({ handleAnd, handleOr }) {
    const recursiveMappingFunc = (item) => {
      if (BooleanExpression._isExpression(item)) {
        const mappedItem = item._map({ handleAnd, handleOr });

        return {
          item: mappedItem,
          isMapped: true,
        };
      }
      return {
        item,
        isMapped: false,
      };
    };

    if (this.isAnd()) {
      return handleAnd(this.items, recursiveMappingFunc);
    }

    if (this.isOr()) {
      return handleOr(this.items, recursiveMappingFunc);
    }

    throw Error(`Invalid type: ${this.type}`);
  }

  _oppositeType() {
    if (this.isAnd()) {
      return BooleanExpression._TYPES.OR;
    }
    if (this.isOr()) {
      return BooleanExpression._TYPES.AND;
    }
    throw Error(`Invalid type: ${this.type}`);
  }

  static _isExpression(item) {
    return item instanceof BooleanExpression;
  }

  _isEqualTo({
    otherExpression,
    areItemsEqual,
  }) {
    if (
      !BooleanExpression._isExpression(otherExpression)
      || this.type !== otherExpression.type
      || this.items.length !== otherExpression.items.length
    ) {
      return false;
    }

    const difference = _.xorWith(
      this.items,
      otherExpression.items,
      (item, otherItem) => {
        if (BooleanExpression._isExpression(item)) {
          return item._isEqualTo({
            otherExpression: otherItem,
            areItemsEqual,
          });
        }
        if (BooleanExpression._isExpression(otherItem)) {
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
    const newItems = _.flatMap(this.items, (item) => {
      if (!BooleanExpression._isExpression(item)) {
        return item;
      }

      const flatItem = item._flatten();

      if (_.isEmpty(flatItem.items)) {
        return [];
      }

      if (flatItem.type === this.type || flatItem.items.length === 1) {
        return flatItem.items;
      }

      return flatItem;
    });

    if (newItems.length === 1) {
      const firstItem = _.first(newItems);
      if (BooleanExpression._isExpression(firstItem)) {
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
      if (this._isExpression(otherItem)) {
        return true; // continue
      }

      if (expressionType === this._TYPES.AND) {
        if (implies(otherItem, item)) {
          itemIsSubsumed = true;
          return false; // break loop
        }
      } else if (expressionType === this._TYPES.OR) {
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
            _.filter(sourceValue, (value) => !BooleanExpression._isExpression(value)),
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
      if (BooleanExpression._isExpression(item)) {
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
        if (BooleanExpression._isExpression(otherItem)) {
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

  _expressionIsSubsumed({ expressionToCheck, index, implies }) {
    let expressionIsSubsumed = false;

    _.forEach(this.items, (otherItem, otherIndex) => {
      if (otherIndex === index) {
        return true; // continue
      }

      let otherExpression;
      if (BooleanExpression._isExpression(otherItem)) {
        otherExpression = otherItem;
      } else {
        otherExpression = BooleanExpression.and(otherItem);
      }

      const isSubsumed = expressionToCheck._isSubsumedBy({
        otherExpression,
        implies,
        removeIfIdentical: otherIndex < index,
        expressionType: this._oppositeType(),
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
    const newItems = _.map(this.items, (item) => {
      if (BooleanExpression._isExpression(item)) {
        return item._removeDuplicateExpressions(implies);
      }
      return item;
    });

    return BooleanExpression._createFlatExpression(newItems, this.type);
  }

  _removeDuplicateExpressions(implies) {
    const parentExpression = this._removeDuplicateExpressionsInChildren(implies);

    const newItems = _.filter(parentExpression.items, (item, index) => {
      let expressionToCheck;
      if (BooleanExpression._isExpression(item)) {
        expressionToCheck = item;
      } else {
        expressionToCheck = BooleanExpression.and(item);
      }

      return !parentExpression._expressionIsSubsumed({
        expressionToCheck,
        index,
        implies,
      });
    });

    return BooleanExpression._createFlatExpression(newItems, this.type);
  }
}
