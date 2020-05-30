import _ from 'lodash';

export default class Settings {
  static initializeManually(settings) {
    this.flags = settings.flags;
    this.options = settings.options;
    this.startingGear = settings.startingGear;
    this.version = settings.version;
  }

  static reset() {
    this.flags = null;
    this.options = null;
    this.startingGear = null;
    this.version = null;
  }

  static isFlagActive(flag) {
    return _.includes(this.flags, flag);
  }

  static getOptionValue(optionName) {
    return _.get(this.options, optionName);
  }

  static getStartingGear() {
    return this.startingGear;
  }

  static getVersion() {
    return this.version;
  }
}
