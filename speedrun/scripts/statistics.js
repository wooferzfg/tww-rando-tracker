function updateStatistics() {
  // Locations Checked, Locations Remaining
  var checkedCount = 0;
  var availableCount = 0;
  var locationsRemaining = 0;
  var progressLocationsRemaining = 0;
  for (var i = 0; i < islands.length; i++) {
    var chests = getChestCountsForLocation(islands[i], false);
    checkedCount += chests.checked;
    availableCount += chests.available;
    locationsRemaining += chests.total;
    progressLocationsRemaining += chests.totalProgress;
  }
  for (var i = 0; i < dungeons.length; i++) {
    var chests = getChestCountsForLocation(dungeons[i], true);
    checkedCount += chests.checked;
    availableCount += chests.available;
    locationsRemaining += chests.total;
    progressLocationsRemaining += chests.totalProgress;
  }
  // don't include 'Defeat Ganondorf' as a treasure location
  if (!locationsChecked["Ganon's Tower"]['Defeat Ganondorf']) {
    locationsRemaining--;
    progressLocationsRemaining--;
    if (locationsAreAvailable["Ganon's Tower"]['Defeat Ganondorf']) {
      availableCount--;
    }
  } else {
    checkedCount--;
  }
  document.getElementById('stat-locationsChecked').innerText = checkedCount;
  document.getElementById('stat-locationsAvailable').innerText = availableCount;
  document.getElementById('stat-locationsRemaining').innerText = locationsRemaining;

  // Items Needed to Finish Game
  var finishRequirements = getLocationRequirements("Ganon's Tower - Defeat Ganondorf");
  var finishGameItems = itemsRequiredForExpression(items, finishRequirements);
  var countdown = finishGameItems.countdown;
  document.getElementById('stat-progressionRemaining').innerText = countdown;

  // Estimated Locations Left Over at End
  // average checks remaining = average draws without replacement probability
  var averageChecksRemaining = Math.min(progressLocationsRemaining, (countdown * (progressLocationsRemaining + 1)) / (countdown + 1));
  document.getElementById('stat-estimatedLeftToCheck').innerText = Math.round(averageChecksRemaining);
}
