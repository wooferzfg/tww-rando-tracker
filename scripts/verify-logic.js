import _ from 'lodash';

import TEST_ITEM_LOCATIONS from '../src/data/test-item-locations.json';
import TEST_MACROS from '../src/data/test-macros.json';
import Locations from '../src/services/locations';
import LogicCalculation from '../src/services/logic-calculation';
import LogicHelper from '../src/services/logic-helper';
import LogicLoader from '../src/services/logic-loader';
import LogicTweaks from '../src/services/logic-tweaks';
import Permalink from '../src/services/permalink';
import TrackerController from '../src/services/tracker-controller';

LogicLoader.loadLogicFiles = async () => ({
  itemLocationsFile: TEST_ITEM_LOCATIONS,
  macrosFile: TEST_MACROS,
});

LogicTweaks.applyHasAccessedLocationTweaksForLocations = () => { };

const verifyLogicForItemCounts = (
  generalLocation,
  detailedLocation,
  trackerState,
  zippedItemCounts,
) => {
  _.forEach(zippedItemCounts, ([itemName, itemCount]) => {
    _.set(trackerState.items, itemName, itemCount);
  });

  const logic = new LogicCalculation(trackerState);

  const simplifiedRequirements = LogicHelper.requirementsForLocation(
    generalLocation,
    detailedLocation,
    false,
  );
  const rawRequirements = LogicHelper.rawRequirementsForLocation(
    generalLocation,
    detailedLocation,
    false,
  );

  const simplifiedRequirementsMet = logic.areRequirementsMet(simplifiedRequirements);
  const rawRequirementsMet = logic.areRequirementsMet(rawRequirements);

  if (simplifiedRequirementsMet !== rawRequirementsMet) {
    throw Error(
      `Incorrect result for location: ${generalLocation} - ${detailedLocation}\n\n`
      + `Raw requirements result: ${rawRequirementsMet}\n`
      + `Simplified requirements result ${simplifiedRequirementsMet}\n\n`
      + `Raw requirements: ${JSON.stringify(rawRequirements, null, 2)}\n\n`
      + `Simplified requirements: ${JSON.stringify(simplifiedRequirements, null, 2)}\n\n`
      + `Current items: ${JSON.stringify(zippedItemCounts, null, 2)}`,
    );
  }
};

const verifyLogicForLocation = (generalLocation, detailedLocation, trackerState) => {
  console.log(`\nChecking location "${generalLocation} - ${detailedLocation}":`); // eslint-disable-line no-console
  const rawRequirements = LogicHelper.rawRequirementsForLocation(
    generalLocation,
    detailedLocation,
    false,
  );
  const rawItemsRequired = new Set();

  const addItemToList = ({ item, isReduced }) => {
    if (!isReduced) {
      rawItemsRequired.add(item);
    }
  };

  rawRequirements.reduce({
    andInitialValue: null,
    orInitialValue: null,
    andReducer: addItemToList,
    orReducer: addItemToList,
  });

  const rawItemsRequiredList = [...rawItemsRequired];
  const itemsRequired = _.filter(
    LogicHelper.ALL_ITEMS,
    (item) => _.some(rawItemsRequiredList, (reqItem) => reqItem.includes(item)),
  );

  const itemCounts = _.times(_.size(itemsRequired), _.constant(0));
  let combinationsChecked = 0;

  while (true) { // eslint-disable-line no-constant-condition
    verifyLogicForItemCounts(
      generalLocation,
      detailedLocation,
      trackerState,
      _.zip(itemsRequired, itemCounts),
    );

    combinationsChecked += 1;

    if (combinationsChecked % 2000 === 0) {
      console.log(`Checked ${combinationsChecked} combinations...`); // eslint-disable-line no-console
    }

    let nextIndex = _.size(itemCounts) - 1;
    while (
      nextIndex >= 0
      && itemCounts[nextIndex] >= LogicHelper.maxItemCount(itemsRequired[nextIndex])
    ) {
      nextIndex -= 1;
    }

    if (nextIndex < 0) {
      break;
    }

    itemCounts[nextIndex] += 1;
    for (let index = nextIndex + 1; index < _.size(itemCounts); index += 1) {
      itemCounts[index] = 0;
    }
  }

  console.log('Done!'); // eslint-disable-line no-console
};

const verifyLogicForSettings = async (permalink) => {
  console.log(`\n\nChecking settings: ${permalink}\n\n`); // eslint-disable-line no-console
  TrackerController.reset();

  const { trackerState } = await TrackerController.initializeFromPermalink(permalink);

  Locations.mapLocations((generalLocation, detailedLocation) => (
    verifyLogicForLocation(generalLocation, detailedLocation, trackerState)
  ));
};

const script = async () => {
  await verifyLogicForSettings('bWFzdGVyAEEASRBQGAAA+wLIBQAAAAAAAAAAAIAA'); // no starting items
  await verifyLogicForSettings(Permalink.DEFAULT_PERMALINK);
};

script();
