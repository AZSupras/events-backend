var PaymentModel;
PaymentModel = {
  schema: true,
  attributes: {
    ip: {
      type: 'ip',
      required: true
    },
    email: {
      type: 'email',
      required: true
    },
    firstname: {
      type: 'string',
      required: true
    },
    lastname: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    transaction: {
      type: 'json'
    },
    paymentType: {
      type: 'string',
      defaultsTo: 'web'
    },
    cart: {
      type: 'json'
    },
    amount: {
      type: 'float',
      required: true
    },
    currency: {
      type: 'string',
      required: true
    },
    paid: {
      type: 'boolean',
      defaultsTo: false
    },
    emailSent: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * Associations
     */
    event: {
      model: 'event'
    },
    user: {
      model: 'user'
    }
  }
};
module.exports = PaymentModel;
