/* globals sails */
var faker = require('faker');
var request = require('supertest');


describe('CustomerController', function (){
  var token;

  /**
   * get a login token before any testing can be done.
   */
  before(function (done){
    // @todo handle login
    done();
  });

  describe('find', function (){
    it('should return an array of customers');
    it('when filtered by event and who has paid, it should return an array of customers');
  });

  describe('findOne', function (){
    it('should return a single customer object with specific properties');
  });

  describe('deniedRoutes - no token', function (){
    it('should throw a 400 http code for create');
    it('should throw a 400 http code for update');
    it('should throw a 400 http code for delete');
  });
});
