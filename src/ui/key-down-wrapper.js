export default class KeyDownWrapper {
  static SPACE_KEY = ' ';

  static onSpaceKey(handler) {
    return (event) => {
      if (event.key === this.SPACE_KEY) {
        handler(event);
      }
    };
  }
}
