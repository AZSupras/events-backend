/* global sails */
var mandrill = require('mandrill-api/mandrill');
var Promise  = require('bluebird');
var Mandrill = new mandrill.Mandrill(sails.config.connections.mandrill.apiKey);

var EmailService;
EmailService = {
  send: function (email){
    var deferred = Promise.defer();
    var subject = (email.subject) ? sails.config.connections.mandrill.subject + ' | ' + email.subject : sails.config.connections.mandrill.subject;

    Mandrill.messages.send({
      message: {
        to: [{email: email.toEmail, name: email.toName}],
        from_email: sails.config.connections.mandrill.fromEmail, //eslint-disable-line
        subject: subject,
        text: email.text,
        html: email.html
      },
      async: true
    }, function (result){
      deferred.resolve(result);
    }, function (err){
      deferred.reject(err);
    });

    return deferred.promise;
  }
};
module.exports = EmailService;
