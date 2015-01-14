'use strict';

process.env.MONGO_URL = 'mongodb://localhost/game_swap_test';

var User = require('../../models/user.js');
var Game = require('../../models/game.js');
var Trade = require('../../models/trade.js');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;
var games;
var tradeId;

//clear existing users and games
User.collection.remove(function(err) {if (err) throw err;});
Game.collection.remove(function(err) {if (err) throw err;});
Trade.collection.remove(function(err) {if (err) throw err;});

var jwtA;
var jwtB;
var gameA3Id;
var gameA2Id;
var gameB1Id;
var Agames;
var AId;
var BId;
var url = 'http://localhost:3000/';
var loginA = '?email=testA@example.com&password=Monkeys911' +
  '&screenname=Monkeymonkey&zip=99999';
var loginB = '?email=testB@example.com&password=Monkeys911' +
  '&screenname=BunniesFromHell&zip=99999';
var loginURLBadPW =
  '?email=munchkins&password=pie&zip=35847&screenname=crazyfool';
var loginURLNoZip =
  '?email=munchkins&password=pie&screenname=yoyoyosup';
var game1A = {title: 'Monkey Island', platform:'XBOX'};
var game2A = {title: 'Grim Fandango', platform:'PC'};
var game3A = {title: 'Settlers of Catan', platform:'Board'};
//var game4A = {title: 'Uno', platform:'Card'};
var game1B = {title: 'Heroes of Might and Magic', platform:'PC'};
var game2B = {title: 'Mental Floss', platform:'Board'};
//var game3B = {title: 'Chess', platform:'Board'};
//var game4B = {title: 'Team Fortress 2', platform:'PC'};

describe('basic user tests', function() {

  it('should be able to create a new user A and get back info', function(done) {
    chai.request(url)
    .post('api/user' + loginA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      expect(res.body.error).to.eql(0);
      expect(res.body.profile.zip).to.eql('99999');
      jwtA = res.body.jwt;
      expect(jwtA).to.be.a('string');
      done();
    });
  });

  it('should be able to create a new user B and get back info', function(done) {
    chai.request(url)
    .post('api/user' + loginB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      expect(res.body.error).to.eql(0);
      expect(res.body.profile.zip).to.eql('99999');
      jwtB = res.body.jwt;
      expect(jwtB).to.be.a('string');
      done();
    });
  });

  it('should be refuse to create a new user with no zip', function(done) {
    chai.request(url)
    .post('api/user' + loginURLNoZip)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.not.eql(0);
      done();
    });
  });

  it('should refuse to create a user with the same email', function(done) {
    chai.request(url)
    .post('api/user' + loginA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.be.gt(0);
      //console.log(res.body.msg);
      done();
    });
  });

  it('should not be able to do stuff without authentication', function(done) {
    chai.request(url)
    .get('api/games/inventory')
    .end(function(err, res) {
      expect(res.statusCode).to.eql(403);
      done();
    });
  });

  it('should be able to get a token for an existing user', function(done) {
    chai.request(url)
    .get('api/user' + loginA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property('jwt');
      expect(res.body.error).to.eql(0);
      expect(res.body.jwt).to.be.a('string');
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

  it('should be able to add a game to A using jwt token', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(game1A)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items.owner).to.be.a('String');
      done();
    });
  });

  it('should be able to add a game to A using jwt token', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(game2A)
    .end(function(err, res) {
      expect(err).to.eql(null);
      gameA2Id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      expect(res.body.items.owner).to.be.a('String');
      done();
    });
  });

  it('should be able to add a game to A using jwt token', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(game3A)
    .end(function(err, res) {
      expect(err).to.eql(null);
      gameA3Id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      expect(res.body.items.owner).to.be.a('String');
      AId = res.body.items.owner;
      done();
    });
  });

  it('should be able to add a game to B using jwt token', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(game1B)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res);
      gameB1Id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      expect(res.body.items.owner).to.be.a('String');
      done();
    });
  });

  it('should be able to add another game to B using jwt token', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(game2B)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res);
      gameA3Id = res.body.items._id;
      BId = res.body.items.owner;
      expect(res.body.error).to.eql(0);
      expect(res.body.items.owner).to.be.a('String');
      done();
    });
  });

  it('A should have games in user inventory', function(done) {
    chai.request(url)
    .get('api/games/inventory')
    .set('jwt', jwtA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      Agames = res.body.items;
      expect(res.body.items.length).to.eql(3);
      done();
    });
  });

  it('B should be able to add a game to favorites', function(done) {
    //console.log('id is', gameId);
    chai.request(url)
    .post('api/games/favorites')
    .set('jwt', jwtB)
    .send({_id: gameA2Id})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('B should be able to add another game to favorites', function(done) {
    //console.log('id is', gameId);
    chai.request(url)
    .post('api/games/favorites')
    .set('jwt', jwtB)
    .send({_id: gameA3Id})
    .end(function(err, res) {
      expect(err).to.eql(null);
      console.log(gameA3Id);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('B should be able to view favorites', function(done) {
    chai.request(url)
    .get('api/games/favorites')
    .set('jwt', jwtB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      console.log(res.body.items);
      expect(res.body.items).to.be.an('array');
      expect(res.body.items.length).to.eql(2);
      done();
    });
  });

  it('B should be able to delete a favorite', function(done) {
    chai.request(url)
    .put('api/games/favorites')
    .set('jwt', jwtB)
    .send({_id: gameA3Id})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('B now have a game in favorites', function(done) {
    chai.request(url)
    .get('api/games/favorites')
    .set('jwt', jwtB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items.length).to.eql(1);
      done();
    });
  });

  it('should not be able to delete a favorite w/ invalid id', function(done) {
    chai.request(url)
    .put('api/games/favorites')
    .set('jwt', jwtB)
    .send({_id: '8675309'})
    .end(function(err, res) {
      expect(res.body.error).to.eql(7);
      done();
    });
  });

  it('should not be able to search games without jwt', function(done) {
    chai.request(url)
    .get('api/search?p=XBOX')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(7);
      done();
    });
  });

  it('anyone should be able to browse games without jwt', function(done) {
    chai.request(url)
    .get('api/browse')
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res.body);
      expect(res.body.items).to.be.an('Array');
      expect(res.body.items[0]._id).to.be.a('String');
      expect(res.body.items.length).to.eql(5);
      done();
    });
  });

  it('A should be able to view inventory with a jwt token', function(done) {
    chai.request(url)
    .get('api/games/inventory')
    .set('jwt', jwtA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      expect(res.body.items[0].title).to.be.a('String');
      done();
    });
  });

  it('should be able to search games while logged in', function(done) {
    chai.request(url)
    .get('api/search')
    .set('jwt', jwtB)
    .end(function(err, res) {
      //console.log(res);
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      expect(res.body.items[0].title).to.be.a('String');
      done();
    });
  });

  it('A should be able to send outgoing request', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtA)
    .send({id: gameB1Id, gameIdArray: [Agames[0]._id, Agames[1]._id]})
    .end(function(err, res) {
      expect(err).to.eql(null);
      console.log('the restponse is', res.body);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('A should be able get see his outgoing request', function(done) {
    chai.request(url)
    .get('api/games/outgoingrequests')
    .set('jwt', jwtA)
    .end(function(err, res) {
      //console.log('see outgoing request', res.body);
      //console.log('see potential Trades', res.body.items[0].potentialTrades);
      //console.log('see game info', res.body.items[0].gameInfo);
      tradeId = res.body.items[0]._id;
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      //expect(res.body.items[0].owner).to.be.a('String');
      done();
    });
  });

  it('B should be able get see As incoming request', function(done) {
    chai.request(url)
    .get('api/games/incomingrequests')
    .set('jwt', jwtB)
    .end(function(err, res) {
      //console.log('see incoming request', res.body);
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      //console.log('output', res.body);
      //console.log('potential trades', res.body.items[0].potentialTrades);
      //console.log('game info', res.body.items[0].gameInfo);
      //expect(res.body.items[0].owner).to.be.a('String');
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
      expect(res.body.items[0].platform).to.be.a('String');
      //console.log('browse', res.body);
      done();
    });
  });

  it('A should be able to delete an outgoing request', function(done) {
    chai.request(url)
    .delete('api/games/outgoingrequests')
    .set('jwt', jwtA)
    .send({tradeId: tradeId})
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log('gameId to look for', gameB1Id);
      expect(res.body.error).to.eql(0);
      done();
    });
  });
});

describe('trading routes tests', function() {
  it('should be able to populate the games DB', function(done) {
    games = require('./games')();
    //console.log(games);
    expect(games).to.be.an('Array');
    done();
  });

  it('should be able to add a game to A', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[0])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[0]._id = res.body.items._id;//console.log('gameId to look for', gameB1Id);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to add a game to B', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[1])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[1]._id = res.body.items._id;
      //console.log('gameId to look for', gameB1Id);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to add a game to B', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[2])
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log('response is', res.body);
      games[2]._id = res.body.items._id;
      //console.log('gameId to look for', gameB1Id);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should not be possible for B to propose a bad trade', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .send({id: games[2]._id, gameIdArray: [games[1]._id, games[2]._id]})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.not.eql(0);
      done();
    });
  });

  it('should not be possible for B to propose an empty trade', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .send({id: games[0]._id, gameIdArray: []})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.not.eql(0);
      done();
    });
  });

  it('should not be possible for B propose an invalid trade', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .send({id: 34534, gameIdArray: []})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.not.eql(0);
      done();
    });
  });

  it('should be possible for B to propose an valid trade', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .send({id: games[0]._id, gameIdArray: [games[1]._id, games[2]._id]})
    .end(function(err, res) {
      expect(err).to.eql(null);
      tradeId = res.body.items._id;
      //console.log('the trade is ', res.body.items);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be possible for B to see this outgoing trade', function(done) {
    chai.request(url)
    .get('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log(res.body.items);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      done();
    });
  });

  it('should be possible for A to refuse a trade', function(done) {
    chai.request(url)
    .delete('api/games/incomingrequests')
    .set('jwt', jwtA)
    .send({tradeId: tradeId})
    .end(function(err, res) {
      expect(err).to.eql(null);
      console.log('a', res.body);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should not be possible for B to see a deleted trade', function(done) {
    chai.request(url)
    .get('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      console.log('b', res.body);
      expect(res.body.items.length).to.eql(1);
      done();
    });
  });
});

describe('inventory deletion tests', function() {
  it('should be able to populate the games DB', function(done) {
    var games = require('./games')();
    //console.log(games);
    expect(games).to.be.an('Array');
    done();
  });

  //A has games 1, 2, 3, B has games 4, 5, 6
  it('should be able to add a game to A', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[0])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[0]._id = res.body.items._id;//console.log('gameId to look for', gameB1Id);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to add a game to A', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[1])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[1]._id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to add a game to A', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[2])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[2]._id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to add a game to A', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[5])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[5]._id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to add a game to B', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[3])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[3]._id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should be able to add a game to B', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[4])
    .end(function(err, res) {
      expect(err).to.eql(null);
      games[4]._id = res.body.items._id;
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should increase num games in B inventory', function(done) {
    chai.request(url)
    .get('api/games/inventory')
    .set('jwt', jwtB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.items.length).to.eql(6);
      done();
    });
  });

  it('should allow A to favorite Bs game', function(done) {
    chai.request(url)
    .post('api/games/favorites')
    .set('jwt', jwtA)
    .send({'_id': games[4]._id})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should allow A to propose a trade to B', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtA)
    .send({id: games[4]._id,
      gameIdArray: [games[0]._id,  games[1]._id, games[2]._id]
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should allow B to propose a trade to A', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .send({id: games[0]._id,
      gameIdArray: [games[4]._id, games[3]._id, games[5]._id]
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should allow B to delete a game', function(done) {
    chai.request(url)
    .delete('api/games/inventory')
    .set('jwt', jwtB)
    .send({id: games[4]._id})
    .end(function(err, res) {
      //console.log('id to be deleted is', games[4]._id);
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      done();
    });
  });

  it('should decrease num games in B inventory', function(done) {
    chai.request(url)
    .get('api/games/inventory')
    .set('jwt', jwtB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.items.length).to.eql(5);
      done();
    });
  });

  it('should decrease num games in A favorites', function(done) {
    chai.request(url)
    .get('api/games/favorites')
    .set('jwt', jwtA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log('the items are', res.body);
      expect(res.body.items.length).to.eql(0);
      done();
    });
  });

  it('should decrease the offers in Bs outgoing request', function(done) {
    chai.request(url)
    .get('api/games/outgoingrequests')
    .set('jwt', jwtB)
    .end(function(err, res) {
      expect(err).to.eql(null);
      //console.log('itemsssss', res.body.items);
      expect(res.body.error).to.eql(0);
      expect(res.body.items[0].potentialTrades.length).to.eql(2);
      done();
    });
  });

});
