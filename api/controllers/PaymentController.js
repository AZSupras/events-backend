/* global sails, Payment, Customer */
var stripe = require('stripe')(sails.config.connections.stripe.keys.secret);
var _      = require('lodash');

/**
 * Payment Controller
 *
 * @description :: Server-side logic for managing payments
 */
var PaymentController;
PaymentController = {

  /**
   * Process a Payment.
   * find or create a customer with given info,
   * then attempt to charge the customers cc using the
   * stripe library. Log the charge info to PaymentModel
   *
   * @param {Object} attendee.email
   * @param {Object} attendee.firstname
   * @param {Object} attendee.lastname
   * @param {Object} attendee.phone
   * @param {Object} attendee.username
   * @param {Object} payment.amount
   * @param {Object} payment.stripeToken
   */
  process: function (req, res){
    var checkout = req.body;

    // create an attendee
    Payment.create({
      ip: req.connection.remoteAddress,
      amount: parseFloat(checkout.payment.amount) * 100,
      currency: sails.config.connections.stripe.currency,
      email: checkout.attendee.email,
      firstname: checkout.attendee.firstname,
      lastname: checkout.attendee.lastname,
      phone: checkout.attendee.phone,
      username: checkout.attendee.username
    }).then(function (payment){

      // charge the card
      return [
        payment,
        stripe.charges.create({
          amount: parseFloat(checkout.payment.amount) * 100,
          currency: sails.config.connections.stripe.currency,
          source: checkout.payment.stripeToken,
          description: sails.config.connections.stripe.description,
          metadata: {
            username: payment.username,
            email: payment.email
          }
        })
      ];
    })
    .spread(function (payment, charge){
      var eventId = checkout.cart.items[0].id;
      Payment.update({ id: payment.id }, {
        transaction: charge,
        currency: charge.currency,
        amount: charge.amount / 100,
        paid: charge.paid,
        event: eventId
        // @todo add in user level associations
      })
      .then(function (payment) {
        return res.json({ payment: payment[0] });
      })
      .catch(function (err) {
        sails.log.error(err);
        return res.json(500, err);
      });
    })
    .catch(function (err){
      if (err.type === 'StripeCardError') {
        return res.json(err.statusCode, { code: err.code, message: err.message });
      } else {
        sails.log.error(err);
        return res.json(500, err);
      }
    });
  }
};

module.exports = PaymentController;
