import _ from 'lodash';

import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import TrackerState from './tracker-state';

class Spheres {
  constructor(trackerState) {
    this.#state = trackerState;
    this.#spheres = null;
  }

  sphereForLocation(generalLocation, detailedLocation) {
    if (_.isNil(this.#spheres)) {
      this.#calculate();
    }

    return _.get(this.#spheres, [generalLocation, detailedLocation]);
  }

  state() {
    return this.#state;
  }

  #calculate() {
    this.#temporaryState = TrackerState.default();
    this.#spheres = Locations.mapLocations(() => null);
    this.#entrancesAdded = _.reduce(
      LogicHelper.allRandomEntrances(),
      (accumulator, entrance) => _.set(accumulator, entrance, false),
      {},
    );
    this.#anyItemsAdded = true;
    this.#currentSphere = 0;

    while (this.#anyItemsAdded) {
      this.#anyItemsAdded = false;

      this.#updateEntranceItems();
      this.#updateSmallKeys();
      this.#updateItems();

      this.#currentSphere += 1;
    }

    return this.#spheres;
  }

  #state;

  #spheres;

  #temporaryState;

  #entrancesAdded;

  #anyItemsAdded;

  #currentSphere;

  #sphereForLocation(generalLocation, detailedLocation) {
    return _.get(this.#spheres, [generalLocation, detailedLocation]);
  }

  #updateSphereForLocation(generalLocation, detailedLocation) {
    _.set(this.#spheres, [generalLocation, detailedLocation], this.#currentSphere);
  }

  #isEntranceAdded(entranceName) {
    return _.get(this.#entrancesAdded, entranceName);
  }

  #setEntranceAdded(entranceName) {
    _.set(this.#entrancesAdded, entranceName, true);
  }

  #updateStateWithItem(itemName) {
    this.#temporaryState = this.#temporaryState.incrementItem(itemName);
  }

  #updateEntranceItems() {
    let logic = new LogicCalculation(this.#temporaryState);

    const entrancesToCheck = _.clone(LogicHelper.allRandomEntrances());

    for (let i = 0; i < entrancesToCheck.length; i += 1) {
      const entranceName = entrancesToCheck[i];

      if (this.#isEntranceAdded(entranceName)) {
        continue;
      }

      const exitForEntrance = this.#state.getExitForEntrance(entranceName);
      if (_.isNil(exitForEntrance)) {
        continue;
      }

      if (exitForEntrance === LogicHelper.NOTHING_EXIT) {
        continue;
      }

      if (logic.isEntranceAvailable(entranceName)) {
        const entryName = LogicHelper.entryName(exitForEntrance);

        this.#updateStateWithItem(entryName);
        this.#setEntranceAdded(entranceName);

        const nestedEntrances = LogicHelper.nestedEntrancesForExit(exitForEntrance);
        if (nestedEntrances.length > 0) {
          entrancesToCheck.push(...nestedEntrances);
          logic = new LogicCalculation(this.#temporaryState);
        }
      }
    }
  }

  #updateSmallKeys() {
    _.forEach(LogicHelper.MAIN_DUNGEONS, (dungeonName) => {
      const locations = Locations.detailedLocationsForGeneralLocation(dungeonName);
      const smallKeyName = LogicHelper.smallKeyName(dungeonName);

      let anySmallKeysAdded = true;

      while (anySmallKeysAdded) {
        anySmallKeysAdded = this.#updateSmallKeysForDungeon(dungeonName, locations, smallKeyName);
      }
    });
  }

  #updateSmallKeysForDungeon(dungeonName, locations, smallKeyName) {
    let anySmallKeysAdded = false;
    const logic = new LogicCalculation(this.#temporaryState);

    _.forEach(locations, (detailedLocation) => {
      const sphere = this.#sphereForLocation(dungeonName, detailedLocation);
      if (!_.isNil(sphere)) {
        return true; // continue
      }

      const itemAtLocation = this.#state.getItemForLocation(
        dungeonName,
        detailedLocation,
      );
      if (itemAtLocation !== smallKeyName) {
        return true; // continue
      }

      if (logic.isLocationAvailable(dungeonName, detailedLocation)) {
        this.#updateStateWithItem(itemAtLocation);
        this.#updateSphereForLocation(dungeonName, detailedLocation);
        anySmallKeysAdded = true;
      }

      return true; // continue
    });

    return anySmallKeysAdded;
  }

  #updateItems() {
    const logic = new LogicCalculation(this.#temporaryState);

    _.forEach(Locations.allGeneralLocations(), (generalLocation) => {
      const detailedLocations = Locations.detailedLocationsForGeneralLocation(generalLocation);

      _.forEach(detailedLocations, (detailedLocation) => {
        this.#updateItemsForLocation(generalLocation, detailedLocation, logic);
      });
    });
  }

  #updateItemsForLocation(generalLocation, detailedLocation, logic) {
    const sphere = this.#sphereForLocation(generalLocation, detailedLocation);
    if (!_.isNil(sphere)) {
      return;
    }

    const isLocationAvailable = logic.isLocationAvailable(generalLocation, detailedLocation);
    if (!isLocationAvailable) {
      return;
    }

    this.#updateSphereForLocation(generalLocation, detailedLocation);

    const itemAtLocation = this.#state.getItemForLocation(
      generalLocation,
      detailedLocation,
    );

    let chartForIsland;
    if (!_.isNil(itemAtLocation)
        && LogicHelper.isRandomizedChart(itemAtLocation)) {
      const island = this.#state.getIslandFromChartMapping(itemAtLocation);
      if (!_.isNil(island)) {
        chartForIsland = LogicHelper.randomizedChartForIsland(island);
      }
    }

    if (!_.isNil(itemAtLocation)) {
      this.#updateStateWithItem(itemAtLocation);
      if (!_.isNil(chartForIsland)) {
        this.#updateStateWithItem(chartForIsland);
      }
      this.#anyItemsAdded = true;
    }
  }
}

export default Spheres;
