export default class Settings {
  static initialize(options) {
    this.version = options.version;
  }

  static getVersion() {
    return this.version;
  }
}
