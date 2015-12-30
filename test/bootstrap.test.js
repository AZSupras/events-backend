/* global sails, before, after, fixtures */

var Sails = require('sails');
var Barrels = require('barrels');
require('should');

// Global before hook
before(function (done) {
  // Lift Sails with test database
  Sails.lift({
    autoAdmin: {
      enabled: true,
      user: {
        username: 'admin',
        firstName: 'Super',
        lastName: 'User',
        email: 'admin@admin.com',
        password: 'admin1234',
        accessLevel: 3
      }
    },
    log: {
      level: 'error'
    },
    connections: {
      localdisk: {
        adapter: 'sails-disk'
      },
      googleMaps: {
        key: 'AIzaSyDfkvPmJAAXn759s-qohYB8ADMhPm5Hd5k'
      },
      s3: {
        key: 'AKIAIVYYS7FBUAMC27NQ',
        secret: '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'
      },
      mandrill: {
        apiKey: '123456'
      },
      stripe: {
        keys: {
          secret: 'sk_test_ZYHWa9cCO9dWxps9IDDvosmA'
        }
      },
      jwt: {
        secret: 'ZsknTB%^i^eyZzsUI(&gj(u!'
      }
    },
    models: {
      connection: 'localdisk',
      migrate: 'drop'
    }
  }, function (err, sails) {
    if (err) {
      return done(err);
    }
    // Load fixtures
    var barrels = new Barrels();
    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

    // Populate the DB
    barrels.populate(function (err) {
      done(err, sails);
    });
  });
});

// Global after hook
after(function (done) {
  console.log(); // Skip a line before displaying Sails lowering logs
  sails.lower(done);
});
