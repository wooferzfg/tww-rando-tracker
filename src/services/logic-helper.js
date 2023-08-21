import _ from 'lodash';

import BOSSES from '../data/bosses.json';
import CAVE_ENTRANCES from '../data/cave-entrances.json';
import CAVES from '../data/caves.json';
import CHARTS from '../data/charts.json';
import DUNGEON_ENTRANCES from '../data/dungeon-entrances.json';
import DUNGEONS from '../data/dungeons.json';
import ISLANDS from '../data/islands.json';
import ITEMS from '../data/items.json';
import KEYS from '../data/keys.json';
import MISC_LOCATIONS from '../data/misc-locations.json';
import PRETTY_ITEM_NAMES from '../data/pretty-item-names.json';
import RACE_MODE_BANNED_LOCATIONS from '../data/race-mode-banned-locations.json';
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
      'bossForDungeon',
      'bossLocation',
      'chartForIsland',
      'filterDetailedLocations',
      'islandFromChartForIsland',
      'islandForChart',
      'isPotentialKeyLocation',
      'isProgressLocation',
      'mainDungeons',
      'maxItemCount',
      'parseItemCountRequirement',
      'prettyNameForItem',
      'prettyNameForItemRequirement',
      'requirementsForEntrance',
      'requirementsForLocation',
      'shortEntranceName',
      'shortExitName',
      'smallKeysRequiredForLocation',
      '_raceModeDungeonBosses',
    ]);

    this._setStartingAndImpossibleItems();
  }

  static reset() {
    Memoizer.invalidate([
      this.allRandomEntrances,
      this.bossForDungeon,
      this.bossLocation,
      this.chartForIsland,
      this.filterDetailedLocations,
      this.islandFromChartForIsland,
      this.islandForChart,
      this.isPotentialKeyLocation,
      this.isProgressLocation,
      this.mainDungeons,
      this.maxItemCount,
      this.parseItemCountRequirement,
      this.prettyNameForItem,
      this.prettyNameForItemRequirement,
      this.requirementsForEntrance,
      this.requirementsForLocation,
      this.shortEntranceName,
      this.shortExitName,
      this.smallKeysRequiredForLocation,
      this._raceModeDungeonBosses,
    ]);

    this.startingItems = null;
    this.impossibleItems = null;
  }

  static DEFEAT_GANONDORF_LOCATION = 'Defeat Ganondorf';

  static NUM_TRIFORCE_CHARTS = 8;

  static DUNGEONS = Constants.createFromArray(DUNGEONS);

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
    _.map(CAVES, (cave) => this.entryName(cave)),
    CHARTS,
    _.map(ISLANDS, (island) => this.chartForIslandName(island)),
    _.map(this.mainDungeons(), (dungeon) => this.entryName(dungeon)),
    _.map(this._raceModeDungeonBosses(), (boss) => this.entryName(boss)),
    _.keys(ITEMS),
    _.keys(KEYS),
  );

  static ALL_TREASURE_CHARTS = _.range(1, CHARTS.length - this.NUM_TRIFORCE_CHARTS + 1).map((number) => `Treasure Chart ${number}`);

  static ALL_TRIFORCE_CHARTS = _.range(1, this.NUM_TRIFORCE_CHARTS + 1).map((number) => `Triforce Chart ${number}`);

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

  static mainDungeons() {
    return _.filter(DUNGEONS, (dungeon) => this.isMainDungeon(dungeon));
  }

  static isDungeon(dungeonName) {
    return _.includes(DUNGEONS, dungeonName);
  }

  static isRaceModeDungeon(dungeonName) {
    if (dungeonName === this.DUNGEONS.GANONS_TOWER) {
      return false;
    }
    return this.isDungeon(dungeonName);
  }

  static entryName(zoneName) {
    let entranceName;
    if (this._isBoss(zoneName)) {
      entranceName = zoneName;
    } else if (this.isDungeon(zoneName)) {
      entranceName = this._shortDungeonName(zoneName);
    } else {
      entranceName = this._shortCaveName(zoneName);
    }

    return this._entryNameForEntranceName(entranceName);
  }

  static shortEntranceName(zoneName) {
    if (this._isBoss(zoneName)) {
      const shortDungeonName = this._shortDungeonName(
        this._dungeonForBoss(zoneName),
      );
      return `${shortDungeonName} Boss Door`;
    }
    if (this.isDungeon(zoneName)) {
      return zoneName;
    }
    return this._shortCaveName(zoneName);
  }

  static shortExitName(zoneName) {
    if (this._isBoss(zoneName) || this.isDungeon(zoneName)) {
      return zoneName;
    }
    return this._shortCaveName(zoneName);
  }

  static cavesForIsland(islandName) {
    return _.compact(
      _.map(
        CAVE_ENTRANCES,
        (caveEntrance, caveIndex) => (
          _.startsWith(caveEntrance, islandName) ? _.get(CAVES, caveIndex) : null
        ),
      ),
    );
  }

  static isRandomEntrances() {
    return _.includes(
      [
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_TOGETHER,
      ],
      this._randomizeEntrancesOption(),
    );
  }

  static isRandomDungeonEntrances() {
    return _.includes(
      [
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_TOGETHER,
      ],
      this._randomizeEntrancesOption(),
    );
  }

  static isRandomCaveEntrances() {
    return _.includes(
      [
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.SECRET_CAVES,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_TOGETHER,
      ],
      this._randomizeEntrancesOption(),
    );
  }

  static isRandomBossEntrances() {
    return _.includes(
      [
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_SEPARATELY,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_TOGETHER,
      ],
      this._randomizeEntrancesOption(),
    );
  }

  static allRandomEntrances() {
    return _.concat(
      this._allDungeonEntrances(),
      this.isRandomCaveEntrances() ? CAVES : [],
    );
  }

  static randomEntrancesForExit(zoneName) {
    let possibleEntrances;
    if (this._isRandomEntrancesTogether()) {
      possibleEntrances = this.allRandomEntrances();
    } else if (this._isBoss(zoneName) || this.isDungeon(zoneName)) {
      possibleEntrances = this._allDungeonEntrances();
    } else {
      return CAVES;
    }

    if (this.isDungeon(zoneName) && this.isRandomBossEntrances()) {
      return _.without(possibleEntrances, this.bossForDungeon(zoneName));
    }
    return possibleEntrances;
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

  static isRandomizedChartsSettings() {
    return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS);
  }

  static isRandomizedChart(item) {
    return this.isRandomizedChartsSettings() && /(Treasure|Triforce) Chart (\d)+/.test(item);
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
      _.includes(locationTypes, Settings.FLAGS.TINGLE_CHEST)
      && !Settings.isFlagActive(Settings.FLAGS.TINGLE_CHEST)
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

  static bossForDungeon(dungeonName) {
    const dungeonIndex = _.indexOf(DUNGEONS, dungeonName);
    return BOSSES[dungeonIndex];
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

  static requirementsForLocation(generalLocation, detailedLocation) {
    const rawRequirements = this._rawRequirementsForLocation(generalLocation, detailedLocation);
    return this._simplifiedItemRequirements(rawRequirements);
  }

  static requirementsForEntrance(zoneName) {
    const macroName = this._macroNameForEntrance(zoneName);
    const rawRequirements = this._booleanExpressionForRequirements(macroName);
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

  static raceModeBannedLocations(dungeonName) {
    const detailedLocations = Locations.detailedLocationsForGeneralLocation(dungeonName);
    const dungeonLocations = _.map(detailedLocations, (detailedLocation) => ({
      generalLocation: dungeonName,
      detailedLocation,
    }));

    const additionalLocations = _.get(RACE_MODE_BANNED_LOCATIONS, dungeonName, []);

    return _.concat(dungeonLocations, additionalLocations);
  }

  static _prettyNameOverride(itemName, itemCount = 1) {
    return _.get(PRETTY_ITEM_NAMES, [itemName, itemCount]);
  }

  static _rawRequirementsForLocation(generalLocation, detailedLocation) {
    const requirements = Locations.getLocation(
      generalLocation,
      detailedLocation,
      Locations.KEYS.NEED,
    );
    return this._booleanExpressionForRequirements(requirements);
  }

  static _shortCaveName(caveName) {
    return _.replace(caveName, /Secret |Warp Maze /g, '');
  }

  static _shortDungeonName(dungeonName) {
    const dungeonIndex = _.indexOf(DUNGEONS, dungeonName);
    return SHORT_DUNGEON_NAMES[dungeonIndex];
  }

  static _macroNameForEntrance(zoneName) {
    const bossIndex = _.indexOf(BOSSES, zoneName);
    if (bossIndex >= 0) {
      const dungeonName = DUNGEONS[bossIndex];
      return `Can Access Boss Entrance in ${dungeonName}`;
    }

    const dungeonIndex = _.indexOf(DUNGEONS, zoneName);
    if (dungeonIndex >= 0) {
      const dungeonEntranceName = _.get(DUNGEON_ENTRANCES, dungeonIndex);
      return `Can Access Dungeon Entrance ${dungeonEntranceName}`;
    }

    const caveIndex = _.indexOf(CAVES, zoneName);
    if (caveIndex >= 0) {
      const caveEntranceName = _.get(CAVE_ENTRANCES, caveIndex);
      return `Can Access Secret Cave Entrance on ${caveEntranceName}`;
    }

    // istanbul ignore next
    throw Error(`Could not find macro name for entrance: ${zoneName}`);
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

    return optionEnabledRequirementValue;
  }

  static _checkOtherLocationRequirement(requirement) {
    const otherLocationMatch = requirement.match(/Can Access Other Location "([^"]+)"/);
    if (otherLocationMatch) {
      const {
        generalLocation,
        detailedLocation,
      } = Locations.splitLocationName(otherLocationMatch[1]);

      return this._rawRequirementsForLocation(generalLocation, detailedLocation);
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

    const startingItemValue = _.get(this.startingItems, itemName);
    if (!_.isNil(startingItemValue) && startingItemValue >= countRequired) {
      return true;
    }

    const impossibleItemValue = _.get(this.impossibleItems, itemName);
    if (!_.isNil(impossibleItemValue) && impossibleItemValue <= countRequired) {
      return false;
    }

    return null;
  }

  static _parseRequirement(requirement) {
    const macroValue = Macros.getMacro(requirement);
    if (macroValue) {
      return this._booleanExpressionForRequirements(macroValue);
    }

    const optionEnabledRequirementValue = this._checkOptionEnabledRequirement(requirement);
    if (!_.isNil(optionEnabledRequirementValue)) {
      return optionEnabledRequirementValue ? this.TOKENS.NOTHING : this.TOKENS.IMPOSSIBLE;
    }

    const otherLocationRequirementValue = this._checkOtherLocationRequirement(requirement);
    if (!_.isNil(otherLocationRequirementValue)) {
      return otherLocationRequirementValue;
    }

    const predeterminedItemRequirementValue = this._checkPredeterminedItemRequirement(requirement);
    if (!_.isNil(predeterminedItemRequirementValue)) {
      return predeterminedItemRequirementValue ? this.TOKENS.NOTHING : this.TOKENS.IMPOSSIBLE;
    }

    return requirement;
  }

  static _booleanExpressionForTokens(expressionTokens) {
    const itemsForExpression = [];
    let expressionTypeToken;

    while (!_.isEmpty(expressionTokens)) {
      const currentToken = expressionTokens.shift();

      if (currentToken === this.TOKENS.AND || currentToken === this.TOKENS.OR) {
        expressionTypeToken = currentToken;
      } else if (currentToken === this.TOKENS.OPENING_PAREN) {
        const childExpression = this._booleanExpressionForTokens(expressionTokens);
        itemsForExpression.push(childExpression);
      } else if (currentToken === this.TOKENS.CLOSING_PAREN) {
        break;
      } else {
        const parsedRequirement = this._parseRequirement(currentToken);
        itemsForExpression.push(parsedRequirement);
      }
    }

    if (expressionTypeToken === this.TOKENS.OR) {
      return BooleanExpression.or(...itemsForExpression);
    }
    return BooleanExpression.and(...itemsForExpression);
  }

  static _booleanExpressionForRequirements(requirements) {
    const expressionTokens = this._splitExpression(requirements);
    return this._booleanExpressionForTokens(expressionTokens);
  }

  static _entryNameForEntranceName(entranceName) {
    return `Entered ${entranceName}`;
  }

  static _randomizeEntrancesOption() {
    return Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_ENTRANCES);
  }

  static _isRandomEntrancesTogether() {
    return _.includes(
      [
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.DUNGEONS_AND_SECRET_CAVES_TOGETHER,
        Permalink.RANDOMIZE_ENTRANCES_OPTIONS.NESTED_DUNGEONS_AND_SECRET_CAVES_TOGETHER,
      ],
      this._randomizeEntrancesOption(),
    );
  }

  static _raceModeDungeonBosses() {
    const raceModeDungeons = _.filter(DUNGEONS, (dungeon) => this.isRaceModeDungeon(dungeon));

    return _.map(
      raceModeDungeons,
      (dungeonName) => this.bossForDungeon(dungeonName),
    );
  }

  static _isBoss(bossName) {
    return _.includes(BOSSES, bossName);
  }

  static _dungeonForBoss(bossName) {
    const bossIndex = _.indexOf(BOSSES, bossName);
    return DUNGEONS[bossIndex];
  }

  static _allDungeonEntrances() {
    if (!this.isRandomDungeonEntrances()) {
      return [];
    }
    if (!this.isRandomBossEntrances()) {
      return this.mainDungeons();
    }
    return _.concat(this.mainDungeons(), this._raceModeDungeonBosses());
  }
}

export default LogicHelper;
