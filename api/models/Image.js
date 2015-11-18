var ImageModel;
ImageModel = {
  attributes: {
    imageType: {
      type: 'string'
    },
    size: {
      type: 'integer'
    },
    filename: {
      type: 'string'
    },
    originalFileName: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    bucket: {
      type: 'string'
    },

    events: {
      collection: 'event',
      via: 'images'
    }
  }
};
module.exports = ImageModel;
