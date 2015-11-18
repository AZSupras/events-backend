/* global sails */
/**
 * TokenService
 *
 * Simple service to issue and validate JWT tokens
 * @author Mike DeVita <mike@relative.media>
 */
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var TokenService;
TokenService = {

  /**
   * issueToken
   * issues a token with a given payload, reads from
   * sails.config.jwt for options.
   * @param {Object} payload          - user object
   * @param {Object} payload.username - username
   * @param {Object} payload.uid      - user id
   * @param {Object} options          - options (if any) to override or pass in
   * @returns {String} the issued JSON Web Token
   */
  issueToken: function issueToken(payload, options){
    return jwt.sign(
      payload,
      sails.config.jwt.secret,
      _.merge({}, sails.config.jwt.options, options )
    );
  },

  /**
   * verifyToken
   * verifies a given token against the secret key,
   * and if provided against the issuer and audience.
   * @callback cb
   * @param {String} token    - the JWT token to be validated
   * @param {Object} options  - options (if any) to override or pass in
   * @param {cb} cb           - the callback function
   * @returns {Object} the decoded JWT token, or an error
   */
  verifyToken: function verifyToken(token, options, cb){
    return jwt.verify(
      token,
      sails.config.jwt.secret,
      _.merge({}, sails.config.jwt.verificationOptions, options),
      cb
    );
  }
};
module.exports = TokenService;
