import _ from 'lodash';

import CAVE_ENTRANCES from '../data/cave-entrances';
import CAVES from '../data/caves';
import CHARTS from '../data/charts';
import DUNGEON_ENTRANCES from '../data/dungeon-entrances';
import DUNGEONS from '../data/dungeons';
import ISLANDS from '../data/islands';
import ITEMS from '../data/items';
import KEYS from '../data/keys';
import PRETTY_ITEM_NAMES from '../data/pretty-item-names';
import PROGRESSIVE_STARTING_ITEMS from '../data/progressive-starting-items';
import REGULAR_STARTING_ITEMS from '../data/regular-starting-items';
import SHORT_DUNGEON_NAMES from '../data/short-dungeon-names';

import BooleanExpression from './boolean-expression';
import Locations from './locations';
import Macros from './macros';
import Memoizer from './memoizer';
import Settings from './settings';

export default class LogicHelper {
  static initialize() {
    Memoizer.memoize(this, [
      this.requirementsForEntrance,
      this.requirementsForLocation,
      this.smallKeysRequiredForLocation
    ]);

    this._setStartingAndImpossibleItems();
  }

  static reset() {
    Memoizer.invalidate(this.requirementsForEntrance);
    Memoizer.invalidate(this.requirementsForLocation);
    Memoizer.invalidate(this.smallKeysRequiredForLocation);

    this.startingItems = null;
    this.impossibleItems = null;
  }

  static get TOKENS() {
    return {
      AND: '&',
      CLOSING_PAREN: ')',
      IMPOSSIBLE: 'Impossible',
      NOTHING: 'Nothing',
      OPENING_PAREN: '(',
      OR: '|'
    };
  }

  static get ITEM_REQUIREMENT_COLORS() {
    return {
      AVAILABLE_ITEM: 'available-item',
      INCONSEQUENTIAL_ITEM: 'inconsequential-item',
      PLAIN_TEXT: 'plain-text',
      UNAVAILABLE_ITEM: 'unavailable-item'
    };
  }

  static allItems() {
    return _.concat(
      _.map(CAVES, (cave) => this.caveEntryName(cave)),
      CHARTS,
      _.map(DUNGEONS, (dungeon) => this.dungeonEntryName(dungeon)),
      _.keys(ITEMS),
      _.keys(KEYS)
    );
  }

  static getStartingItems() {
    return this.startingItems;
  }

  static isMainDungeon(dungeonName) {
    if (dungeonName === 'Forsaken Fortress' || dungeonName === "Ganon's Tower") {
      return false;
    }
    return _.includes(DUNGEONS, dungeonName);
  }

  static shortDungeonName(dungeonName) {
    const dungeonIndex = _.indexOf(DUNGEONS, dungeonName);
    return SHORT_DUNGEON_NAMES[dungeonIndex];
  }

  static dungeonEntryName(dungeonName) {
    const shortDungeonName = this.shortDungeonName(dungeonName);
    return this._entryName(shortDungeonName);
  }

  static shortCaveName(caveName) {
    return _.replace(caveName, /Secret |Warp Maze /g, '');
  }

  static caveEntryName(caveName) {
    const shortCaveName = this.shortCaveName(caveName);
    return this._entryName(shortCaveName);
  }

  static isRandomDungeonEntrances() {
    return _.includes(this._randomizeEntrancesOption(), 'Dungeons');
  }

  static isRandomCaveEntrances() {
    return _.includes(this._randomizeEntrancesOption(), 'Secret Caves');
  }

  static isRandomEntrancesTogether() {
    return _.includes(this._randomizeEntrancesOption(), 'Together');
  }

  static parseItemCountRequirement(requirement) {
    const itemCountRequirementMatch = requirement.match(/((?:\w|\s)+) x(\d)/);

    if (itemCountRequirementMatch) {
      return {
        itemName: itemCountRequirementMatch[1],
        countRequired: _.toSafeInteger(itemCountRequirementMatch[2])
      };
    }

    return null;
  }

  static isValidDungeonLocation(generalLocation, detailedLocation) {
    if (_.includes(DUNGEONS, generalLocation)) {
      return this._isValidLocation(generalLocation, detailedLocation, true);
    }
    return false;
  }

  static isValidIslandLocation(generalLocation, detailedLocation) {
    if (_.includes(ISLANDS, generalLocation)) {
      return this._isValidLocation(generalLocation, detailedLocation, false);
    }
    return false;
  }

  static isPotentialKeyLocation(generalLocation, detailedLocation) {
    if (!this.isValidDungeonLocation(generalLocation, detailedLocation)) {
      return false;
    }

    if (!this.isMainDungeon(generalLocation)) {
      return false;
    }

    const locationTypes = Locations.getLocation(
      generalLocation,
      detailedLocation,
      Locations.KEYS.TYPES
    );
    if (_.includes(locationTypes, 'Tingle Chest') && !Settings.isFlagActive('Tingle Chest')) {
      return false;
    }

    const locationRequirements = Locations.getLocation(
      generalLocation,
      detailedLocation,
      Locations.KEYS.NEED
    );
    if (_.includes(locationRequirements, 'Big Key')) {
      return false;
    }

    return true;
  }

  static smallKeyName(dungeonName) {
    const shortDungeonName = this.shortDungeonName(dungeonName);
    return `${shortDungeonName} Small Key`;
  }

  static bigKeyName(dungeonName) {
    const shortDungeonName = this.shortDungeonName(dungeonName);
    return `${shortDungeonName} Big Key`;
  }

  static maxSmallKeysForDungeon(dungeonName) {
    const smallKeyName = this.smallKeyName(dungeonName);
    return _.get(KEYS, smallKeyName);
  }

  static smallKeysRequiredForLocation(generalLocation, detailedLocation) {
    const maxSmallKeys = this.maxSmallKeysForDungeon(generalLocation);

    for (let numSmallKeys = 0; numSmallKeys <= maxSmallKeys; numSmallKeys += 1) {
      if (this._isLocationAvailableWithSmallKeys(generalLocation, detailedLocation, numSmallKeys)) {
        return numSmallKeys;
      }
    }

    throw Error(`Could not determine keys required for location: ${generalLocation} - ${detailedLocation}`);
  }

  static requirementsForLocation(generalLocation, detailedLocation) {
    const rawRequirements = this._rawRequirementsForLocation(generalLocation, detailedLocation);
    return this._simplifiedItemRequirements(rawRequirements);
  }

  static requirementsForEntrance(dungeonOrCaveName) {
    const macroName = this._macroNameForEntrance(dungeonOrCaveName);
    const rawRequirements = this._booleanExpressionForRequirements(macroName);
    return this._simplifiedItemRequirements(rawRequirements);
  }

  static prettyNameForItemRequirement(itemRequirement) {
    const itemCountRequirement = this.parseItemCountRequirement(itemRequirement);

    if (!_.isNil(itemCountRequirement)) {
      const {
        itemName,
        countRequired
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

    const maxItemCount = _.get(ITEMS, itemName) || _.get(KEYS, itemName);
    if (!_.isNil(maxItemCount) && maxItemCount > 1) {
      return `${itemName} (${itemCount}/${maxItemCount})`;
    }

    return itemName;
  }

  static _prettyNameOverride(itemName, itemCount) {
    if (Settings.getOptionValue('randomizeCharts') && _.includes(itemName, ' Chart')) {
      const islandIndex = _.indexOf(CHARTS, itemName);
      return `Chart for ${_.get(ISLANDS, islandIndex)}`;
    }

    return _.get(PRETTY_ITEM_NAMES, [itemName, itemCount || 1]);
  }

  static _rawRequirementsForLocation(generalLocation, detailedLocation) {
    const requirements = Locations.getLocation(
      generalLocation,
      detailedLocation,
      Locations.KEYS.NEED
    );
    return this._booleanExpressionForRequirements(requirements);
  }

  static _macroNameForEntrance(dungeonOrCaveName) {
    const dungeonIndex = _.indexOf(DUNGEONS, dungeonOrCaveName);
    if (dungeonIndex >= 0) {
      const dungeonEntranceName = _.get(DUNGEON_ENTRANCES, dungeonIndex);
      return `Can Access Dungeon Entrance ${dungeonEntranceName}`;
    }

    const caveIndex = _.indexOf(CAVES, dungeonOrCaveName);
    if (caveIndex >= 0) {
      const caveEntranceName = _.get(CAVE_ENTRANCES, caveIndex);
      return `Can Access Secret Cave Entrance on ${caveEntranceName}`;
    }

    throw Error(`Could not find macro name for entrance: ${dungeonOrCaveName}`);
  }

  static _isLocationAvailableWithSmallKeys(generalLocation, detailedLocation, numSmallKeys) {
    const requirementsForLocation = this.requirementsForLocation(
      generalLocation,
      detailedLocation
    );

    const smallKeyName = this.smallKeyName(generalLocation);

    return requirementsForLocation.evaluate({
      isItemTrue: (requirement) => {
        const itemCountRequirement = this.parseItemCountRequirement(requirement);

        if (!_.isNil(itemCountRequirement)) {
          const {
            countRequired,
            itemName
          } = itemCountRequirement;

          if (itemName === smallKeyName) {
            return numSmallKeys >= countRequired;
          }
        }

        return true; // assume we have all items that aren't keys
      }
    });
  }

  static _simplifiedItemRequirements(requirements) {
    return requirements.simplify({
      implies: (
        firstRequirement,
        secondRequirement
      ) => this._requirementImplies(firstRequirement, secondRequirement)
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
      "Hero's Shield": 1,
      'Wind Waker': 1,
      "Boat's Sail": 1,
      "Wind's Requiem": 1,
      'Ballad of Gales': 1,
      'Song of Passing': 1,
      'Triforce Shard': Settings.getOptionValue('numStartingTriforceShards')
    };
    this.impossibleItems = {};

    let gearRemaining = Settings.getOptionValue('startingGear');
    _.forEach(REGULAR_STARTING_ITEMS, (itemName) => {
      this.startingItems[itemName] = gearRemaining % 2;
      gearRemaining = _.floor(gearRemaining / 2);
    });
    _.forEach(PROGRESSIVE_STARTING_ITEMS, (itemName) => {
      this.startingItems[itemName] = gearRemaining % 4;
      gearRemaining = _.floor(gearRemaining / 4);
    });

    const swordMode = Settings.getOptionValue('swordMode');
    if (swordMode === 'Start with Sword') {
      this.startingItems['Progressive Sword'] += 1;
    } else if (swordMode === 'Swordless') {
      this.impossibleItems = {
        'Progressive Sword': 1,
        'Hurricane Spin': 1
      };
    }
  }

  static _splitExpression(expression) {
    return _.compact(
      _.map(expression.split(/\s*([(&|)])\s*/g), _.trim)
    );
  }

  static _checkOptionEnabledRequirement(requirement) {
    const matchers = [
      {
        regex: /^Option "([^"]+)" Enabled$/,
        value: (optionValue) => optionValue
      },
      {
        regex: /^Option "([^"]+)" Disabled$/,
        value: (optionValue) => !optionValue
      },
      {
        regex: /^Option "([^"]+)" Is "([^"]+)"$/,
        value: (optionValue, expectedValue) => optionValue === expectedValue
      },
      {
        regex: /^Option "([^"]+)" Is Not "([^"]+)"$/,
        value: (optionValue, expectedValue) => optionValue !== expectedValue
      },
      {
        regex: /^Option "([^"]+)" Contains "([^"]+)"$/,
        value: (optionValue, expectedValue) => _.includes(optionValue, expectedValue)
      },
      {
        regex: /^Option "([^"]+)" Does Not Contain "([^"]+)"$/,
        value: (optionValue, expectedValue) => !_.includes(optionValue, expectedValue)
      }
    ];

    let optionEnabledRequirementValue;

    _.forEach(matchers, (matcher) => {
      const requirementMatch = requirement.match(matcher.regex);
      if (requirementMatch) {
        const optionName = _.camelCase(requirementMatch[1]);
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
        detailedLocation
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

  static _entryName(locationName) {
    return `Entered ${locationName}`;
  }

  static _randomizeEntrancesOption() {
    return Settings.getOptionValue('randomizeEntrances');
  }

  static _isValidLocation(generalLocation, detailedLocation, isDungeon) {
    if (_.includes(ISLANDS, generalLocation) && _.includes(DUNGEONS, generalLocation)) {
      const locationTypes = Locations.getLocation(
        generalLocation,
        detailedLocation,
        Locations.KEYS.TYPES
      );
      const hasDungeonType = _.includes(locationTypes, 'Dungeon');

      return hasDungeonType === isDungeon;
    }
    return true;
  }
}
