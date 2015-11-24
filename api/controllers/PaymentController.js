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
    Customer.create({
      email: checkout.attendee.email,
      firstname: checkout.attendee.firstname,
      lastname: checkout.attendee.lastname,
      phone: checkout.attendee.phone,
      username: checkout.attendee.username
    }).then(function (customer){

      // charge the card
      return [
        customer,
        stripe.charges.create({
          amount: parseFloat(checkout.payment.amount) * 100,
          currency: sails.config.connections.stripe.currency,
          source: checkout.payment.stripeToken,
          description: sails.config.connections.stripe.description,
          metadata: {
            username: customer.username,
            email: customer.email
          }
        })
      ];
    })
    .spread(function (customer, charge){
      // create a payment record
      return [
        customer,
        Payment.create({
          ip: req.connection.remoteAddress,
          transaction: charge,
          currency: charge.currency,
          amount: charge.amount / 100,
          paid: charge.paid,
          customer: customer.id
        })
      ];
    })
    .spread(function (customer, payment){
      var events = [];
      _.each(checkout.cart.items, function (event) {
        events.push(event.id);
      });

      Customer.update({ id: customer.id }, {
        events: events
      })
      .then(function (customer) {
        return res.json({ customer: customer, payment: payment });
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
