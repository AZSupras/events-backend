/* global before, after, fixtures, User, sails */
var should = require('should');

describe.skip('UserModel', function () {
  it('should have the bootstrap admin account', function (done) {
    User.findOne({ username: 'admin' }).exec(function (err, user) {
      if (err) {
        sails.log.error(err);
        return done(err);
      }
      console.log(user);
      user.length.should.be.eql(1);
    });
  });

  it('should not be empty', function (done) {
    User.find().exec(function (err, users) {
      if (err) {
        sails.log.error(err);
        return done(err);
      }

      users.length.should.be.eql(fixtures.user.length);
      done();
    });
  });

  it('should require `username` to be unique');
  it('should require `email` to be a valid email address');
});
