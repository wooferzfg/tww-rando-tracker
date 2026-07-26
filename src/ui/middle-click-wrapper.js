export default class MiddleClickWrapper {
  static MIDDLE_CLICK_BUTTON = 1;

  static onMiddleClick(handler) {
    return (event) => {
      if (event.button === this.MIDDLE_CLICK_BUTTON) {
        event.preventDefault();
        event.stopPropagation();

        handler(event);
      }
    };
  }

  // Attached to mouse down, since that is what starts autoscrolling.
  static preventAutoScroll(event) {
    if (event.button === MiddleClickWrapper.MIDDLE_CLICK_BUTTON) {
      event.preventDefault();
    }
  }
}
