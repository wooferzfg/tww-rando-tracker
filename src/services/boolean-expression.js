import _ from 'lodash';

/**
 * This class defines a boolean expression, which is a collection of items
 * grouped together by "and"/"or" statements. For example,
 * (("X > 5" or "X < 2") and "Y = 10").
 *
 * @class
 */
class BooleanExpression {
  /**
   * @param {any[]} items The items in the boolean expression. Each item can
   *   either be an object of an arbitrary type or a boolean expression.
   * @param {string} type The type of the boolean expression ('and'/'or');
   */
  constructor(items, type) {
    this.items = items;
    this.type = type;
  }

  /**
   * Constructs a new boolean expression with the 'and' type.
   *
   * @param  {...any} items The items in the boolean expression. Each item can
   *   either be an object of an arbitrary type or a boolean expression.
   * @returns {BooleanExpression} The new boolean expression.
   */
  static and(...items) {
    return new BooleanExpression(items, this._TYPES.AND);
  }

  /**
   * Constructs a new boolean expression with the 'or' type.
   *
   * @param  {...any} items The items in the boolean expression. Each item can
   *   either be an object of an arbitrary type or a boolean expression.
   * @returns {BooleanExpression} The new boolean expression.
   */
  static or(...items) {
    return new BooleanExpression(items, this._TYPES.OR);
  }

  /**
   * @returns {boolean} Whether the expression is an 'and' expression.
   */
  isAnd() {
    return this.type === BooleanExpression._TYPES.AND;
  }

  /**
   * @returns {boolean} Whether the expression is an 'or' expression.
   */
  isOr() {
    return this.type === BooleanExpression._TYPES.OR;
  }

  /**
   * @param {object} options The options for reduction.
   * @param {any} options.andInitialValue The initial value for an expression
   *   with the 'and' type.
   * @param {Function} options.andReducer A function that takes an object with
   *   three keys: `accumulator` (the accumulated value for the current
   *   expression), `item` (the current item), and `isReduced` (whether the
   *   current item is a nested boolean expression that has already been
   *   reduced). This function is only used for expressions that have the 'and'
   *   type.
   * @param {any} options.orInitialValue The initial value for an expression
   *   with the 'or' type.
   * @param {Function} options.orReducer A function that takes an object with
   *   three keys: `accumulator` (the accumulated value for the current
   *   expression), `item` (the current item), and `isReduced` (whether the
   *   current item is a nested boolean expression that has already been
   *   reduced). This function is only used for expressions that have the 'or'
   *   type.
   * @returns {any} The reduced value of the expression.
   */
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

  /**
   * @param {object} options The options for evaluation.
   * @param {Function} options.isItemTrue A function that takes an argument that
   *   is an item in the boolean expression. The function returns whether the
   *   given item is true or false.
   * @returns {boolean} Whether the overall expression is true or false.
   */
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

  /**
   * @param {object} options The options for simplification.
   * @param {Function} options.implies A function that takes two arguments that
   *   are both items in the boolean expression. The function returns whether
   *   the first item being true implies that the second item is true. For
   *   example, "X > 5" would imply "X > 3".
   * @returns {BooleanExpression} The simplified boolean expression.
   */
  simplify({ implies }) {
    let updatedExpression = this._flatten();

    for (let i = 1; i <= 3; i += 1) {
      updatedExpression = updatedExpression._removeDuplicateChildren(implies);
      updatedExpression = updatedExpression._removeDuplicateExpressions(implies);
    }

    return updatedExpression;
  }

  /**
   * The possible types for a boolean expression ('and'/'or').
   *
   * @property {object.<string, string>}
   * @private
   */
  static _TYPES = {
    AND: 'and',
    OR: 'or',
  };

  /**
   * Maps the boolean expression to a value. This is used to reduce the
   * boolean expression to a boolean value (in `evaluate`) or to an arbitrary
   * value (in `reduce`).
   *
   * @param {object} options The options for mapping.
   * @param {Function} options.handleAnd A function that is called with two
   *   arguments: the items in the expression, and a recursive mapping function.
   *   The recursive mapping function takes an object as an argument with the
   *   keys `item` (the current item) and `isMapped` (whether the item is a
   *   nested boolean expression that has already been mapped). This function is
   *   only called if the boolean expression has the 'and' type.
   * @param {Function} options.handleOr A function that is called with two
   *   arguments: the items in the expression, and a recursive mapping function.
   *   The recursive mapping function takes an object as an argument with the
   *   keys `item` (the current item) and `isMapped` (whether the item is a
   *   nested boolean expression that has already been mapped). This function is
   *   only called if the boolean expression has the 'or' type.
   * @returns {any} The mapped value of the expression.
   * @private
   */
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

    // istanbul ignore next
    throw Error(`Invalid type: ${this.type}`);
  }

  /**
   * @returns {string} The opposite type of the current boolean expression. For
   *   a boolean expression of type 'and', this method returns 'or', and vice
   *   versa.
   * @private
   */
  _oppositeType() {
    if (this.isAnd()) {
      return BooleanExpression._TYPES.OR;
    }
    if (this.isOr()) {
      return BooleanExpression._TYPES.AND;
    }
    // istanbul ignore next
    throw Error(`Invalid type: ${this.type}`);
  }

  /**
   * @param {any} item The item or expression to check.
   * @returns {boolean} Whether the given item is an instance of a boolean
   *   expression.
   * @private
   */
  static _isExpression(item) {
    return item instanceof BooleanExpression;
  }

  /**
   * @param {object} options Options for evaluating if the expressions are
   *   equal.
   * @param {BooleanExpression} options.otherExpression The boolean expression
   *   to compare the expression to.
   * @param {Function} options.areItemsEqual A function that takes two arguments
   *   that are items in the boolean expression. This function should return
   *   whether the two items are equal.
   * @returns {boolean} Whether the boolean expression is equal to the given
   *   other boolean expression. The items in the two expressions can be in any
   *   order, but they must otherwise be equivalent.
   * @private
   */
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

  /**
   * @returns {BooleanExpression} The flattened boolean expression. For example,
   *   the expression `And(And(And("X > 5")))` can be simplified to
   *   `And("X > 5")`.
   * @private
   */
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

  /**
   * @param {any[]} items The items in the boolean expression. Each item can
   *   either be an object of an arbitrary type or a boolean expression.
   * @param {string} type The type of the boolean expression ('and'/'or');
   * @returns {BooleanExpression} The new boolean expression with the given
   *   items and type, modified to be flattened.
   * @private
   */
  static _createFlatExpression(items, type) {
    const newExpression = new BooleanExpression(items, type);
    return newExpression._flatten();
  }

  /**
   * @param {object} options Options for determining if the item is subsumed.
   * @param {any[]} itemsCollection The collection of items to search through.
   * @param {any} item The item to check.
   * @param {string} expressionType The type of the expression.
   * @param {Function} implies A function that takes two arguments that are both
   *   items in the boolean expression. The function returns whether the first
   *   item being true implies that the second item is true. For example,
   *   "X > 5" would imply "X > 3".
   * @returns {boolean} Whether the given item is subsumed by any item in the
   *   given items collection.
   *   For an 'and' expression, this is true if any of the items in the given
   *   items collection imply the given item.
   *   For an 'or' expression, this is true if the given item implies any of
   *   the items in the given items collection.
   * @private
   */
  static _itemIsSubsumed({
    itemsCollection,
    item,
    expressionType,
    implies,
  }) {
    return _.some(itemsCollection, (otherItem) => {
      if (this._isExpression(otherItem)) {
        return false;
      }

      if (expressionType === this._TYPES.AND) {
        if (implies(otherItem, item)) {
          return true;
        }
      } else if (expressionType === this._TYPES.OR) {
        if (implies(item, otherItem)) {
          return true;
        }
      } else {
        // istanbul ignore next
        throw Error(`Invalid type: ${expressionType}`);
      }

      return false;
    });
  }

  /**
   * @param {object} parentItems An object with a key for each of the expression
   *   types ('and'/'or'), with the values for each key being the items that
   *   have appeared in parent expressions with that type.
   * @returns {object} The updated parent items. All items in the current
   *   boolean expression instance that are not boolean expressions are added
   *   to the parent items object under the key corresponding to the current
   *   type.
   * @private
   */
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

  /**
   * @param {object} options The options for removing duplicate children.
   * @param {Function} options.implies A function that takes two arguments that
   *   are both items in the boolean expression. The function returns whether
   *   the first item being true implies that the second item is true. For
   *   example, "X > 5" would imply "X > 3".
   * @param {object} options.parentItems An object with a key for each of the
   *   expression types ('and'/'or'), with the values for each key being the
   *   items that have appeared in parent expressions with that type.
   * @returns {BooleanExpression} The current boolean expression instance, with
   *   items removed if they are subsumed by any items that appear in parent
   *   expressions of the current boolean expression instance.
   *   If an expression has an item that also exists in a parent expression
   *   with the same type, then that item is removed.
   *   If an expression has an item that also exists in a parent expression
   *   with the opposite type, then the entire expression is removed.
   *   If all of an expression's items have been removed, then that expression's
   *   parent is removed.
   * @private
   */
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

  /**
   * @param {Function} implies A function that takes two arguments that are both
   *   items in the boolean expression. The function returns whether the first
   *   item being true implies that the second item is true. For example,
   *   "X > 5" would imply "X > 3".
   * @returns {BooleanExpression} The current boolean expression instance, with
   *   items removed if they are subsumed by any items that appear in parent
   *   expressions of the current boolean expression instance.
   * @private
   */
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

  /**
   * @param {object} options The options for determining whether the current
   *   boolean expression is subsumed.
   * @param {BooleanExpression} options.otherExpression The boolean expression
   *   to compare the current boolean expression instance to.
   * @param {Function} options.implies A function that takes two arguments that
   *   are both items in the boolean expression. The function returns whether
   *   the first item being true implies that the second item is true. For
   *   example, "X > 5" would imply "X > 3".
   * @param {boolean} options.removeIfIdentical Whether to remove the current
   *   boolean expression instance if it is identical to the given other boolean
   *   expression.
   * @param {string} options.expressionType The type that the current boolean
   *   expression instance should eventually have once it is flattened. This
   *   will often be different from `this.type` since this function is called
   *   recursively on a non-flattened boolean expression structure.
   * @returns {boolean} Whether the current boolean expression instance is
   *   subsumed by the given other boolean expression instance. This means that
   *   in all cases, the other boolean expression instance implies the current
   *   boolean expression instance, and therefore the current boolean expression
   *   instance is redundant.
   * @private
   */
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

  /**
   * @param {object} options The options for determining whether the given
   *   expression is subsumed.
   * @param {BooleanExpression} options.expressionToCheck The expression to
   *   check.
   * @param {number} options.index The index of the given boolean expression
   *   within the items of the current boolean expression instance.
   * @param {Function} options.implies A function that takes two arguments that
   *   are both items in the boolean expression. The function returns whether
   *   the first item being true implies that the second item is true. For
   *   example, "X > 5" would imply "X > 3".
   * @returns {boolean} Whether the given expression is subsumed by any other
   *   item or expression in the items of the current boolean expression
   *   instance. If multiple expressions are identical, then only the expression
   *   with the lowest index is kept.
   * @private
   */
  _expressionIsSubsumed({ expressionToCheck, index, implies }) {
    return _.some(this.items, (otherItem, otherIndex) => {
      if (otherIndex === index) {
        return false;
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
        return true;
      }

      return false;
    });
  }

  /**
   * @param {Function} implies A function that takes two arguments that are both
   *   items in the boolean expression. The function returns whether the first
   *   item being true implies that the second item is true. For example,
   *   "X > 5" would imply "X > 3".
   * @returns {BooleanExpression} The result of recursively calling
   *   `_removeDuplicateExpressions` on any child boolean expressions.
   * @private
   */
  _removeDuplicateExpressionsInChildren(implies) {
    const newItems = _.map(this.items, (item) => {
      if (BooleanExpression._isExpression(item)) {
        return item._removeDuplicateExpressions(implies);
      }
      return item;
    });

    return BooleanExpression._createFlatExpression(newItems, this.type);
  }

  /**
   * @param {Function} implies A function that takes two arguments that are both
   *   items in the boolean expression. The function returns whether the first
   *   item being true implies that the second item is true. For example,
   *   "X > 5" would imply "X > 3".
   * @returns {BooleanExpression} The current boolean expression instance, with
   *   items removed if they are subsumed by any other items.
   * @private
   */
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

export default BooleanExpression;
