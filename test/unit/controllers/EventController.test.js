/* globals sails */
var faker = require('faker');
var request = require('supertest');

describe.only('EventController', function (){

  describe('find', function (){
    it('should return an array of events', function (done){
      request(sails.hooks.http.app)
      .get('/v1/event')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function (res){
        res.body.should.be.an.Array();
      })
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
  });

  describe('findOne', function (){
    var singleEvent;
    before(function (done){
      request(sails.hooks.http.app)
      .get('/v1/event/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function (res){
        singleEvent = res.body;
      })
      .end(function (err, res){
        done();
      });
    });

    it('should return an event object', function (done){
      singleEvent.should.be.an.Object();
      done();
    });

    it('should contain specific properties', function (done){
      singleEvent.should.have.properties(['id', 'name', 'description', 'startDate', 'endDate', 'markdownContent', 'location', 'pricing', 'content', 'staticMap', 'createdAt', 'updatedAt']);
      singleEvent.location.should.have.properties(['address', 'city', 'state', 'zipCode', 'country']);
      singleEvent.pricing.length.should.eql(2);
      done();
    });
  });

  describe('deniedRoutes', function (){
    it('should throw a 400 http code for create', function (done){
      request(sails.hooks.http.app)
      .post('/v1/event')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .expect(function (res){
        res.body.should.have.property('code', 'E_NO_TOKEN_PROVIDED');
      })
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
    it('should throw a 400 http code for update', function (done){
      request(sails.hooks.http.app)
      .put('/v1/event/1')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .expect(function (res){
        res.body.should.have.property('code', 'E_NO_TOKEN_PROVIDED');
      })
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
    it('should throw a 400 http code for delete', function (done){
      request(sails.hooks.http.app)
      .delete('/v1/event/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .expect(function (res){
        res.body.should.have.property('code', 'E_NO_TOKEN_PROVIDED');
      })
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
