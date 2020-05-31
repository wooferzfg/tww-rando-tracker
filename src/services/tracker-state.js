import _ from 'lodash';

import Locations from './locations';
import LogicHelper from './logic-helper';

export default class TrackerState {
  static default() {
    const newState = new TrackerState();

    newState.entrances = {};
    newState.items = _.reduce(
      LogicHelper.allItems(),
      (accumulator, item) => _.set(accumulator, item, 0),
      {},
    );
    newState._setStartingItems();
    newState.locationsChecked = Locations.mapLocations(() => false);

    return newState;
  }

  static createStateManually({ entrances, items, locationsChecked }) {
    const newState = new TrackerState();

    newState.entrances = entrances;
    newState.items = items;
    newState.locationsChecked = locationsChecked;

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

  getEntranceValue(dungeonOrCaveName) {
    return _.get(this.entrances, dungeonOrCaveName);
  }

  setEntranceValue(dungeonOrCaveName, value) {
    const newState = this._clone();
    _.set(newState.entrances, dungeonOrCaveName, value);
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

  _setStartingItems() {
    const startingItems = LogicHelper.getStartingItems();

    _.forEach(startingItems, (itemValue, itemName) => {
      _.set(this.items, itemName, itemValue);
    });
  }
}
