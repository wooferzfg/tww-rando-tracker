import fs from 'fs';

import _ from 'lodash';

import Locations from '../src/services/locations';
import LogicHelper from '../src/services/logic-helper';
import LogicLoader from '../src/services/logic-loader';
import LogicTweaks from '../src/services/logic-tweaks';
import Macros from '../src/services/macros';
import Permalink from '../src/services/permalink';
import Settings from '../src/services/settings';
import TrackerController from '../src/services/tracker-controller';
import TrackerState from '../src/services/tracker-state';

const TEST_ITEM_LOCATIONS_PATH = './src/data/test-item-locations.json';
const TEST_MACROS_PATH = './src/data/test-macros.json';
const TEST_SAVE_DATA_PATH = './src/data/test-save-data.json';

const writeFile = (filePath, fileData) => {
  fs.writeFileSync(filePath, fileData);
};

const writeJsonFile = (filePath, jsonData) => {
  writeFile(filePath, `${JSON.stringify(jsonData, null, 2)}\n`);
};

const script = async () => {
  Settings.initializeFromPermalink(Permalink.DEFAULT_PERMALINK);
  Settings.version = 'master';

  const {
    itemLocationsFile,
    macrosFile,
  } = await LogicLoader.loadLogicFiles();

  Locations.initialize(_.cloneDeep(itemLocationsFile));
  Macros.initialize(_.cloneDeep(macrosFile));

  LogicTweaks.applyTweaks();

  LogicHelper.initialize();

  const { saveData } = TrackerController.refreshState(
    TrackerState.default(),
  );

  writeJsonFile(TEST_ITEM_LOCATIONS_PATH, itemLocationsFile);
  writeJsonFile(TEST_MACROS_PATH, macrosFile);
  writeFile(TEST_SAVE_DATA_PATH, saveData);
};

script();
