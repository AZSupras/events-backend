/* globals User, TokenService, sails */

var AuthController;
AuthController = {
  login: function (req, res) {
    var identity = req.param('identity');
    var password = req.param('password');

    sails.log.debug(identity, password);

    if (!identity || !password){
      return res.json(401, { type: 'ERROR', category: 'E_INVALID_CREDENTIALS', msg: 'No username or password provided.'});
    }

    var findType = (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(identity)) ? 'findOneByEmail' : 'findOneByUsername';

    User[findType](identity)
    .then(function (user){
      User.validatePassword(password, user.password).then(function (valid){
        if (!valid){
          sails.log.error('Password invalid for user', user.username, password);
          return res.json(401, {type: 'ERROR', statusCode: 401, code: 'E_INVALID_CREDENTIALS', msg: 'The provided credentials were invalid.'});
        }

        var token = TokenService.issueToken(user);
        user.accessToken = token;

        user.save(function (err, user) {
          if (err) {
            sails.log.error(err);
            return res.json(500, err);
          }

          return res.json({ token: token, user: user });
        });
      });

    })
    .catch(function (err){
      sails.log.error(err);
      return res.json(500, err);
    });
  },

  logout: function (req, res) {
    var token = req.token;

    User.update(
      { accessToken: token },
      { accessToken: '' }
    ).then(function (user) {
      res.json({ message: 'USER LOGGED OUT', type: 'E_INFO' });
    })
    .catch( function (err) {
      sails.log.error(err);
      res.json(500, err);
    });
  }
};
module.exports = AuthController;
