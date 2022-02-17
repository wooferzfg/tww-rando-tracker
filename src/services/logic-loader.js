import yaml from 'js-yaml';

import Settings from './settings';

class LogicLoader {
  static async loadLogicFiles() {
    const itemLocationsFile = await this._loadLogicFile('item_locations.txt');
    const macrosFile = await this._loadLogicFile('macros.txt');

    return {
      itemLocationsFile,
      macrosFile,
    };
  }

  static async _loadLogicFile(fileName) {
    const fileUrl = this._logicFileUrl(fileName);
    const fileData = await this._loadFileFromUrl(fileUrl);
    const parsedFile = yaml.load(fileData);
    return parsedFile;
  }

  static async _loadFileFromUrl(url) {
    const response = await fetch(url);
    const fileData = await response.text();
    return fileData;
  }

  static _logicFileUrl(fileName) {
    return `https://raw.githubusercontent.com/LagoLunatic/wwrando/${Settings.getVersion()}/logic/${fileName}`;
  }
}

export default LogicLoader;
