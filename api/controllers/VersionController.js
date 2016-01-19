var VersionController;
VersionController = {
  version: function (req, res) {
    var pkg = require('../../package.json');
    return res.json(pkg.version);
  }
};
module.exports = VersionController;
