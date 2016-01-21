/* globals Payment, sails */
var _ = require('lodash');
var async = require('async');

module.exports.cron = {
  emailJob: {
    schedule: '* */5 * * * *',
    onTick: function () {
      return Payment.find({ emailSent: false, paid: true })
      .then(function (payments) {
        var customers = [];
        _.each(payments, function (payment) {
          customers.push({
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            email: payment.email,
            firstname: payment.firstname,
            lastname: payment.lastname,
            phone: payment.phone,
            username: payment.username,
            cart: (payment.cart) ? payment.cart : null
          });
        });
        return customers;
      })
      .then(function (customers) {
        if (customers.length <= 0) {
          return sails.log.debug('Email Cron Job Finished, no emails to send.');
        } else {
          async.each(customers, function (customer, eachCb) {
            sails.hooks.email.send('paymentReceipt', customer, {
              to: customer.email,
              subject: 'AZSupras Event Payment Receipt'
            }, function (err) {
              if (err) {
                return eachCb(err);
              }
              Payment.update({ id: customer.id }, { emailSent: true })
              .then(function () {
                sails.log.debug('paymentReceipt sent for', customer.email, customer.id);
                eachCb();
              });
            });
          }, function (err) {
            if (err) {
              sails.log.error(err);
            }
            sails.log.debug('Email Cron Job Finished');
          });
        }
      });
    }
  }
};
