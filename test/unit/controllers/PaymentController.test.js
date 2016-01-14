/* globals sails, fixtures */
var faker   = require('faker');
var request = require('supertest');
var should  = require('should');
var _       = require('lodash');
var Utils   = require('../../utils');

var cart    = {
  items: []
};

describe('PaymentController', function (){

  before(function (done) {
    _.each(fixtures.event, function (event) {
      cart.items.push({
        id: event.id
      });
    });
    done();
  });

  describe('process', function (){
    it('given valid cc info, it should process the payment', function (done){
      Utils.getStripeToken({
        'card[number]': '4242 4242 4242 4242',
        'card[exp_month]': '01',
        'card[exp_year]': '2020',
        'card[cvc]': '123',
        'card[name]': 'Test User'
      }, function (err, token){
        if (err) {
          console.error(err);
          return done(err);
        }

        var testCustomer = {
          'attendee': {
              'email': faker.internet.email(),
              'firstname': faker.name.firstName(),
              'lastname': faker.name.lastName(),
              'phone': faker.phone.phoneNumber(),
              'username': faker.internet.userName()
          },
          'cart': cart,
          'payment': {
              'amount': 1.57,
              'stripeToken': token
          }
        };

        request(sails.hooks.http.app)
        .post('/v1/payment/process')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(testCustomer)
        .expect(200)
        .expect(function (res){
          var payment = res.body.payment;
          payment.should.have.property('paid', true);
          payment.should.have.property('amount', testCustomer.payment.amount);
        })
        .end(function (err){
          if (err){
            console.error(err);
            return done(err);
          }

          done();
        });
      });

    });
    it('given card_declined cc info, it should throw stripe error', function (done){
      Utils.getStripeToken({
        'card[number]': '4000000000000002',
        'card[exp_month]': '01',
        'card[exp_year]': '2020',
        'card[cvc]': '123',
        'card[name]': 'Test User'
      }, function (err, token){
        if (err) {
          console.error(err);
          return done(err);
        }

        var testCustomer = {
          'attendee': {
              'email': faker.internet.email(),
              'firstname': faker.name.firstName(),
              'lastname': faker.name.lastName(),
              'phone': faker.phone.phoneNumber(),
              'username': faker.internet.userName()
          },
          'payment': {
              'amount': 1.57,
              'stripeToken': token
          }
        };

        request(sails.hooks.http.app)
        .post('/v1/payment/process')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(testCustomer)
        .expect(402)
        .expect(function (res){
          res.body.should.have.property('code', 'card_declined');
          res.body.should.have.property('message', 'Your card was declined.');
        })
        .end(function (err){
          if (err){
            return done(err);
          }
          done();
        });
      });
    });
    it('given incorrect_cvc cc info, it should throw stripe error', function (done){
      Utils.getStripeToken({
        'card[number]': '4000000000000127',
        'card[exp_month]': '01',
        'card[exp_year]': '2020',
        'card[cvc]': '123',
        'card[name]': 'Test User'
      }, function (err, token){
        if (err) {
          console.error(err);
          return done(err);
        }

        var testCustomer = {
          'attendee': {
              'email': faker.internet.email(),
              'firstname': faker.name.firstName(),
              'lastname': faker.name.lastName(),
              'phone': faker.phone.phoneNumber(),
              'username': faker.internet.userName()
          },
          'payment': {
              'amount': 1.57,
              'stripeToken': token
          }
        };

        request(sails.hooks.http.app)
        .post('/v1/payment/process')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(testCustomer)
        .expect(402)
        .expect(function (res){
          res.body.should.have.property('code', 'incorrect_cvc');
          res.body.should.have.property('message', 'Your card\'s security code is incorrect.');
        })
        .end(function (err, res){
          if (err){
            console.log(err);
            return done(err);
          }
          done();
        });
      });
    });
    it('given expired_card cc info, it should throw stripe error', function (done){
      Utils.getStripeToken({
        'card[number]': '4000000000000069',
        'card[exp_month]': '01',
        'card[exp_year]': '2020',
        'card[cvc]': '123',
        'card[name]': 'Test User'
      }, function (err, token){
        if (err) {
          console.error(err);
          return done(err);
        }

        var testCustomer = {
          'attendee': {
              'email': faker.internet.email(),
              'firstname': faker.name.firstName(),
              'lastname': faker.name.lastName(),
              'phone': faker.phone.phoneNumber(),
              'username': faker.internet.userName()
          },
          'payment': {
              'amount': 1.57,
              'stripeToken': token
          }
        };

        request(sails.hooks.http.app)
        .post('/v1/payment/process')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(testCustomer)
        .expect(402)
        .expect(function (res){
          res.body.should.have.property('code', 'expired_card');
          res.body.should.have.property('message', 'Your card has expired.');
        })
        .end(function (err, res){
          if (err){
            console.log(err);
            return done(err);
          }
          done();
        });
      });
    });
    it('given incorrect_number cc info, it should throw stripe error', function (done){
      Utils.getStripeToken({
        'card[number]': '4242424242424241',
        'card[exp_month]': '01',
        'card[exp_year]': '2020',
        'card[cvc]': '123',
        'card[name]': 'Test User'
      }, function (err, token){
        if (err) {
          console.error(err, token);
          return done(err);
        }

        should.not.exist(token);
        done();
      });
    });
  });

  describe('deniedRoutes', function (){
    it('should throw a 403 http code for find', function (done){
      request(sails.hooks.http.app)
      .get('/v1/payment')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(403)
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
    it('should throw a 403 http code for findOne', function (done){
      request(sails.hooks.http.app)
      .get('/v1/payment/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(403)
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
    it('should throw a 403 http code for create', function (done){
      request(sails.hooks.http.app)
      .post('/v1/payment')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(403)
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
    it('should throw a 403 http code for update', function (done){
      request(sails.hooks.http.app)
      .put('/v1/payment/1')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(403)
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
    it('should throw a 403 http code for delete', function (done){
      request(sails.hooks.http.app)
      .delete('/v1/payment/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(403)
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
  });
});
