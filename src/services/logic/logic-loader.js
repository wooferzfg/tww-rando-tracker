import yaml from 'js-yaml';

import Settings from '../tracker/settings';

export default class LogicLoader {
  static async loadLogicFiles() {
    const itemLocationsFile = await this._loadLogicFile('item_locations.txt');
    const macrosFile = await this._loadLogicFile('macros.txt');

    return {
      itemLocationsFile,
      macrosFile
    };
  }

  static async _loadLogicFile(fileName) {
    const response = await fetch(`${this._LOGIC_FILES_URL_PREFIX}/${fileName}`);
    const fileData = await response.text();
    const parsedFile = yaml.safeLoad(fileData);
    return parsedFile;
  }

  static get _LOGIC_FILES_URL_PREFIX() {
    return `https://raw.githubusercontent.com/LagoLunatic/wwrando/${Settings.VERSION}/logic/`;
  }
}
