import _ from 'lodash';

class Locations {
  static initialize(itemLocationsFile) {
    this.locations = {};
    this.locationsList = [];

    _.forEach(itemLocationsFile, (locationData, locationName) => {
      const {
        generalLocation,
        detailedLocation,
      } = this.splitLocationName(locationName);

      this.addLocation(generalLocation, detailedLocation);

      const filteredLocationData = _.pick(locationData, ['Need', 'Original item', 'Types']);

      _.forEach(filteredLocationData, (infoValue, infoKey) => {
        this.setLocation(generalLocation, detailedLocation, _.camelCase(infoKey), infoValue);
      });
    });
  }

  static initializeRaw(itemLocations, locationsList) {
    this.locations = itemLocations;
    this.locationsList = locationsList;
  }

  static reset() {
    this.locations = null;
    this.locationsList = null;
  }

  static KEYS = {
    NEED: 'need',
    ORIGINAL_ITEM: 'originalItem',
    TYPES: 'types',
  };

  static readAll() {
    return this.locations;
  }

  static readLocationsList() {
    return this.locationsList;
  }

  static allGeneralLocations() {
    return _.keys(this.locations);
  }

  static locationsLoaded() {
    return !_.isNil(this.locations);
  }

  static mapLocations(locationIteratee) {
    const newLocations = {};

    _.forEach(this.locationsList, ({ generalLocation, detailedLocation }) => {
      _.set(
        newLocations,
        [generalLocation, detailedLocation],
        locationIteratee(generalLocation, detailedLocation),
      );
    });

    return newLocations;
  }

  static detailedLocationsForGeneralLocation(generalLocation) {
    const generalLocationInfo = _.get(this.locations, generalLocation);

    if (!generalLocationInfo) {
      // istanbul ignore next
      throw Error(`General location not found: ${generalLocation}`);
    }

    return _.keys(generalLocationInfo);
  }

  static getLocation(generalLocation, detailedLocation, infoKey) {
    if (!_.has(this.locations, [generalLocation, detailedLocation])) {
      // istanbul ignore next
      throw Error(`Location not found: ${generalLocation} - ${detailedLocation}`);
    }

    return _.get(this.locations, [generalLocation, detailedLocation, infoKey]);
  }

  static setLocation(generalLocation, detailedLocation, infoKey, infoValue) {
    _.set(this.locations, [generalLocation, detailedLocation, infoKey], infoValue);
  }

  static addLocation(generalLocation, detailedLocation) {
    this.locationsList.push({ generalLocation, detailedLocation });
  }

  static splitLocationName(fullLocationName) {
    const locationMatch = fullLocationName.match(/((?:(?! - ).)+) - (.+)/);

    if (!locationMatch) {
      // istanbul ignore next
      throw Error(`Location name: "${fullLocationName}" could not be parsed!`);
    }

    return {
      generalLocation: locationMatch[1],
      detailedLocation: locationMatch[2],
    };
  }
}

export default Locations;
