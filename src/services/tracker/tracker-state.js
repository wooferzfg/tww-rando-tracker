import _ from 'lodash';

import ITEMS from '../../data/items';

import Locations from '../logic/locations';

export default class TrackerState {
  static initialize() {
    this.entrances = {};
    this.items = _.reduce(ITEMS, (accumulator, item) => _.set(accumulator, item, 0), {});
    this.locationsChecked = _.reduce(
      Locations.allLocations(),
      (
        accumulator,
        { generalLocation, detailedLocation }
      ) => _.set(accumulator, [generalLocation, detailedLocation], false),
      {}
    );
  }

  static getItemValue(itemName) {
    return _.get(this.items, itemName);
  }

  static setItemValue(itemName, value) {
    _.set(this.items, itemName, value);
  }

  static getEntranceValue(entranceName) {
    return _.get(this.entrances, entranceName);
  }

  static setEntranceValue(entranceName, value) {
    _.set(this.entrances, entranceName, value);
  }

  static isLocationChecked(generalLocation, detailedLocation) {
    return _.get(this.locationsChecked, [generalLocation, detailedLocation]);
  }

  static setLocationChecked(generalLocation, detailedLocation, isChecked) {
    _.set(this.locationsChecked, [generalLocation, detailedLocation], isChecked);
  }
}
