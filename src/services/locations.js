import _ from 'lodash';

export default class Locations {
  static initialize(itemLocationsFile) {
    this.locations = {};

    _.forEach(itemLocationsFile, (locationData, locationName) => {
      const {
        generalLocation,
        detailedLocation,
      } = this.splitLocationName(locationName);

      const filteredLocationData = _.pick(locationData, ['Need', 'Original item', 'Types']);

      _.forEach(filteredLocationData, (infoValue, infoKey) => {
        this.setLocation(generalLocation, detailedLocation, _.camelCase(infoKey), infoValue);
      });
    });
  }

  static reset() {
    this.locations = null;
  }

  static KEYS = {
    NEED: 'need',
    ORIGINAL_ITEM: 'originalItem',
    TYPES: 'types',
  };

  static readAll() {
    return _.cloneDeep(this.locations);
  }

  static mapLocations(locationIteratee) {
    const newLocations = {};

    _.forEach(this.locations, (generalLocationData, generalLocationName) => {
      _.forEach(_.keys(generalLocationData), (detailedLocationName) => {
        _.set(
          newLocations,
          [generalLocationName, detailedLocationName],
          locationIteratee(generalLocationName, detailedLocationName),
        );
      });
    });

    return newLocations;
  }

  static detailedLocationsForGeneralLocation(generalLocation) {
    const generalLocationInfo = _.get(this.locations, generalLocation);

    if (!generalLocationInfo) {
      throw Error(`General location not found: ${generalLocation}`);
    }

    return _.keys(generalLocationInfo);
  }

  static getLocation(generalLocation, detailedLocation, infoKey) {
    if (!_.has(this.locations, [generalLocation, detailedLocation])) {
      throw Error(`Location not found: ${generalLocation} - ${detailedLocation}`);
    }

    return _.get(this.locations, [generalLocation, detailedLocation, infoKey]);
  }

  static setLocation(generalLocation, detailedLocation, infoKey, infoValue) {
    _.set(this.locations, [generalLocation, detailedLocation, infoKey], infoValue);
  }

  static splitLocationName(fullLocationName) {
    const locationMatch = fullLocationName.match(/((?:(?! - ).)+) - (.+)/);

    if (!locationMatch) {
      throw Error(`Location name: "${fullLocationName}" could not be parsed!`);
    }

    return {
      generalLocation: locationMatch[1],
      detailedLocation: locationMatch[2],
    };
  }
}
