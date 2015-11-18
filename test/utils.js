var request = require('request');
var STRIPE_URL = 'https://api.stripe.com/v1';
var STRIPE_TEST_KEY = 'pk_test_BzODTyoTCgxiZi6q4c7edsBe';

var Utils;
Utils = {
  getStripeToken: function (cardDetails, cb){
    var formBody = [];
    for (var property in cardDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(cardDetails[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    formBody = formBody.join('&');

    request({
      url: STRIPE_URL + '/tokens',
      method: 'POST',
      body: formBody,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + STRIPE_TEST_KEY
      }
    }, function (err, res, body){
      if (err) {
        console.error(err);
        return cb(err);
      }
      var json = JSON.parse(body);
      cb(null, json.id);
    });
  }
};
module.exports = Utils;
