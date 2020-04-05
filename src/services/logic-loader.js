import yaml from 'js-yaml';

import Settings from './settings';

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
    const fileUrl = this._logicFileUrl(fileName);
    const response = await fetch(fileUrl);
    const fileData = await response.text();
    const parsedFile = yaml.safeLoad(fileData);
    return parsedFile;
  }

  static _logicFileUrl(fileName) {
    return `https://raw.githubusercontent.com/LagoLunatic/wwrando/${Settings.getVersion()}/logic/${fileName}`;
  }
}
