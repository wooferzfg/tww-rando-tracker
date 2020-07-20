import _ from 'lodash';
import memoize from 'memoizee';

export default class Memoizer {
  static memoize(parentObject, functionsToMemoize) {
    _.forEach(functionsToMemoize, (functionToMemoize) => {
      const functionName = functionToMemoize.name;
      const memoizedFunction = memoize(functionToMemoize.bind(parentObject));

      _.set(parentObject, functionName, memoizedFunction);
    });
  }

  static invalidate(functionsToInvalidate) {
    _.forEach(functionsToInvalidate, (functionToInvalidate) => {
      if (functionToInvalidate.clear) {
        functionToInvalidate.clear();
      }
    });
  }
}
