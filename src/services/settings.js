import _ from 'lodash';

import Constants from './constants';
import Permalink from './permalink';

import FLAGS from '../data/flags';

export default class Settings {
  static FLAGS = Constants.createFromArray(FLAGS);

  static initializeFromPermalink(permalinkString) {
    const decodedOptions = Permalink.decode(permalinkString);
  }

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
