var bcrypt   = require('bcryptjs');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);

/**
 * Private function to hash a password
 * @param password
 * @param cb
 */
function hashPassword(password){
  return bcrypt.genSaltAsync(10)
  .then(function (salt){
    return bcrypt.hashAsync(password, salt);
  })
  .then(function (hash){
    return hash;
  })
  .catch(function (err){
    console.log(err);
  });
}

/**
 * User Model
 * @name UserModel
 * @description provides associations, and user information
 */
var UserModel;
UserModel = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {

    firstName: {
      type: 'string',
      required: true
    },

    lastName: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    email: {
      type: 'email',
      unique: true
    },

    password: {
      type: 'string',
      minLength: 8
    },

    accessToken: {
      type: 'string'
    },

    /**
     * Associations
     *
     */

    /**
     * Overrides
     */


    /**
     *toJSON
     * @description removes sensitive fields from
     * the JSON response before its handed back over
     * to the controlller(s).
     * @returns {object} modified user object
     */
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.accessToken;

      return obj;
    }

  },

  /**
   * Validate password used by the local strategy.
   */
  validatePassword: function (password, encryptedPassword) {
    return bcrypt.compareAsync(password, encryptedPassword)
    .then(function (match){
      return match;
    })
    .catch(function (err){
      sails.log.error(err);
      return err;
    });
  },

  /**
   * Callback to be run before creating a Passport.
   *
   * @param {Object}   passport The soon-to-be-created Passport
   * @param {Function} next
   */
  beforeCreate: function (values, next) {
    hashPassword(values.password)
    .then(function (hash){
      values.password = hash;
      next();
    })
    .catch(function (err){
      next(err);
    });
  }
};

module.exports = UserModel;
