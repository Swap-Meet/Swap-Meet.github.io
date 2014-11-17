'use strict';
// grunt test runs of different database (notes_test)
process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var User = require('../models/user.js');
var Game = require('../models/game.js');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../server');

var expect = chai.expect;

//clear existing users and games
User.collection.remove(function(err) {if (err) throw err;});
Game.collection.remove(function(err) {if (err) throw err;});

describe('basic notes/users tests', function() {
var jwt;
var loginJSON = {email: 'test@example.com', password: 'foobar123', loc:'98027', screenName: 'foxyLinda911'};
var loginJSONbad = {email: 'test@example.com', password: 'hi', loc:'98027', screenName: 'foxyLinda911'};

  it('should be able to create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/user')
    .send(loginJSON)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      jwt = res.body.jwt;
      expect(jwt).to.be.a('string');
      done();
    });
  });

  it('should not be able to do anything without authentication', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/user')
    .end(function(err, res) {
      //console.log(res);
      expect(res.statusCode).to.eql(401);
      done();
    });
  });
  it('should be able to get a token for an existing user', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/user')
    .auth(loginJSON.email, loginJSON.password)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      jwt = res.body.jwt;
      expect(jwt).to.be.a('string');
      done();
    });
  });
  it('should refuse to create a new user with a short PW', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/user')
    .send(loginJSONbad)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(500);
      done();
    });
  });

});