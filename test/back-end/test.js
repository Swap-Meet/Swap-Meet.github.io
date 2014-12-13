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
//User.collection.remove(function(err) {if (err) throw err;});
//Game.collection.remove(function(err) {if (err) throw err;});

describe('basic notes/users tests', function() {

  var jwt;
  var gameId = 0;
  var url = process.env.url;
  var jwtA;
  var jwtB;
  var jwtC;
  var loginURLGood = '?email=munchkins' + Date.now() +
    '&password=Hero99999&zip=99999&screenname=crazyfool';
  var loginURLBadPW = '?email=munchkins&password=pie&zip=35847&screenname=crazyfool';
  var game = "{'title': 'Monkey Island'" + ", 'platform':XBOX'}";

  it('should be able to create a new user and get back info', function(done) {
    console.log(url);
    chai.request(url)
    .post('api/user' + loginURLGood)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      expect(res.body.error).to.eql(0);
      expect(res.body.profile.zip).to.eql('99999');
      jwt = res.body.jwt;
      expect(jwt).to.be.a('string');
      done();
    });
  });

  it('should refuse to create a user with the same email', function(done) {
    chai.request(url)
    .post('api/user' + loginURLGood)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.be.gt(0);
      done();
    });
  });

  it('should not be able to do anything without authentication', function(done) {
    chai.request(url)
    .get('api/games/inventory')
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
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      done();
    });
  });

  it('should be able to add a game using jwt token', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwt)
    .send(game)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res);
      var gameId = res.body.id;
      expect(res.body.error).to.eql(0);
      expect(res.body.item.owner).to.be.a('String');
      done();
    });
  });

  it('should be able to add a game to favorites', function(done) {
    console.log('id is', gameId);
    chai.request(url)
    .post('api/games/favorites')
    .set('jwt', jwt)
    .send({'_id': '548a177f6a9a649512b3d674'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to view favorites', function(done) {
    chai.request(url)
    .get('api/games/favorites')
    .set('jwt', jwt)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      //expect(res.body.items).to.be.an('array');
      done();
    });
  });

  it('should be able to delete a favorite', function(done) {
    chai.request(url)
    .get('api/games/favorites')
    .set('jwt', jwt)
    .send({'id': gameId})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should not be able to delete a favorite for an invalid game id', function(done) {
    chai.request(url)
    .get('api/games/favorites')
    .set('jwt', jwt)
    .send({'id': 8675309})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should not be able to search games without authorization', function(done) {
    chai.request(url)
    .get('api/search?p=XBOX')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(7);
      done();
    });
  });

  it('should be able to browse games without authorization', function(done) {
    chai.request(url)
    .get('api/browse')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.items).to.be.an('Array');
      expect(res.body.items[0]._id).to.be.a('String');
      done();
    });
  });

  it('should be able to view inventory with a jwt token', function(done) {
    chai.request(url)
    .get('api/games/inventory')
    .set('jwt', jwt)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      //expect(res.body.items[0]._id).to.be.a('String');
      done();
    });
  });

  it('should be able to search games while logged in', function(done) {
    chai.request(url)
    .get('api/search')
    .set('jwt', jwt)
    .end(function(err, res) {
      //console.log(res);
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      done();
    });
  });

  // it('should be able to save an outgoing request', function(done) {
  //   chai.request(url)
  //   .post('api/games/outgoingrequests')
  //   .set('jwt', jwt)
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.body.error).to.eql(0);
  //     done();
  //   });
  // });

  it('should be able get a user\'s incoming requests', function(done) {
    chai.request(url)
    .get('api/games/incomingrequests')
    .set('jwt', jwt)
    .end(function(err, res) {
      //console.log(res);
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      done();
    });
  });

/*
  it('should be able to add a game', function(done) {
    chai.request(url)
    .post('api/games/hasgames')
    .set('jwt', jwt)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should have a game in user inventory', function(done) {
    chai.request(url)
    .get('api/games/mygames')
    .set('jwt', jwt)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      var gameId = res.body.items.gameId;
      done();
    });
  }); */

});
