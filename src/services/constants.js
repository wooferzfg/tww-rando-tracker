import _ from "lodash";

export default class Constants {
  static createFromArray(dataArray) {
    return _.reduce(
      dataArray,
      (accumulator, option) =>
        _.set(accumulator, _.toUpper(_.snakeCase(option)), option),
      {}
    );
  }
}
