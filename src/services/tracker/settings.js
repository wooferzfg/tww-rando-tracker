export default class Settings {
  static initialize(options) {
    this._version = options.version;
  }

  static get version() {
    return this._version;
  }
}
