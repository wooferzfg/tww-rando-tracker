import _ from 'lodash';

/**
 * Defines a helper method for accessing constants.
 *
 * @class
 */
class Constants {
  /**
   * @param {string[]} dataArray A list of strings.
   * @returns {object} An object with keys that can be used as constants.
   * @example
   * // The array ['String One', 'String Two'] is converted to the object:
   * {
   *   STRING_ONE: 'String One',
   *   STRING_TWO: 'String Two'
   * }
   *
   * // These values can now be accessed as constants:
   * constantObject.STRING_ONE
   * constantObject.STRING_TWO
   */
  static createFromArray(dataArray) {
    return _.reduce(
      dataArray,
      (accumulator, option) => _.set(
        accumulator,
        _.toUpper(_.snakeCase(option)),
        option,
      ),
      {},
    );
  }
}

export default Constants;
