import _ from 'lodash';

export default class Storage {
  static async loadFileAndStore() {
    const file = await this._loadFileFromDialog();
    const fileData = await this._readFile(file);

    localStorage.setItem(this._SAVE_FILE_KEY, fileData);
  }

  static loadFromStorage() {
    return localStorage.getItem(this._SAVE_FILE_KEY);
  }

  static saveToStorage(saveData) {
    localStorage.setItem(this._SAVE_FILE_KEY, saveData);
  }

  static _SAVE_FILE_KEY = 'saveData';

  static async _loadFileFromDialog() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');

      input.setAttribute('type', 'file');

      input.onchange = () => {
        const file = _.first(input.files);

        if (_.isNil(file)) {
          reject();
          return;
        }

        resolve(file);
      };

      input.click();
    });
  }

  static async _readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const contents = reader.result;

        if (_.isNil(contents)) {
          reject();
          return;
        }

        resolve(contents);
      };

      reader.readAsText(file);
    });
  }
}
