import _ from 'lodash';

import Locations from './locations';
import LogicHelper from './logic-helper';

export default class TrackerState {
  static default() {
    const newState = new TrackerState();

    newState.entrances = {};
    newState.items = _.reduce(
      LogicHelper.ALL_ITEMS,
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
    return {
      entrances: this.entrances,
      items: this.items,
      locationsChecked: this.locationsChecked,
    };
  }

  getItemValue(itemName) {
    return _.get(this.items, itemName);
  }

  incrementItem(itemName) {
    const newState = this._clone();

    let newItemCount = 1 + this.getItemValue(itemName);
    const maxItemCount = LogicHelper.maxItemCount(itemName);
    if (newItemCount > maxItemCount) {
      newItemCount = LogicHelper.startingItemCount(itemName);
    }
    _.set(newState.items, itemName, newItemCount);

    return newState;
  }

  decrementItem(itemName) {
    const newState = this._clone();

    let newItemCount = this.getItemValue(itemName) - 1;
    const minItemCount = LogicHelper.startingItemCount(itemName);
    if (newItemCount < minItemCount) {
      newItemCount = LogicHelper.maxItemCount(itemName);
    }
    _.set(newState.items, itemName, newItemCount);

    return newState;
  }

  getEntranceForExit(dungeonOrCaveName) {
    return _.get(this.entrances, dungeonOrCaveName);
  }

  getExitForEntrance(dungeonOrCaveName) {
    return _.findKey(this.entrances, (entranceName) => entranceName === dungeonOrCaveName);
  }

  setEntranceForExit(exitName, entranceName) {
    const newState = this._clone();
    _.set(newState.entrances, exitName, entranceName);
    return newState;
  }

  unsetEntranceForExit(dungeonOrCaveName) {
    const newState = this._clone();
    _.unset(newState.entrances, dungeonOrCaveName);
    return newState;
  }

  isEntranceChecked(dungeonOrCaveName) {
    return _.includes(this.entrances, dungeonOrCaveName);
  }

  isLocationChecked(generalLocation, detailedLocation) {
    return _.get(this.locationsChecked, [generalLocation, detailedLocation]);
  }

  toggleLocationChecked(generalLocation, detailedLocation) {
    const newState = this._clone();

    const isChecked = this.isLocationChecked(generalLocation, detailedLocation);
    _.set(newState.locationsChecked, [generalLocation, detailedLocation], !isChecked);

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
