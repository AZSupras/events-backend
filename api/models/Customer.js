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
      type: 'string'
    },
    username: {
      type: 'string'
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
    },

    toJSON: function () {
      var obj = this.toObject();
      return {
        id: obj.id,
        username: obj.username,
        firstname: obj.firstname
      };
    }
  }
};
module.exports = CustomerModel;
