var CustomerModel;
CustomerModel = {
  schema: true,
  attributes: {
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
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      required: true
    },

    /**
     * Shopping Cart Items
     * for now this is null as we're only allowing a customer
     * to pay for a single event at a time.
     *
     * @type {string}
     * @todo shopping.cart
     */
    cart: {
      type: 'array'
    },

    /**
     * Email Sent
     * boolean flag for batch sending emails
     *
     * @type {Object}
     */
    emailSent: {
      type: 'boolean',
      defaultsTo: false
    },


    /**
     * Associations
     */
    payments: {
      collection: 'payment',
      via: 'customer'
    },
    events: {
      collection: 'event',
      via: 'attendees'
    }
  }
};
module.exports = CustomerModel;
