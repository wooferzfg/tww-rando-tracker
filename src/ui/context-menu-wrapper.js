export default class ContextMenuWrapper {
  static RIGHT_CLICK_BUTTON = 2;
  static MIDDLE_CLICK_BUTTON = 1;

  static onRightClick(handler) {
    return (event) => {
      if (event.button === this.RIGHT_CLICK_BUTTON) {
        handler(event);
      } else {
        // Disable context menu event to allow long press to hover on mobile
        event.preventDefault();
      }
    };
  }
  static onMiddleClick(handler) {
    return (event) => {
      if (event.button === this.MIDDLE_CLICK_BUTTON) {
        handler(event);
      }
    };
  }
}
