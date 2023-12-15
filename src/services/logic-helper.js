import _ from 'lodash';

import CHARTS from '../data/charts.json';
import DUNGEON_ENTRANCES from '../data/dungeon-entrances.json';
import DUNGEONS from '../data/dungeons.json';
import ISLAND_ENTRANCES from '../data/island-entrances.json';
import ISLANDS from '../data/islands.json';
import ITEMS from '../data/items.json';
import KEYS from '../data/keys.json';
import MISC_LOCATIONS from '../data/misc-locations.json';
import NESTED_ENTRANCES from '../data/nested-entrances.json';
import PRETTY_ITEM_NAMES from '../data/pretty-item-names.json';
import REQUIRED_BOSSES from '../data/required-bosses.json';
import SHORT_DUNGEON_NAMES from '../data/short-dungeon-names.json';

import BooleanExpression from './boolean-expression';
import Constants from './constants';
import Locations from './locations';
import Macros from './macros';
import Memoizer from './memoizer';
import Permalink from './permalink';
import Settings from './settings';

class LogicHelper {
  static initialize() {
    Memoizer.memoize(this, [
      'allRandomEntrances',
      'bossLocation',
      'bossLocationForRequirement',
      'bossRequirementForDungeon',
      'chartForIsland',
      'entrancesForDungeon',
      'entrancesForIsland',
      'entryName',
      'exitsForDungeon',
      'exitsForIsland',
      'filterDetailedLocations',
      'islandFromChartForIsland',
      'islandForChart',
      'isPotentialKeyLocation',
      'isProgressLocation',
      'maxItemCount',
      'nestedEntrancesForExit',
      'parseItemCountRequirement',
      'prettyNameForItem',
      'prettyNameForItemRequirement',
      'randomEntrancesForExit',
      'randomExitsForEntrance',
      'requirementsForEntrance',
      'requirementsForLocation',
      'shortEntranceName',
      'shortExitName',
      'smallKeysRequiredForLocation',
      '_rawRequirementsForLocation',
    ]);

    this._setStartingAndImpossibleItems();
    this.nonRequiredBossDungeons = [];
  }

  static reset() {
    Memoizer.invalidate([
      this.allRandomEntrances,
      this.bossLocation,
      this.bossLocationForRequirement,
      this.bossRequirementForDungeon,
      this.chartForIsland,
      this.entrancesForDungeon,
      this.entrancesForIsland,
      this.entryName,
      this.exitsForDungeon,
      this.exitsForIsland,
      this.filterDetailedLocations,
      this.islandFromChartForIsland,
      this.islandForChart,
      this.isPotentialKeyLocation,
      this.isProgressLocation,
      this.maxItemCount,
      this.nestedEntrancesForExit,
      this.parseItemCountRequirement,
      this.prettyNameForItem,
      this.prettyNameForItemRequirement,
      this.randomEntrancesForExit,
      this.randomExitsForEntrance,
      this.requirementsForEntrance,
      this.requirementsForLocation,
      this.shortEntranceName,
      this.shortExitName,
      this.smallKeysRequiredForLocation,
      this._rawRequirementsForLocation,
    ]);

    this.startingItems = null;
    this.impossibleItems = null;
    this.nonRequiredBossDungeons = null;
  }

  static DEFEAT_GANONDORF_LOCATION = 'Defeat Ganondorf';

  static NUM_TRIFORCE_CHARTS = 8;

  static DUNGEONS = Constants.createFromArray(DUNGEONS);

  static MAIN_DUNGEONS = _.filter(DUNGEONS, (dungeon) => this.isMainDungeon(dungeon));

  static REQUIRED_BOSSES_MODE_DUNGEONS = _.map(
    REQUIRED_BOSSES,
    (requiredBossData) => requiredBossData.dungeonName,
  );

  static ISLANDS = Constants.createFromArray(ISLANDS);

  static MISC_LOCATIONS = Constants.createFromArray(MISC_LOCATIONS);

  static ITEMS = Constants.createFromArray(_.keys(ITEMS));

  static TOKENS = {
    AND: '&',
    CLOSING_PAREN: ')',
    IMPOSSIBLE: 'Impossible',
    NOTHING: 'Nothing',
    OPENING_PAREN: '(',
    OR: '|',
  };

  static CHART_TYPES = {
    TREASURE: 'Treasure',
    TRIFORCE: 'Triforce',
  };

  static ALL_ITEMS = _.concat(
    _.map(ISLAND_ENTRANCES, (entranceData) => this.entryName(entranceData.internalName)),
    CHARTS,
    _.map(ISLANDS, (island) => this.chartForIslandName(island)),
    _.map(DUNGEON_ENTRANCES, (entranceData) => this.entryName(entranceData.internalName)),
    _.keys(ITEMS),
    _.keys(KEYS),
  );

  static ALL_TREASURE_CHARTS = _.range(1, CHARTS.length - this.NUM_TRIFORCE_CHARTS + 1).map((number) => `Treasure Chart ${number}`);

  static ALL_TRIFORCE_CHARTS = _.range(1, this.NUM_TRIFORCE_CHARTS + 1).map((number) => `Triforce Chart ${number}`);

  static CAN_ACCESS_ITEM_LOCATION_REGEX = /Can Access Item Location "([^"]+)"/;

  static HAS_ACCESSED_OTHER_LOCATION_REGEX = /Has Accessed Other Location "([^"]+)"/;

  static startingItemCount(item) {
    return _.get(this.startingItems, item, 0);
  }

  static maxItemCount(item) {
    const impossibleItemCount = _.get(this.impossibleItems, item);
    if (!_.isNil(impossibleItemCount)) {
      return impossibleItemCount - 1;
    }

    const maxItemCount = _.get(ITEMS, item);
    if (!_.isNil(maxItemCount)) {
      return maxItemCount;
    }

    const maxKeyCount = _.get(KEYS, item);
    if (!_.isNil(maxKeyCount)) {
      return maxKeyCount;
    }

    return 1;
  }

  static isMainDungeon(dungeonName) {
    if (
      dungeonName === this.DUNGEONS.FORSAKEN_FORTRESS
      || dungeonName === this.DUNGEONS.GANONS_TOWER
    ) {
      return false;
    }
    return this.isDungeon(dungeonName);
  }

  static isDungeon(dungeonName) {
    return _.includes(DUNGEONS, dungeonName);
  }

  static isRequiredBossesModeDungeon(dungeonName) {
    const requiredBossData = this._requiredBossDataForDungeon(dungeonName);
    return !_.isNil(requiredBossData);
  }

  static entryName(exitName) {
    const entranceData = this._entranceDataForInternalName(exitName);
    if (_.isNil(entranceData)) {
      // istanbul ignore next
      throw Error(`Exit not found: ${exitName}`);
    }

    return entranceData.entryName;
  }

  static shortEntranceName(entranceName) {
    const entranceData = this._entranceDataForInternalName(entranceName);
    if (_.isNil(entranceData)) {
      // istanbul ignore next
      throw Error(`Could not get short name for entrance: ${entranceName}`);
    }

    return entranceData.entranceName;
  }

  static shortExitName(exitName) {
    const entranceData = this._entranceDataForInternalName(exitName);
    if (_.isNil(entranceData)) {
      // istanbul ignore next
      throw Error(`Could not get short name for exit: ${exitName}`);
    }

    return entranceData.exitName;
  }

  static entrancesForIsland(islandName) {
    return _.compact(
      _.map(
        _.concat(
          this._filterDungeonEntrances(),
          this._filterIslandEntrances(),
        ),
        (entranceData) => (
          entranceData.entranceZoneName === islandName
            ? entranceData.internalName
            : null
        ),
      ),
    );
  }

  static exitsForIsland(islandName) {
    return _.compact(
      _.map(
        this._filterIslandEntrances(),
        (entranceData) => (
          entranceData.exitZoneName === islandName
            ? entranceData.internalName
            : null
        ),
      ),
    );
  }

  static entrancesForDungeon(zoneName) {
    return _.compact(
      _.map(
        this._filterDungeonEntrances(),
        (entranceData) => (
          entranceData.entranceZoneName === zoneName
            ? entranceData.internalName
            : null
        ),
      ),
    );
  }

  static exitsForDungeon(zoneName) {
    return _.compact(
      _.map(
        this._filterDungeonEntrances(),
        (entranceData) => (
          entranceData.exitZoneName === zoneName
            ? entranceData.internalName
            : null
        ),
      ),
    );
  }

  static isRandomEntrances() {
    return (
      Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES)
      || Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES)
      || Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES)
      || Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES)
      || Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES)
      || Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES)
    );
  }

  static allRandomEntrances() {
    return _.concat(
      this._allDungeonEntrances(),
      this._allIslandEntrances(),
    );
  }

  static randomEntrancesForExit(exitName) {
    const possibleEntrances = this._possibleEntrancesOrExits(exitName);

    return _.difference(
      possibleEntrances,
      this.nestedEntrancesForExit(exitName),
    );
  }

  static randomExitsForEntrance(entranceName) {
    const possibleExits = this._possibleEntrancesOrExits(entranceName);

    const parentExit = _.findKey(
      NESTED_ENTRANCES,
      (nestedEntrances) => _.includes(nestedEntrances, entranceName),
    );
    if (!_.isNil(parentExit)) {
      return _.without(possibleExits, parentExit);
    }

    return possibleExits;
  }

  static nestedEntrancesForExit(exitName) {
    const nestedEntrances = _.get(NESTED_ENTRANCES, exitName, []);
    return _.intersection(nestedEntrances, this.allRandomEntrances());
  }

  static parseItemCountRequirement(requirement) {
    const itemCountRequirementMatch = requirement.match(/((?:\w|\s)+) x(\d)/);

    if (itemCountRequirementMatch) {
      return {
        itemName: itemCountRequirementMatch[1],
        countRequired: _.toSafeInteger(itemCountRequirementMatch[2]),
      };
    }

    return null;
  }

  static isProgressLocation(generalLocation, detailedLocation) {
    const locationTypes = Locations.getLocation(
      generalLocation,
      detailedLocation,
      Locations.KEYS.TYPES,
    );

    if (!locationTypes) {
      // the Defeat Ganondorf location does not have any types
      return true;
    }

    const locationTypesList = _.split(locationTypes, ', ');
    return _.every(
      locationTypesList,
      (flag) => Settings.isFlagActive(flag),
    );
  }

  static isRandomizedChart(item) {
    return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS) && /(Treasure|Triforce) Chart (\d)+/.test(item);
  }

  static filterDetailedLocations(generalLocation, { onlyProgressLocations }) {
    const detailedLocations = Locations.detailedLocationsForGeneralLocation(generalLocation);

    if (onlyProgressLocations) {
      return _.filter(detailedLocations, (detailedLocation) => (
        this.isProgressLocation(generalLocation, detailedLocation)
      ));
    }
    return detailedLocations;
  }

  static isPotentialKeyLocation(generalLocation, detailedLocation) {
    if (!this.isMainDungeon(generalLocation)) {
      return false;
    }

    const locationTypes = Locations.getLocation(
      generalLocation,
      detailedLocation,
      Locations.KEYS.TYPES,
    );
    if (
      Settings.isFlagActive(Settings.FLAGS.DUNGEON)
      && !this.isProgressLocation(generalLocation, detailedLocation)
    ) {
      return false;
    }

    if (
      Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES)
      && _.includes(locationTypes, Settings.FLAGS.RANDOMIZABLE_MINIBOSS_ROOM)
    ) {
      return false;
    }

    return !_.includes(locationTypes, Settings.FLAGS.BOSS);
  }

  static bossLocation(dungeonName) {
    if (dungeonName === this.DUNGEONS.GANONS_TOWER) {
      return this.DEFEAT_GANONDORF_LOCATION;
    }

    const detailedLocations = Locations.detailedLocationsForGeneralLocation(dungeonName);

    return _.find(
      detailedLocations,
      (detailedLocation) => {
        const locationTypes = Locations.getLocation(
          dungeonName,
          detailedLocation,
          Locations.KEYS.TYPES,
        );

        return _.includes(locationTypes, Settings.FLAGS.BOSS);
      },
    );
  }

  static smallKeyName(dungeonName) {
    const shortDungeonName = this._shortDungeonName(dungeonName);
    return `${shortDungeonName} Small Key`;
  }

  static bigKeyName(dungeonName) {
    const shortDungeonName = this._shortDungeonName(dungeonName);
    return `${shortDungeonName} Big Key`;
  }

  static dungeonMapName(dungeonName) {
    const shortDungeonName = this._shortDungeonName(dungeonName);
    return `${shortDungeonName} Dungeon Map`;
  }

  static compassName(dungeonName) {
    const shortDungeonName = this._shortDungeonName(dungeonName);
    return `${shortDungeonName} Compass`;
  }

  static maxSmallKeysForDungeon(dungeonName) {
    const smallKeyName = this.smallKeyName(dungeonName);
    return this.maxItemCount(smallKeyName);
  }

  static smallKeysRequiredForLocation(generalLocation, detailedLocation) {
    const maxSmallKeys = this.maxSmallKeysForDungeon(generalLocation);

    for (let numSmallKeys = 0; numSmallKeys <= maxSmallKeys; numSmallKeys += 1) {
      if (
        this.isLocationAvailableWithSmallKeys(
          generalLocation,
          detailedLocation,
          {
            numSmallKeys,
            nonKeyRequirementMet: () => true, // assume we have all items that aren't keys
          },
        )
      ) {
        return numSmallKeys;
      }
    }

    // istanbul ignore next
    throw Error(`Could not determine keys required for location: ${generalLocation} - ${detailedLocation}`);
  }

  static isLocationAvailableWithSmallKeys(
    generalLocation,
    detailedLocation,
    {
      numSmallKeys,
      nonKeyRequirementMet,
    },
  ) {
    const requirementsForLocation = this.requirementsForLocation(
      generalLocation,
      detailedLocation,
      false,
    );

    const smallKeyName = this.smallKeyName(generalLocation);

    return requirementsForLocation.evaluate({
      isItemTrue: (requirement) => {
        const itemCountRequirement = this.parseItemCountRequirement(requirement);

        if (!_.isNil(itemCountRequirement)) {
          const {
            countRequired,
            itemName,
          } = itemCountRequirement;

          if (itemName === smallKeyName) {
            return numSmallKeys >= countRequired;
          }
        }

        return nonKeyRequirementMet(requirement);
      },
    });
  }

  static requirementsForLocation(generalLocation, detailedLocation, isFlattened) {
    const rawRequirements = this._rawRequirementsForLocation(
      generalLocation,
      detailedLocation,
      isFlattened,
    );
    return this._simplifiedItemRequirements(rawRequirements);
  }

  static requirementsForEntrance(entranceName) {
    const macroName = this._macroNameForEntrance(entranceName);
    const rawRequirements = this._booleanExpressionForRequirements(macroName, false);
    return this._simplifiedItemRequirements(rawRequirements);
  }

  static prettyNameForItemRequirement(itemRequirement) {
    const itemCountRequirement = this.parseItemCountRequirement(itemRequirement);

    if (!_.isNil(itemCountRequirement)) {
      const {
        itemName,
        countRequired,
      } = itemCountRequirement;

      return this._prettyNameOverride(itemName, countRequired) || itemRequirement;
    }

    return this._prettyNameOverride(itemRequirement) || itemRequirement;
  }

  static prettyNameForItem(itemName, itemCount) {
    const prettyNameOverride = this._prettyNameOverride(itemName, itemCount);

    if (!_.isNil(prettyNameOverride)) {
      return prettyNameOverride;
    }

    if (_.isNil(itemCount)) {
      return itemName;
    }

    const maxItemCount = LogicHelper.maxItemCount(itemName);
    if (maxItemCount > 1) {
      return `${itemName} (${itemCount}/${maxItemCount})`;
    }

    return itemName;
  }

  static islandFromChartForIsland(chartFromIsland) {
    return chartFromIsland.replace('Chart for ', '');
  }

  static islandForChart(chart) {
    const index = _.indexOf(CHARTS, chart);
    const island = _.get(ISLANDS, index, null);

    return island;
  }

  static chartForIsland(islandName) {
    const islandIndex = _.indexOf(ISLANDS, islandName);
    const chartName = _.get(CHARTS, islandIndex);

    let chartType;
    if (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS) || _.includes(chartName, 'Treasure')) {
      chartType = this.CHART_TYPES.TREASURE;
    } else {
      chartType = this.CHART_TYPES.TRIFORCE;
    }

    return {
      chartName,
      chartType,
    };
  }

  static chartForIslandName(island) {
    return `Chart for ${island}`;
  }

  static requiredBossesModeBannedLocations(dungeonName) {
    const detailedLocations = Locations.detailedLocationsForGeneralLocation(dungeonName);
    const dungeonLocations = _.map(detailedLocations, (detailedLocation) => ({
      generalLocation: dungeonName,
      detailedLocation,
    }));

    const requiredBossData = this._requiredBossDataForDungeon(dungeonName);
    if (_.isNil(requiredBossData)) {
      // istanbul ignore next
      throw Error(`Could not find required boss for dungeon: ${dungeonName}`);
    }

    return _.concat(
      dungeonLocations,
      requiredBossData.additionalBannedLocations,
    );
  }

  static bossRequirementForDungeon(dungeonName) {
    const requiredBossData = this._requiredBossDataForDungeon(dungeonName);
    if (_.isNil(requiredBossData)) {
      // istanbul ignore next
      throw Error(`Could not find required boss for dungeon: ${dungeonName}`);
    }

    return requiredBossData.requirement;
  }

  static bossLocationForRequirement(requirement) {
    const requiredBossData = this._requiredBossDataForRequirement(requirement);
    if (_.isNil(requiredBossData)) {
      return null;
    }

    const { dungeonName } = requiredBossData;
    return {
      generalLocation: dungeonName,
      detailedLocation: this.bossLocation(dungeonName),
    };
  }

  static setBossRequired(dungeonName) {
    this.nonRequiredBossDungeons = _.without(this.nonRequiredBossDungeons, dungeonName);
    this._invalidateForNonRequiredBosses();
  }

  static setBossNotRequired(dungeonName) {
    this.nonRequiredBossDungeons = _.concat(this.nonRequiredBossDungeons, dungeonName);
    this._invalidateForNonRequiredBosses();
  }

  static isBossRequired(dungeonName) {
    return !_.includes(this.nonRequiredBossDungeons, dungeonName);
  }

  static anyNonRequiredBossesRemaining() {
    const numRequiredBosses = Settings.getOptionValue(
      Permalink.OPTIONS.NUM_REQUIRED_BOSSES,
    );
    const maxNonRequiredBosses = _.size(REQUIRED_BOSSES) - numRequiredBosses;
    return _.size(this.nonRequiredBossDungeons) < maxNonRequiredBosses;
  }

  static _prettyNameOverride(itemName, itemCount = 1) {
    return _.get(PRETTY_ITEM_NAMES, [itemName, itemCount]);
  }

  static _rawRequirementsForLocation(generalLocation, detailedLocation, isFlattened) {
    const requirements = Locations.getLocation(
      generalLocation,
      detailedLocation,
      Locations.KEYS.NEED,
    );
    return this._booleanExpressionForRequirements(requirements, isFlattened);
  }

  static _shortDungeonName(dungeonName) {
    const dungeonIndex = _.indexOf(DUNGEONS, dungeonName);
    return SHORT_DUNGEON_NAMES[dungeonIndex];
  }

  static _macroNameForEntrance(entranceName) {
    const entranceData = this._entranceDataForInternalName(entranceName);
    if (_.isNil(entranceData)) {
      // istanbul ignore next
      throw Error(`Could not find macro name for entrance: ${entranceName}`);
    }

    return `Can Access ${entranceData.entranceMacroName}`;
  }

  static _simplifiedItemRequirements(requirements) {
    return requirements.simplify({
      implies: (
        firstRequirement,
        secondRequirement,
      ) => this._requirementImplies(firstRequirement, secondRequirement),
    });
  }

  static _requirementImplies(firstRequirement, secondRequirement) {
    if (firstRequirement === secondRequirement) {
      return true;
    }

    if (firstRequirement === this.TOKENS.IMPOSSIBLE) {
      return true;
    }

    if (secondRequirement === this.TOKENS.NOTHING) {
      return true;
    }

    const firstItemCountRequirement = LogicHelper.parseItemCountRequirement(firstRequirement);
    const secondItemCountRequirement = LogicHelper.parseItemCountRequirement(secondRequirement);

    if (!_.isNil(firstItemCountRequirement) && !_.isNil(secondItemCountRequirement)) {
      if (firstItemCountRequirement.itemName === secondItemCountRequirement.itemName) {
        return firstItemCountRequirement.countRequired > secondItemCountRequirement.countRequired;
      }
    }

    return false;
  }

  static _setStartingAndImpossibleItems() {
    this.startingItems = {
      [this.ITEMS.WIND_WAKER]: 1,
      [this.ITEMS.BOATS_SAIL]: 1,
      [this.ITEMS.WINDS_REQUIEM]: 1,
      [this.ITEMS.TRIFORCE_SHARD]: Settings.getOptionValue(
        Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS,
      ),
    };
    this.impossibleItems = {};

    const startingGear = Settings.getStartingGear();
    _.merge(this.startingItems, startingGear);

    const swordMode = Settings.getOptionValue(Permalink.OPTIONS.SWORD_MODE);
    if (swordMode === Permalink.SWORD_MODE_OPTIONS.START_WITH_HEROS_SWORD) {
      this.startingItems[this.ITEMS.PROGRESSIVE_SWORD] += 1;
    } else if (swordMode === Permalink.SWORD_MODE_OPTIONS.SWORDLESS) {
      this.impossibleItems = {
        [this.ITEMS.PROGRESSIVE_SWORD]: 1,
        [this.ITEMS.HURRICANE_SPIN]: 1,
      };
    }
  }

  static _splitExpression(expression) {
    return _.compact(
      _.map(expression.split(/\s*([(&|)])\s*/g), _.trim),
    );
  }

  static _checkOptionEnabledRequirement(requirement) {
    const matchers = [
      {
        regex: /^Option "([^"]+)" Enabled$/,
        value: (optionValue) => optionValue,
      },
      {
        regex: /^Option "([^"]+)" Disabled$/,
        value: (optionValue) => !optionValue,
      },
      {
        regex: /^Option "([^"]+)" Is "([^"]+)"$/,
        value: (optionValue, expectedValue) => optionValue === expectedValue,
      },
      {
        regex: /^Option "([^"]+)" Is Not "([^"]+)"$/,
        value: (optionValue, expectedValue) => optionValue !== expectedValue,
      },
      {
        regex: /^Option "([^"]+)" Contains "([^"]+)"$/,
        value: (optionValue, expectedValue) => _.get(optionValue, expectedValue),
      },
      {
        regex: /^Option "([^"]+)" Does Not Contain "([^"]+)"$/,
        value: (optionValue, expectedValue) => !_.get(optionValue, expectedValue),
      },
    ];

    let optionEnabledRequirementValue;

    _.forEach(matchers, (matcher) => {
      const requirementMatch = requirement.match(matcher.regex);
      if (requirementMatch) {
        const optionName = requirementMatch[1];
        const optionValue = Settings.getOptionValue(optionName);
        const expectedValue = requirementMatch[2];

        optionEnabledRequirementValue = matcher.value(optionValue, expectedValue);

        return false; // break loop
      }
      return true; // continue
    });

    if (_.isNil(optionEnabledRequirementValue)) {
      return null;
    }

    return optionEnabledRequirementValue
      ? this.TOKENS.NOTHING
      : this.TOKENS.IMPOSSIBLE;
  }

  static _checkOtherLocationRequirement(requirement, isFlattened) {
    let otherLocationMatch = _.get(requirement.match(this.CAN_ACCESS_ITEM_LOCATION_REGEX), 1);

    if (_.isNil(otherLocationMatch) && isFlattened) {
      otherLocationMatch = _.get(requirement.match(this.HAS_ACCESSED_OTHER_LOCATION_REGEX), 1);
    }

    if (otherLocationMatch) {
      const {
        generalLocation,
        detailedLocation,
      } = Locations.splitLocationName(otherLocationMatch);

      return this._rawRequirementsForLocation(generalLocation, detailedLocation, isFlattened);
    }

    return null;
  }

  static _checkPredeterminedItemRequirement(requirement) {
    let itemName;
    let countRequired;

    const itemCountRequirement = LogicHelper.parseItemCountRequirement(requirement);
    if (!_.isNil(itemCountRequirement)) {
      ({ itemName, countRequired } = itemCountRequirement);
    } else {
      itemName = requirement;
      countRequired = 1;
    }

    if (_.isNil(this.startingItems)) {
      // istanbul ignore next
      throw Error('LogicHelper not initialized: startingItems is null');
    }
    if (_.isNil(this.impossibleItems)) {
      // istanbul ignore next
      throw Error('LogicHelper not initialized: impossibleItems is null');
    }

    const startingItemValue = _.get(this.startingItems, itemName);
    if (!_.isNil(startingItemValue) && startingItemValue >= countRequired) {
      return this.TOKENS.NOTHING;
    }

    const impossibleItemValue = _.get(this.impossibleItems, itemName);
    if (!_.isNil(impossibleItemValue) && impossibleItemValue <= countRequired) {
      return this.TOKENS.IMPOSSIBLE;
    }

    return null;
  }

  static _checkBossRequirement(requirement, isFlattened) {
    const requiredBossData = this._requiredBossDataForRequirement(requirement);
    if (_.isNil(requiredBossData)) {
      return null;
    }

    if (_.isNil(this.nonRequiredBossDungeons)) {
      // istanbul ignore next
      throw Error('LogicHelper not initialized: nonRequiredBossDungeons is null');
    }

    const { dungeonName } = requiredBossData;
    if (_.includes(this.nonRequiredBossDungeons, dungeonName)) {
      return this.TOKENS.NOTHING;
    }

    if (isFlattened) {
      const bossLocation = this.bossLocation(dungeonName);
      return this._rawRequirementsForLocation(dungeonName, bossLocation, true);
    }

    return requirement;
  }

  static _parseRequirement(requirement, isFlattened) {
    const macroValue = Macros.getMacro(requirement);
    if (macroValue) {
      return this._booleanExpressionForRequirements(macroValue, isFlattened);
    }

    const optionEnabledRequirementValue = this._checkOptionEnabledRequirement(requirement);
    if (!_.isNil(optionEnabledRequirementValue)) {
      return optionEnabledRequirementValue;
    }

    const otherLocationRequirementValue = this._checkOtherLocationRequirement(
      requirement,
      isFlattened,
    );
    if (!_.isNil(otherLocationRequirementValue)) {
      return otherLocationRequirementValue;
    }

    const predeterminedItemRequirementValue = this._checkPredeterminedItemRequirement(requirement);
    if (!_.isNil(predeterminedItemRequirementValue)) {
      return predeterminedItemRequirementValue;
    }

    const bossRequirementValue = this._checkBossRequirement(requirement, isFlattened);
    if (!_.isNil(bossRequirementValue)) {
      return bossRequirementValue;
    }

    return requirement;
  }

  static _booleanExpressionForTokens(expressionTokens, isFlattened) {
    const itemsForExpression = [];
    let expressionTypeToken;

    while (!_.isEmpty(expressionTokens)) {
      const currentToken = expressionTokens.shift();

      if (currentToken === this.TOKENS.AND || currentToken === this.TOKENS.OR) {
        expressionTypeToken = currentToken;
      } else if (currentToken === this.TOKENS.OPENING_PAREN) {
        const childExpression = this._booleanExpressionForTokens(expressionTokens, isFlattened);
        itemsForExpression.push(childExpression);
      } else if (currentToken === this.TOKENS.CLOSING_PAREN) {
        break;
      } else {
        const parsedRequirement = this._parseRequirement(currentToken, isFlattened);
        itemsForExpression.push(parsedRequirement);
      }
    }

    if (expressionTypeToken === this.TOKENS.OR) {
      return BooleanExpression.or(...itemsForExpression);
    }
    if (expressionTypeToken === this.TOKENS.AND || itemsForExpression.length <= 1) {
      return BooleanExpression.and(...itemsForExpression);
    }
    // istanbul ignore next
    throw Error(`No expression type for items: ${JSON.stringify(itemsForExpression)}`);
  }

  static _booleanExpressionForRequirements(requirements, isFlattened) {
    const expressionTokens = this._splitExpression(requirements);
    return this._booleanExpressionForTokens(expressionTokens, isFlattened);
  }

  static _allIslandEntrances() {
    return _.map(
      this._filterIslandEntrances(),
      (entranceData) => entranceData.internalName,
    );
  }

  static _allDungeonEntrances() {
    return _.map(
      this._filterDungeonEntrances(),
      (entranceData) => entranceData.internalName,
    );
  }

  static _filterIslandEntrances() {
    return _.filter(ISLAND_ENTRANCES, (entranceData) => {
      if (entranceData.isCave) {
        return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES);
      }
      if (entranceData.isInnerCave) {
        return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES);
      }
      if (entranceData.isFairyFountain) {
        return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES);
      }
      // istanbul ignore next
      throw Error(`Invalid entrance: ${entranceData.internalName}`);
    });
  }

  static _filterDungeonEntrances() {
    return _.filter(DUNGEON_ENTRANCES, (entranceData) => {
      if (entranceData.isDungeon) {
        return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES);
      }
      if (entranceData.isBoss) {
        return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES);
      }
      if (entranceData.isMiniboss) {
        return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES);
      }
      // istanbul ignore next
      throw Error(`Invalid entrance: ${entranceData.internalName}`);
    });
  }

  static _entranceDataForInternalName(entranceName) {
    return _.find(
      _.concat(DUNGEON_ENTRANCES, ISLAND_ENTRANCES),
      (entranceData) => entranceData.internalName === entranceName,
    );
  }

  static _isDungeonEntranceOrExit(entranceOrExit) {
    return _.some(
      DUNGEON_ENTRANCES,
      (entranceData) => entranceData.internalName === entranceOrExit,
    );
  }

  static _requiredBossDataForDungeon(dungeonName) {
    return _.find(
      REQUIRED_BOSSES,
      (requiredBossData) => requiredBossData.dungeonName === dungeonName,
    );
  }

  static _requiredBossDataForRequirement(requirement) {
    return _.find(
      REQUIRED_BOSSES,
      (requiredBossData) => requiredBossData.requirement === requirement,
    );
  }

  static _invalidateForNonRequiredBosses() {
    Memoizer.invalidate([
      this.requirementsForEntrance,
      this.requirementsForLocation,
      this._rawRequirementsForLocation,
    ]);
  }

  static _possibleEntrancesOrExits(entranceOrExit) {
    if (
      Settings.getOptionValue(Permalink.OPTIONS.MIX_ENTRANCES)
      === Permalink.MIX_ENTRANCES_OPTIONS.MIX_DUNGEONS_AND_CAVES_AND_FOUNTAINS
    ) {
      return this.allRandomEntrances();
    }
    if (this._isDungeonEntranceOrExit(entranceOrExit)) {
      return this._allDungeonEntrances();
    }
    return this._allIslandEntrances();
  }
}

export default LogicHelper;
