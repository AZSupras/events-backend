/* global TokenService, User, sails */

var _ = require('lodash');

/**
 * Token Policy
 * @description middleware to ensure a request
 * is authenticated and the token is valid.
 *
 * @todo standardize the return objects for the errors
 * @todo change res code to res category
 */
module.exports = function (req, res, next) {
  var token;
  var headers;

  /**
   * Detect if the incoming request is a socket.
   * @description this is necessary as sockets do
   * not include headers typically. As such we need
   * to look in the request body for the token.
   */
  if (req.isSocket){
    delete req.body.token;
    token = _.clone(req.body);
  }else {
    headers = req.headers;

    /**
     * Try to determine if the request contains
     * an Authorization header or if the token
     * param is passed.
     */
    if (headers && headers.authorization) {
      var parts = headers.authorization.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0],
          credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {

        return res.json(400, {
          statusCode: 400,
          type: 'ERROR',
          code: 'E_INVALID_HEADER_SYNTAX',
          msg: 'The provided Authorization header is in the incorrect format. The correct format is Authorization: Bearer [token]'
        });

      }
    } else if (req.param('token')) {
      token = req.param('token');
      delete req.query.token;
    } else {
      return res.json(400, {
        statusCode: 400,
        type: 'ERROR',
        code: 'E_NO_TOKEN_PROVIDED',
        msg: 'No Token was provided.'
      });
    }
  }

  /**
   * Now that we have the token, validate it.
   */
  TokenService.verifyToken(token, {}, function (err, decodedToken){
    if (err){
      sails.log.error({
        policy: 'TokenPolicy::verifyToken',
        statusCode: 500,
        type: 'ERROR',
        code: 'E_INVALID_TOKEN',
        msg: 'The provided token was invalid or malformed.',
        err: err
      });

      return res.json(500, {
        statusCode: 500,
        type: 'ERROR',
        code: 'E_INVALID_TOKEN',
        msg: 'The provided token was invalid or malformed.'
      });
    }

    User.findOne({ id: decodedToken.uid })
    .then(function (user){
      req.user = user;
      req.token = token;
      next();
    })
    .catch(function (err){
      next(err);
    });
  });
};
