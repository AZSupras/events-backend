/* globals fixtures, sails */
var faker = require('faker');
var request = require('supertest');


describe.only('AuthController', function (){

  describe('login', function (){
    it('should return a token and user object given valid credentials', function (done) {
      request(sails.hooks.http.app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        identity: fixtures.user[0].username,
        password: fixtures.user[0].password
      })
      .expect(200)
      .expect(function (res){
        res.body.should.be.an.Object();
        res.body.should.have.properties('token', 'user');
      })
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });

    it('should return a standardized error given invalid credentials', function (done) {
      request(sails.hooks.http.app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        identity: faker.internet.userName(),
        password: '123456'
      })
      .expect(401)
      .expect(function (res){
        res.body.should.be.an.Object();
        res.body.should.have.properties('msg', 'code', 'type', 'statusCode');
        res.body.msg.should.be.eql('The provided credentials were invalid.');
        res.body.statusCode.should.be.eql(401);
        res.body.type.should.be.eql('ERROR');
        res.body.code.should.be.eql('E_INVALID_CREDENTIALS');
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

  describe('logout', function () {
    var token;
    before(function (done) {
      request(sails.hooks.http.app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        identity: fixtures.user[0].username,
        password: fixtures.user[0].password
      })
      .expect(200)
      .expect(function (res){
        res.body.should.be.an.Object();
        res.body.should.have.properties('token', 'user');
        token = res.body.token;
      })
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });
    it('given a valid login token, it should log out the user', function (done) {
      request(sails.hooks.http.app)
      .post('/v1/auth/logout')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(function (res){
        res.body.should.be.an.Object();
        res.body.should.have.properties('message', 'type');
      })
      .end(function (err){
        if (err){
          console.log(err);
          return done(err);
        }
        done();
      });
    });

    it('given an invalid login token, it should throw a standardized error', function (done) {
      request(sails.hooks.http.app)
      .post('/v1/auth/logout')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + '12345')
      .expect(500)
      .expect(function (res){
        res.body.should.be.an.Object();
        res.body.should.have.properties('msg', 'code', 'type', 'statusCode');
        res.body.msg.should.be.eql('The provided token was invalid or malformed.');
        res.body.statusCode.should.be.eql(500);
        res.body.type.should.be.eql('ERROR');
        res.body.code.should.be.eql('E_INVALID_TOKEN');
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
