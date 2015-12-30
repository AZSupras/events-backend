/* globals User, sails */

var autoAdmin;
autoAdmin = function (sails) {
  var enabled = sails.config.autoAdmin.enabled || false;

  return {
    defaults: {
      autoAdmin: {
        enabled: false
      }
    },
    initialize: function (next) {

      if (!enabled){
        sails.log.verbose('hooks:autoAdmin - skipping initialization of the default admin account. Set sails.config.autoAdmin.enabled to true to enable.');
        return next();
      }

      sails.after('hook:orm:loaded', function () {
        sails.log.verbose('hooks:autoAdmin - Bootsrapping the default admin account');

        User.findOrCreate({
          username: sails.config.autoAdmin.user.username
        }, sails.config.autoAdmin.user)
        .then(function () {

          sails.log.verbose('hooks:autoAdmin - Finished  bootstraping the default admin account');

          sails.log.blank();
          sails.log('--------------------------------------------------------'.grey);
          sails.log(':: Admin Information'.grey);
          sails.log.blank();
          sails.log('Username    : ' + sails.config.autoAdmin.user.username); // 12 - 8 = 4 spaces
          sails.log('Password    : ' + sails.config.autoAdmin.user.password);
          sails.log('AccessLevel : ' + sails.config.autoAdmin.user.accessLevel);
          sails.log('First Name  : ' + sails.config.autoAdmin.user.firstName);
          sails.log('Last Name   : ' + sails.config.autoAdmin.user.lastName);
          sails.log('Email       : ' + sails.config.autoAdmin.user.email);
          next();
        })
        .catch(function (err) {
          sails.log.error('hooks:autoAdmin - Error bootstraping the default admin account');
          return next(err);
        });

      });
    }
  };
};
module.exports = autoAdmin;
