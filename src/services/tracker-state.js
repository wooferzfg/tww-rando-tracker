import _ from 'lodash';

import Locations from './locations';
import LogicHelper from './logic-helper';

class TrackerState {
  static default() {
    const newState = new TrackerState();

    newState.chartMapping = {};
    newState.entrances = {};
    newState.fakeCharts = {};
    newState.items = _.reduce(
      LogicHelper.ALL_ITEMS,
      (accumulator, item) =>
        _.set(accumulator, item, LogicHelper.startingItemCount(item)),
      {}
    );
    newState.itemsForLocations = Locations.mapLocations(() => null);
    newState.locationsChecked = Locations.mapLocations(() => false);

    return newState;
  }

  static createStateRaw({
    entrances,
    fakeCharts,
    items,
    itemsForLocations,
    locationsChecked,
  }) {
    const newState = new TrackerState();

    newState.entrances = entrances;
    newState.fakeCharts = fakeCharts;
    newState.items = items;
    newState.itemsForLocations = itemsForLocations;
    newState.locationsChecked = locationsChecked;

    return newState;
  }

  readState() {
    return {
      entrances: this.entrances,
      fakeCharts: this.fakeCharts,
      items: this.items,
      itemsForLocations: this.itemsForLocations,
      locationsChecked: this.locationsChecked,
    };
  }

  getItemValue(itemName) {
    return _.get(this.items, itemName);
  }

  incrementItem(itemName) {
    const newState = this._clone({ items: true });

    let newItemCount = 1 + this.getItemValue(itemName);
    const maxItemCount = LogicHelper.maxItemCount(itemName);
    if (newItemCount > maxItemCount) {
      newItemCount = LogicHelper.startingItemCount(itemName);
    }
    _.set(newState.items, itemName, newItemCount);

    return newState;
  }

  decrementItem(itemName) {
    const newState = this._clone({ items: true });

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
    return _.findKey(
      this.entrances,
      (entranceName) => entranceName === dungeonOrCaveName
    );
  }

  setEntranceForExit(exitName, entranceName) {
    const newState = this._clone({ entrances: true });
    _.set(newState.entrances, exitName, entranceName);
    return newState;
  }

  unsetEntranceForExit(dungeonOrCaveName) {
    const newState = this._clone({ entrances: true });
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
    const newState = this._clone({ locationsChecked: true });

    const isChecked = this.isLocationChecked(generalLocation, detailedLocation);
    _.set(
      newState.locationsChecked,
      [generalLocation, detailedLocation],
      !isChecked
    );

    return newState;
  }

  getItemForLocation(generalLocation, detailedLocation) {
    return _.get(this.itemsForLocations, [generalLocation, detailedLocation]);
  }

  getLocationsForItem(itemName) {
    const locationsForItem = [];

    _.forEach(
      this.itemsForLocations,
      (generalLocationData, generalLocation) => {
        _.forEach(generalLocationData, (itemAtLocation, detailedLocation) => {
          if (itemAtLocation === itemName) {
            locationsForItem.push({
              generalLocation,
              detailedLocation,
            });
          }
        });
      }
    );

    return locationsForItem;
  }

  setItemForLocation(itemName, generalLocation, detailedLocation) {
    const newState = this._clone({ itemsForLocations: true });
    _.set(
      newState.itemsForLocations,
      [generalLocation, detailedLocation],
      itemName
    );
    return newState;
  }

  getFakeChartInfo(fakeChartName) {
    return _.get(this.fakeCharts, [fakeChartName], {});
  }

  getFakeChartForChart(chartName) {
    return _.findKey(this.fakeCharts, { item: chartName });
  }

  incrementFakeChart(fakeChartName) {
    const newState = this._clone({ fakeCharts: true });
    const { value } = this.getFakeChartInfo(fakeChartName);

    let newItemCount = 1 + (!_.isNil(value) ? value : 0);
    if (newItemCount > 1) {
      newItemCount = 0;
    }

    _.set(newState.fakeCharts, [fakeChartName, "value"], newItemCount);

    return newState;
  }

  setChartMapping(chartName, realChart) {
    const newState = this._clone({ fakeCharts: true });

    _.set(newState.fakeCharts, [chartName, "item"], realChart);

    return newState;
  }

  unsetChartMapping(chartName) {
    const newState = this._clone({ fakeCharts: true });

    const fakeChart = this.getFakeChartForChart(chartName);

    _.set(newState.fakeCharts, [fakeChart, "item"], null);

    return newState;
  }

  unsetItemForLocation(generalLocation, detailedLocation) {
    const newState = this._clone({ itemsForLocations: true });
    _.set(
      newState.itemsForLocations,
      [generalLocation, detailedLocation],
      null
    );
    return newState;
  }

  _clone({
    entrances: cloneEntrances,
    fakeCharts: clonefakeCharts,
    items: cloneItems,
    locationsChecked: cloneLocationsChecked,
    itemsForLocations: cloneItemsForLocations,
  }) {
    const newState = new TrackerState();

    newState.entrances = cloneEntrances
      ? _.clone(this.entrances)
      : this.entrances;
    newState.fakeCharts = clonefakeCharts
      ? _.clone(this.fakeCharts)
      : this.fakeCharts;
    newState.items = cloneItems ? _.clone(this.items) : this.items;
    newState.locationsChecked = cloneLocationsChecked
      ? _.cloneDeep(this.locationsChecked)
      : this.locationsChecked;
    newState.itemsForLocations = cloneItemsForLocations
      ? _.cloneDeep(this.itemsForLocations)
      : this.itemsForLocations;

    return newState;
  }
}

export default TrackerState;
