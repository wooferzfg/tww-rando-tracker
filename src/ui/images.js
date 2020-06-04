import _ from 'lodash';

export default class Images {
  static get IMAGES() {
    return this.images;
  }

  static async importImages() {
    const imageImports = {
      HEADER: import('../images/header.png'),
    };

    this.images = {};

    await Promise.all(
      _.map(
        imageImports,
        (imageImport, imageName) => this._loadImage(imageImport, imageName),
      ),
    );
  }

  static async _loadImage(importPromise, imageName) {
    const imageImport = await importPromise;
    _.set(this.images, imageName, imageImport.default);
  }
}
