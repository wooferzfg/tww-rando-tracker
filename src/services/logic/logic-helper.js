import _ from 'lodash';

import CAVES from '../../data/caves';
import CHARTS from '../../data/charts';
import DUNGEONS from '../../data/dungeons';
import ITEMS from '../../data/items';
import KEYS from '../../data/keys';
import PROGRESSIVE_STARTING_ITEMS from '../../data/progressive-starting-items';
import REGULAR_STARTING_ITEMS from '../../data/regular-starting-items';
import SHORT_DUNGEON_NAMES from '../../data/short-dungeon-names';

import BooleanExpression from './boolean-expression';
import Locations from './locations';
import Macros from './macros';
import Memoizer from './memoizer';
import Settings from '../tracker/settings';

export default class LogicHelper {
  static initialize() {
    Memoizer.memoize(this, ['getRequirementsForLocation']);

    this._setStartingAndImpossibleItems();
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

  static allItems() {
    return _.concat(
      _.map(CAVES, (cave) => this.caveEntryName(cave)),
      CHARTS,
      _.map(DUNGEONS, (dungeon) => this.dungeonEntryName(dungeon)),
      _.keys(ITEMS),
      _.keys(KEYS)
    );
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
    this.impossibleItems = [];

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
      this.impossibleItems = [
        'Progressive Sword x1',
        'Progressive Sword x2',
        'Progressive Sword x3',
        'Progressive Sword x4',
        'Hurricane Spin'
      ];
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

      return this.getRequirementsForLocation(generalLocation, detailedLocation);
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

  static getRequirementsForLocation(generalLocation, detailedLocation) {
    const requirements = Locations.getLocation(generalLocation, detailedLocation).need;
    return this._booleanExpressionForRequirements(requirements);
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

  static _entryName(locationName) {
    return `Entered ${locationName}`;
  }

  static _randomizeEntrancesOption() {
    return Settings.getOptionValue('randomizeEntrances');
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
}
