'use strict';

process.env.MONGO_URL = 'mongodb://localhost/game_swap_test';

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

var jwt, url = process.env.url;
var jwtA, jwtB, jwtC;
var loginURLGood = '?email=munchkins' + Date.now() + '&password=Hero99999&zip=99999&screenname=crazyfool';
var loginURLBadPW = '?email=munchkins&password=pie&zip=99999&screenname=crazyfool';
var game = "{'title': 'Monkey Island'" + Date.now() + ", 'platform':XBOX'}";
  it('should be able to create a new user', function(done) {
    chai.request(url)
    .post('api/user' + loginURLGood)
    .end(function(err, res) {
      //console.log(res);
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      expect(res.body.error).to.eql(0);
      jwt = res.body.jwt;
      expect(jwt).to.be.a('string');
      done();
    });
  });

  it('should not be able to do anything without authentication', function(done) {
    chai.request(url)
    .get('api/games/mygames')
    .end(function(err, res) {
      expect(res.statusCode).to.eql(403);
      done();
    });
  });
  it('should be able to get a token for an existing user', function(done) {
    chai.request(url)
    .get('api/user' + loginURLGood)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      expect(res.body.error).to.eql(0);
      jwt = res.body.jwt;
      expect(jwt).to.be.a('string');
      done();
    });
  });
  it('should refuse to create a new user with a short PW', function(done) {
    chai.request(url)
    .post('api/user' + loginURLBadPW)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(400);
      done();
    });
  });
  it('should be able to get some games without authentication', function(done) {
    chai.request(url)
    .get('api/browse')
    .end(function(err, res){
      //console.log(res);
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      done();
    });
  });
  it('should be able to add a game using jwt token', function(done){
    chai.request(url)
    .post('api/games/hasgames')
    .set('jwt',jwt)
    .send(game)
    .end(function(err, res) {
      //console.log(res);
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.item.owner).to.be.a('String');
      //expect(res.body.item.title).to.eql("Monkey Island");
      done();
    });
  });
  it('should be able to view inventory with a jwt token', function(done) {
    chai.request(url)
    .get('api/games/mygames')
    .set('jwt',jwt)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res.body);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array')
      expect(res.body.items[0]._id).to.be.a('String');
      done();
    });
  });

  it('should be able to search games while logged in', function(done) {
    chai.request(url)
    .get('api/wantsgames?p=XBOX')
    .set('jwt',jwt)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res.body);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array')
      expect(res.body.items[0]._id).to.be.a('String');
      done();
    });
  });
  it('should not be able to search games without authorization', function(done) {
    chai.request(url)
    .get('api/wantsgames?p=XBOX')
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res.body);
      expect(res.body.error).to.eql(7);
      done();
    });
  });
  it('should be able to browse games without authorization', function(done) {
    chai.request(url)
    .get('api/browse')
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res.body);
      console.log(res.body.items[0]);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      expect(res.body.items[0].title).to.be.a('String');
      done();
    });
  });
});
