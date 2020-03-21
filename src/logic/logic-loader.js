import yaml from 'js-yaml';

export default class LogicLoader {
  static get VERSION() {
    return '1.7.0';
  }

  static get LOGIC_FILES_URL_PREFIX() {
    return `https://raw.githubusercontent.com/LagoLunatic/wwrando/${this.VERSION}/logic/`;
  }

  static async loadLogicFile(fileName) {
    const response = await fetch(`${this.LOGIC_FILES_URL_PREFIX}/${fileName}`);
    const fileData = await response.text();
    const parsedFile = yaml.safeLoad(fileData);
    return parsedFile;
  }

  static async loadLogicFiles() {
    const itemLocations = await this.loadLogicFile('item_locations.txt');
    const macros = await this.loadLogicFile('macros.txt');

    return {
      itemLocations,
      macros
    };
  }
}
