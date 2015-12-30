/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {
  AuthController: {
    'login': true,
    'logout': ['TokenPolicy']
  },

  PaymentController: {
    '*': false,
    'process': true // public route for payment processing
  },

  EventController: {
    'find': true, // public route to find all events
    'findOne': true, // public route to find a single event
    '*': ['TokenPolicy'] // put all other routes behind auth
  },

  ImageController: {
    '*': false // block all routes to ImageController for now
  },

  CustomerController: {
    '*': false // block all routes to CustomerController for now
  }
};
