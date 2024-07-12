import _ from 'lodash';

import Locations from './locations';
import LogicHelper from './logic-helper';

class TrackerState {
  static default() {
    const newState = new TrackerState();

    newState.entrances = {};
    newState.islandsForCharts = {};
    newState.items = _.reduce(
      LogicHelper.ALL_ITEMS,
      (accumulator, item) => _.set(
        accumulator,
        item,
        LogicHelper.startingItemCount(item),
      ),
      {},
    );
    newState.itemsForLocations = Locations.mapLocations(() => null);
    newState.locationsChecked = Locations.mapLocations(() => false);

    return newState;
  }

  static createStateRaw({
    entrances,
    islandsForCharts,
    items,
    itemsForLocations,
    locationsChecked,
  }) {
    const newState = new TrackerState();

    newState.entrances = entrances;
    newState.islandsForCharts = islandsForCharts;
    newState.items = items;
    newState.itemsForLocations = itemsForLocations;
    newState.locationsChecked = locationsChecked;

    return newState;
  }

  readState() {
    return {
      entrances: this.entrances,
      islandsForCharts: this.islandsForCharts,
      items: this.items,
      itemsForLocations: this.itemsForLocations,
      locationsChecked: this.locationsChecked,
    };
  }

  getItemValue(itemName) {
    return _.get(this.items, itemName);
  }

  incrementItem(itemName) {
    const newState = this.#clone({ items: true });

    let newItemCount = 1 + this.getItemValue(itemName);
    const maxItemCount = LogicHelper.maxItemCount(itemName);
    if (newItemCount > maxItemCount) {
      newItemCount = LogicHelper.startingItemCount(itemName);
    }
    _.set(newState.items, itemName, newItemCount);

    return newState;
  }

  decrementItem(itemName) {
    const newState = this.#clone({ items: true });

    let newItemCount = this.getItemValue(itemName) - 1;
    const minItemCount = LogicHelper.startingItemCount(itemName);
    if (newItemCount < minItemCount) {
      newItemCount = LogicHelper.maxItemCount(itemName);
    }
    _.set(newState.items, itemName, newItemCount);

    return newState;
  }

  getEntranceForExit(exitName) {
    return _.findKey(this.entrances, (curExitName) => curExitName === exitName);
  }

  getExitForEntrance(entranceName) {
    return _.get(this.entrances, entranceName);
  }

  setExitForEntrance(entranceName, exitName) {
    let newState = this.#clone({ entrances: true });

    _.set(newState.entrances, entranceName, exitName);

    if (exitName !== LogicHelper.NOTHING_EXIT) {
      const entryName = LogicHelper.entryName(exitName);
      newState = newState.incrementItem(entryName);
    }

    return newState;
  }

  unsetEntrance(entranceName) {
    let newState = this.#clone({ entrances: true });

    const exitName = newState.getExitForEntrance(entranceName);
    _.unset(newState.entrances, entranceName);

    if (exitName !== LogicHelper.NOTHING_EXIT) {
      const entryName = LogicHelper.entryName(exitName);
      newState = newState.decrementItem(entryName);
    }

    return newState;
  }

  unsetExit(exitName) {
    let newState = this.#clone({ entrances: true });

    const entranceName = newState.getEntranceForExit(exitName);
    _.unset(newState.entrances, entranceName);

    const entryName = LogicHelper.entryName(exitName);
    newState = newState.decrementItem(entryName);

    return newState;
  }

  isEntranceChecked(entranceName) {
    return _.has(this.entrances, entranceName);
  }

  isLocationChecked(generalLocation, detailedLocation) {
    return _.get(this.locationsChecked, [generalLocation, detailedLocation]);
  }

  toggleLocationChecked(generalLocation, detailedLocation) {
    const newState = this.#clone({ locationsChecked: true });
    newState.#toggleLocationCheckedUpdate(generalLocation, detailedLocation);
    return newState;
  }

  getItemForLocation(generalLocation, detailedLocation) {
    return _.get(this.itemsForLocations, [generalLocation, detailedLocation]);
  }

  getLocationsForItem(itemName) {
    const locationsForItem = [];

    _.forEach(this.itemsForLocations, (generalLocationData, generalLocation) => {
      _.forEach(generalLocationData, (itemAtLocation, detailedLocation) => {
        if (itemAtLocation === itemName) {
          locationsForItem.push({
            generalLocation,
            detailedLocation,
          });
        }
      });
    });

    return locationsForItem;
  }

  setItemForLocation(itemName, generalLocation, detailedLocation) {
    const newState = this.#clone({ itemsForLocations: true });
    _.set(newState.itemsForLocations, [generalLocation, detailedLocation], itemName);
    return newState;
  }

  getChartFromChartMapping(island) {
    return _.findKey(this.islandsForCharts, (chart) => island === chart);
  }

  getIslandFromChartMapping(chart) {
    return _.get(this.islandsForCharts, chart);
  }

  setChartMapping(chart, chartForIsland) {
    const newState = this.#clone({ islandsForCharts: true });
    const island = LogicHelper.islandFromChartForIsland(chartForIsland);

    _.set(newState.islandsForCharts, chart, island);

    return newState;
  }

  unsetChartMapping(chartForIsland) {
    const newState = this.#clone({ islandsForCharts: true });

    const island = LogicHelper.islandFromChartForIsland(chartForIsland);
    const chart = this.getChartFromChartMapping(island);

    _.unset(newState.islandsForCharts, chart);

    return newState;
  }

  unsetItemForLocation(generalLocation, detailedLocation) {
    const newState = this.#clone({ itemsForLocations: true });
    _.set(newState.itemsForLocations, [generalLocation, detailedLocation], null);
    return newState;
  }

  clearBannedLocations(zoneName, { includeAdditionalLocations }) {
    const newState = this.#clone({ locationsChecked: true });

    _.forEach(
      LogicHelper.bannedLocationsForZone(zoneName, { includeAdditionalLocations }),
      ({ generalLocation, detailedLocation }) => {
        if (!newState.isLocationChecked(generalLocation, detailedLocation)) {
          newState.#toggleLocationCheckedUpdate(
            generalLocation,
            detailedLocation,
          );
        }
      },
    );

    return newState;
  }

  #clone({
    entrances: cloneEntrances,
    islandsForCharts: cloneIslandsForCharts,
    items: cloneItems,
    locationsChecked: cloneLocationsChecked,
    itemsForLocations: cloneItemsForLocations,
  }) {
    const newState = new TrackerState();

    newState.entrances = cloneEntrances
      ? _.clone(this.entrances)
      : this.entrances;
    newState.islandsForCharts = cloneIslandsForCharts
      ? _.clone(this.islandsForCharts)
      : this.islandsForCharts;
    newState.items = cloneItems
      ? _.clone(this.items)
      : this.items;
    newState.locationsChecked = cloneLocationsChecked
      ? _.cloneDeep(this.locationsChecked)
      : this.locationsChecked;
    newState.itemsForLocations = cloneItemsForLocations
      ? _.cloneDeep(this.itemsForLocations)
      : this.itemsForLocations;

    return newState;
  }

  #toggleLocationCheckedUpdate(generalLocation, detailedLocation) {
    const isChecked = this.isLocationChecked(generalLocation, detailedLocation);
    _.set(this.locationsChecked, [generalLocation, detailedLocation], !isChecked);
  }
}

export default TrackerState;
