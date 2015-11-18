/* global sails, Image */

var ImageController;
ImageController = {

  upload: function (req, res) {

    req.file('images').upload({
      adapter: require('skipper-s3'),
      key: sails.config.connections.s3prod.key,
      secret: sails.config.connections.s3prod.secret,
      bucket: sails.config.connections.s3prod.bucket
    }, function whenDone(err, files){

      if (err) {
        return res.json(500, err);
      }

      var transformedFiles = files.map(function (file){
        return {
          imageType: file.type,
          size: file.size,
          filename: file.fd,
          originalFileName: file.filename,
          url: file.extra.Location,
          bucket: file.extra.Bucket
        };
      });

      Image.create(transformedFiles)
      .then(function (images){
        return res.json(images);
      })
      .catch(function (err){
        return res.json(500, err);
      });

    });
  }
};
module.exports = ImageController;
