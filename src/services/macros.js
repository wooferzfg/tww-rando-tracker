import _ from "lodash";

export default class Macros {
  static initialize(macrosFile) {
    this.macros = macrosFile;
  }

  static reset() {
    this.macros = null;
  }

  static readAll() {
    return this.macros;
  }

  static getMacro(macroName) {
    return _.get(this.macros, macroName);
  }

  static setMacro(macroName, value) {
    _.set(this.macros, macroName, value);
  }
}
