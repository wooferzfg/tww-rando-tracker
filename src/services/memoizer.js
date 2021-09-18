import _ from 'lodash';
import memoize from 'memoizee';

class Memoizer {
  static memoize(parentObject, functionNames) {
    _.forEach(functionNames, (functionName) => {
      const functionToMemoize = _.get(parentObject, functionName);

      if (!functionToMemoize.clear) {
        const memoizedFunction = memoize(functionToMemoize.bind(parentObject));

        _.set(parentObject, functionName, memoizedFunction);
      }
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

export default Memoizer;
