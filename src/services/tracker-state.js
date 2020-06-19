import _ from 'lodash';

import Locations from './locations';
import LogicHelper from './logic-helper';

export default class TrackerState {
  static default() {
    const newState = new TrackerState();

    newState.entrances = {};
    newState.items = _.reduce(
      LogicHelper.allItems(),
      (accumulator, item) => _.set(
        accumulator,
        item,
        LogicHelper.startingItemCount(item),
      ),
      {},
    );
    newState.locationsChecked = Locations.mapLocations(() => false);

    return newState;
  }

  static createStateRaw({ entrances, items, locationsChecked }) {
    const newState = new TrackerState();

    newState.entrances = entrances;
    newState.items = items;
    newState.locationsChecked = locationsChecked;

    return newState;
  }

  readState() {
    const clonedState = this._clone();

    return {
      entrances: clonedState.entrances,
      items: clonedState.items,
      locationsChecked: clonedState.locationsChecked,
    };
  }

  getItemValue(itemName) {
    return _.get(this.items, itemName);
  }

  incrementItem(itemName) {
    const newState = this._clone();

    let newItemCount = 1 + _.get(newState.items, itemName);
    const maxItemCount = LogicHelper.maxItemCount(itemName);
    if (newItemCount > maxItemCount) {
      newItemCount = LogicHelper.startingItemCount(itemName);
    }

    _.set(newState.items, itemName, newItemCount);
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
}
