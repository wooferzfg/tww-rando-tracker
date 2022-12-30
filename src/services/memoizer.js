import _ from 'lodash';
import memoize from 'memoizee';

/**
 * Allows some functions a class to be memoized, which can provide large performance improvements
 * for slow functions.
 *
 * @class
 */
class Memoizer {
  /**
   * Memoize the given functions of the object.
   *
   * @param {object} parentObject The object to memoize the functions of.
   * @param {string[]} functionNames A list of names of functions to memoize.
   * @example
   * // Call in a constructor or initializer
   *  Memoizer.memoize(this, [
   *    'myFirstFunction',
   *    'mySecondFunction',
   *  ]);
   */
  static memoize(parentObject, functionNames) {
    _.forEach(functionNames, (functionName) => {
      const functionToMemoize = _.get(parentObject, functionName);

      if (!functionToMemoize.clear) {
        const memoizedFunction = memoize(functionToMemoize.bind(parentObject));

        _.set(parentObject, functionName, memoizedFunction);
      }
    });
  }

  /**
   * Clears the memoization cache of the given functions.
   *
   * @param {Function[]} functionsToInvalidate A list of names of functions to invalidate.
   * @example
   * // Call when the output of some functions needs to change
   * Memoizer.invalidate([
   *   this.myFirstFunction,
   *   this.mySecondFunction,
   * ]);
   */
  static invalidate(functionsToInvalidate) {
    _.forEach(functionsToInvalidate, (functionToInvalidate) => {
      if (functionToInvalidate.clear) {
        functionToInvalidate.clear();
      }
    });
  }
}

export default Memoizer;
