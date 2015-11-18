var PaymentModel;
PaymentModel = {
  schema: true,
  attributes: {
    ip: {
      type: 'ip',
      required: true
    },
    transaction: {
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
    customer: {
      model: 'customer'
    }
  }
};
module.exports = PaymentModel;
