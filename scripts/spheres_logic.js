function calculateSpheres() {
  var previousLocations = locationsAreAvailable;

  var tempItems = {};
  Object.keys(items).forEach(function (item) {
    tempItems[item] = 0;
  });
  Object.keys(startingItems).forEach(function (item) {
    tempItems[item] = startingItems[item];
  });

  spheres = setLocations(() => '?');
  var newLocations = true;
  var newKeys = false;
  var curSphere = 0;
  while (newLocations) {
    newLocations = false;
    newKeys = false;
    Object.keys(itemLocations).forEach((locationName) => {
      var split = locationName.indexOf(' - ');
      var generalLocation = locationName.substring(0, split);
      var detailedLocation = locationName.substring(split + 3);
      if (spheres[generalLocation][detailedLocation] == '?'
        && isLocationAvailable(locationName, tempItems)) {
        if (itemsForLocations[generalLocation][detailedLocation].endsWith(" Key")) {
          spheres[generalLocation][detailedLocation] = curSphere;
          tempItems[itemsForLocations[generalLocation][detailedLocation]] += 1;
          newKeys = true;
          newLocations = true;
        }
      }
    });
    if (newKeys) {
      continue;
    }
    var newTempItems = {};
    Object.keys(tempItems).forEach(function (item) {
      newTempItems[item] = tempItems[item];
    });
    setGuaranteedKeys(tempItems, newTempItems, true);
    Object.keys(itemLocations).forEach((locationName) => {
      var split = locationName.indexOf(' - ');
      var generalLocation = locationName.substring(0, split);
      var detailedLocation = locationName.substring(split + 3);
      if (spheres[generalLocation][detailedLocation] == '?'
        && isLocationAvailable(locationName, tempItems)) {
        newLocations = true;
        spheres[generalLocation][detailedLocation] = curSphere;
        newTempItems[itemsForLocations[generalLocation][detailedLocation]] += 1;
      }
    });
    Object.keys(tempItems).forEach((itemName) => {
      tempItems[itemName] = Math.max(tempItems[itemName], newTempItems[itemName]);
    });
    curSphere += 1;
  }

  locationsAreAvailable = previousLocations;

  if (currentGeneralLocation) {
    var detailedLocations = getDetailedLocations(currentGeneralLocation, currentLocationIsDungeon);
    for (var i = 0; i < 36; i++) {
      var l = 'detaillocation' + i.toString();
      var element = document.getElementById(l);
      var detailedLocation = getLocationName(element.innerText);
      if (i < detailedLocations.length) {
        element.innerText = "[" + spheres[currentGeneralLocation][detailedLocation] + "] " + detailedLocation;
      }
    }
  }
}
