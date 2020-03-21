import _ from 'lodash';

import ITEMS from '../../data/items';

import Locations from '../logic/locations';

export default class TrackerState {
  static default() {
    const newState = new TrackerState();

    newState.entrances = {};
    newState.items = _.reduce(ITEMS, (accumulator, item) => _.set(accumulator, item, 0), {});
    newState.locationsChecked = Locations.mapLocations(() => false);

    return newState;
  }

  getItemValue(itemName) {
    return _.get(this.items, itemName);
  }

  setItemValue(itemName, value) {
    const newState = this._clone();
    _.set(newState.items, itemName, value);
    return newState;
  }

  getEntranceValue(entranceName) {
    return _.get(this.entrances, entranceName);
  }

  setEntranceValue(entranceName, value) {
    const newState = this._clone();
    _.set(newState.entrances, entranceName, value);
    return newState;
  }

  isLocationChecked(generalLocation, detailedLocation) {
    return _.get(this.locationsChecked, [generalLocation, detailedLocation]);
  }

  setLocationChecked(generalLocation, detailedLocation, isChecked) {
    const newState = this._clone();
    _.set(newState.locationsChecked, [generalLocation, detailedLocation], isChecked);
    return newState;
  }

  _clone() {
    const newState = new TrackerState();

    newState.entrances = _.clone(this.entrances);
    newState.items = _.clone(this.items);
    newState.locationsChecked = _.cloneDeep(this.locationsChecked);

    return newState;
  }
}
