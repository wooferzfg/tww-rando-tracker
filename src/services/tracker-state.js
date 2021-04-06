import _, { last } from 'lodash';

import Tracker from '../ui/tracker';

import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';

export default class TrackerState {
  static default() {
    const newState = new TrackerState();

    newState.entrances = {};
    newState.items = _.reduce(
      LogicHelper.ALL_ITEMS,
      (accumulator, item) => {
        _.set(
          accumulator,
          [item, 'value'],
          LogicHelper.startingItemCount(item),
        );
        _.set(
          accumulator,
          [item, 'sphere'],
          LogicHelper.startingItemCount(item) >= 1 ? [null, { value: -1 }] : null,
        );
        return accumulator;
      },
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

  static setItemValue(items, itemName, itemCount) {
    _.set(items, [itemName, 'value'], itemCount);
  }

  static setItemSphere(items, itemName, sphere, lastLocation, index = 0) {
    _.set(items, [itemName, 'sphere', index], { value: sphere, lastLocation });
  }

  static removeItemSphere(items, itemName, index = 0) {
    _.unset(items, [itemName, 'sphere', index]);
  }

  static setLastLocation(state, generalLocation, detailedLocation) {
    _.set(state, 'lastLocation', { generalLocation, detailedLocation });
  }

  readState() {
    return {
      entrances: this.entrances,
      items: this.items,
      locationsChecked: this.locationsChecked,
    };
  }

  recalculateSphere(ignoreNil = false) {
    let hasUpdate;
    _.forEach(this.items, (item) => {
      _.forEach(item.sphere, (sphere) => {
        if (sphere) {
          const {
            lastLocation,
            value,
          } = sphere;
          if (lastLocation && (ignoreNil || _.isNil(value))) {
            const {
              generalLocation,
              detailedLocation,
            } = lastLocation;

            const sphereValue = LogicCalculation.getSphere(this, generalLocation,
              detailedLocation);
            if (!_.isNil(sphereValue) && sphereValue !== value) {
              _.set(sphere, 'value', sphereValue);
              hasUpdate = true;
            }
          }
        }
      });
    });

    // if any item has changed sphere, we need to recaclulate everything again,
    // regardless of nil since OR mightchange the sphere number
    if (hasUpdate) this.recalculateSphere(true);
  }

  getItemValue(itemName) {
    return _.get(this.items, [itemName, 'value']);
  }

  getItemSphere(itemName, index = 1) {
    return _.get(this.items, [itemName, 'sphere', index]);
  }

  incrementItem(itemName) {
    const newState = this._clone();

    const originalItemCount = this.getItemValue(itemName);
    let newItemCount = 1 + originalItemCount;
    const maxItemCount = LogicHelper.maxItemCount(itemName);
    if (newItemCount > maxItemCount) {
      newItemCount = LogicHelper.startingItemCount(itemName);
    }

    TrackerState.setItemValue(newState.items, itemName, newItemCount);

    if (newItemCount > 0) {
      const lastLocation = _.get(newState, 'lastLocation');
      debugger;
      if (!_.isNil(lastLocation)) {
        const {
          generalLocation,
          detailedLocation,
        } = lastLocation;

        const locationSphere = LogicCalculation.getSphere(newState, generalLocation,
          detailedLocation);
        const sphere = !_.isNil(locationSphere) ? locationSphere : null;

        TrackerState.setItemSphere(newState.items, itemName, sphere, lastLocation, newItemCount);

        this.recalculateSphere();
      }
    } else {
      TrackerState.removeItemSphere(newState.items, itemName, originalItemCount);
    }

    return newState;
  }

  decrementItem(itemName) {
    const newState = this._clone();

    const originalItemCount = this.getItemValue(itemName);
    let newItemCount = originalItemCount - 1;
    const minItemCount = LogicHelper.startingItemCount(itemName);
    if (newItemCount < minItemCount) {
      newItemCount = LogicHelper.maxItemCount(itemName);
    }
    TrackerState.setItemValue(newState.items, itemName, newItemCount);

    TrackerState.removeItemSphere(newState.items, itemName, originalItemCount);

    this.recalculateSphere();

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

    if (!isChecked) TrackerState.setLastLocation(newState, generalLocation, detailedLocation);

    return newState;
  }

  _clone() {
    const newState = new TrackerState();

    newState.entrances = _.clone(this.entrances);
    newState.items = _.clone(this.items);
    newState.locationsChecked = _.cloneDeep(this.locationsChecked);
    newState.lastLocation = _.clone(this.lastLocation);

    return newState;
  }
}
