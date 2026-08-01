import yaml from 'js-yaml';

import Settings from './settings';

class LogicLoader {
  static async loadLogicFiles() {
    const itemLocationsFile = await this.#loadLogicFile('item_locations.txt');
    const macrosFile = await this.#loadLogicFile('macros.txt');

    return {
      itemLocationsFile,
      macrosFile,
    };
  }

  static async #loadLogicFile(fileName) {
    const fileUrl = this.#logicFileUrl(fileName);
    const fileData = await this.#loadFileFromUrl(fileUrl);
    const parsedFile = yaml.load(fileData);
    return parsedFile;
  }

  static async #loadFileFromUrl(url) {
    const response = await fetch(url);
    const fileData = await response.text();
    return fileData;
  }

  static #logicFileUrl(fileName) {
    return `https://raw.githubusercontent.com/LagoLunatic/wwrando/${Settings.getVersion()}/logic/${fileName}`;
  }
}

export default LogicLoader;
