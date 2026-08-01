import _ from 'lodash';

export default class Storage {
  static async loadFileAndStore() {
    const file = await this.#loadFileFromDialog();
    const fileData = await this.#readFile(file);

    localStorage.setItem(this.#SAVE_FILE_KEY, fileData);
  }

  static loadFromStorage() {
    return localStorage.getItem(this.#SAVE_FILE_KEY);
  }

  static saveToStorage(saveData) {
    localStorage.setItem(this.#SAVE_FILE_KEY, saveData);
  }

  static loadPreferences() {
    const preferencesString = localStorage.getItem(this.#PREFERENCES_KEY);
    return JSON.parse(preferencesString);
  }

  static savePreferences(preferences) {
    const preferencesString = JSON.stringify(preferences);
    localStorage.setItem(this.#PREFERENCES_KEY, preferencesString);
  }

  static async exportFile(saveData) {
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = await URL.createObjectURL(blob);

    try {
      const element = document.createElement('a');

      element.setAttribute('href', url);
      element.setAttribute('download', this.#EXPORT_FILE_NAME);
      element.style.display = 'none';

      document.body.appendChild(element);

      try {
        element.click();
      } finally {
        document.body.removeChild(element);
      }
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  static #SAVE_FILE_KEY = 'saveData';

  static #EXPORT_FILE_NAME = 'tww_rando_tracker_progress.json';

  static #PREFERENCES_KEY = 'preferences';

  static async #loadFileFromDialog() {
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

  static async #readFile(file) {
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
