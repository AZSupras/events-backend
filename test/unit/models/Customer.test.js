/* global fixtures, Customer */
var should = require('should');

describe('CustomerModel', function (){

  it('should not be empty', function (done) {
    Customer.find().exec(function (err, customers) {
      should.not.exist(err);
      should.exist(customers);

      customers.length.should.be.above(0);
      done();
    });
  });
});
