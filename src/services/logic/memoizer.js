import _ from 'lodash';
import memoize from 'memoizee';

/* eslint-disable no-param-reassign */
export default class Memoizer {
  static memoize(parentObject, functionsToMemoize) {
    _.forEach(functionsToMemoize, (functionName) => {
      const existingFunction = parentObject[functionName];
      parentObject[functionName] = memoize(existingFunction.bind(parentObject));
    });
  }

  static invalidate(parentObject, functionsToInvalidate) {
    _.forEach(functionsToInvalidate, (functionName) => {
      parentObject[functionName].clear();
    });
  }
}
