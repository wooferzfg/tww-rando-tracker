import _ from 'lodash';

/* eslint-disable no-param-reassign */
export default class Memoizer {
  static _originalFunctionKey(functionName) {
    return `_original_${functionName}`;
  }

  static memoize({
    parentObject,
    functionsToMemoize
  }) {
    if (_.isNil(parentObject)) {
      throw Error('parentObject not provided!');
    }
    if (_.isEmpty(functionsToMemoize)) {
      throw Error('functionsToMemoize not provided!');
    }

    if (!parentObject._memoizedValues) {
      parentObject._memoizedValues = {};
    }

    _.forEach(functionsToMemoize, (functionName) => {
      const existingFunction = parentObject[functionName];

      const originalFunctionKey = this._originalFunctionKey(functionName);
      parentObject[originalFunctionKey] = existingFunction.bind(parentObject);

      parentObject[functionName] = (...args) => {
        const memoizationKey = _.concat([functionName], args);

        const memoizedValue = _.get(parentObject._memoizedValues, memoizationKey);
        if (memoizedValue) {
          return memoizedValue;
        }

        const result = _.invoke(parentObject, originalFunctionKey, ...args);

        _.set(parentObject._memoizedValues, memoizationKey, result);

        return result;
      };
    });
  }

  static unmemoize({
    parentObject,
    functionsToUnmemoize
  }) {
    if (_.isNil(parentObject)) {
      throw Error('parentObject not provided!');
    }
    if (_.isEmpty(functionsToUnmemoize)) {
      throw Error('functionsToUnmemoize not provided!');
    }

    _.forEach(functionsToUnmemoize, (functionName) => {
      const originalFunctionKey = this._originalFunctionKey(functionName);

      parentObject[functionName] = parentObject[originalFunctionKey];

      _.unset(parentObject, originalFunctionKey);
      _.unset(parentObject._memoizedValues, functionName);
    });
  }
}
