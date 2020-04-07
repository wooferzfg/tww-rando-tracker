import _ from 'lodash';

export default class Settings {
  static initialize(settings) {
    this.flags = settings.flags;
    this.options = settings.options;
    this.version = settings.version;
  }

  static reset() {
    this.flags = null;
    this.options = null;
    this.version = null;
  }

  static isFlagActive(flag) {
    return _.includes(this.flags, flag);
  }

  static getOptionValue(optionName) {
    return _.get(this.options, optionName);
  }

  static getVersion() {
    return this.version;
  }
}
