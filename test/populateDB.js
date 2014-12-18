'use strict';

process.env.MONGO_URL = 'mongodb://localhost/game_swap_test';

var User = require('../models/user.js');
var Game = require('../models/game.js');
var Trade = require('../models/trade.js');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../server');

var url = 'http://localhost:3000/';
url = 'https://cryptic-savannah-2534.herokuapp.com/';
//var expect = chai.expect;

//clear existing users and games
User.collection.remove(function(err) {if (err) throw err;});
Game.collection.remove(function(err) {if (err) throw err;});
Trade.collection.remove(function(err) {if (err) throw err;});
var games = [];
var users = [];
var jwtA;
var jwtB;
var jwtC;

games[0] = {_id: 6, title:'The Curse of Monkey Island', platform:'PC',
image_urls: ['http://ecx.images-amazon.com/images/I/51JHJN1YW3L._SY300_.jpg'],
condition: 'good', short_description: 'insult sword fighting FTW!'};
games[1] = {title:'God of War', platform:'PS3',
image_urls: ['http://www.game-ost.com/static/covers_soundtracks/3130_518938.jpg'],
condition: 'good', short_description: 'Kill stuff good'};
games[2] = {title:'Pokemon Snap', platform:'PS3',
image_urls: ['http://ecx.images-amazon.com/images/I/51JHJN1YW3L._SY300_.jpg'],
condition: 'good', short_description: 'Pikachu 4 U!'};
games[3] = {title:'Grim Fandango', platform:'PC',
image_urls: ['https://c1.staticflickr.com/5/4148/5073031956_1e574de2ac_z.jpg'],
condition: 'excellent', short_description:
  'My scythe--I like to keep it next to where my heart used to be'};
games[4] = {title:'Settlers of Catan', platform:'Board',
image_urls: ['http://images.fanpop.com/images/image_uploads/Differents-' +
  'Boards-settlers-of-catan-521934_1157_768.jpg'],
condition: 'good', short_description:
  'A brick for your sheep?'};
games[5] = {title:'Settlers of Catan: Knights and Cities', platform:'Board',
image_urls: ['http://www.catan.com/files/styles/lightboxy/public/gallery/' +
  'soc-cak-game-situation.jpg?itok=16_k4pBl'],
condition: 'used', short_description:
  'A Settlers of Catan expansion pack.'};
games[6] = {title:'Team Fortress 2', platform:'PC',
image_urls: ['http://gamerepublic.ru/UserFiles/CD_Cover2(62).jpg'],
condition: 'used', short_description:
  'I am getting rid of this so my boyfriend will spend time with me.'};

// users[0] = {email:'test@example.com', password:'SecretPW101',
//   username: 'IHeartGames', zip: '99999'};
// users[1] = {email:'user@example.com', password:'Password123',
//   username: 'PCs4Eva', zip: '99999'};
// users[2] = {email:'test@example.com', password:'SecretPW101',
//   username: 'MonkeysAreCute', zip: '99999'};

users[0] = '?email=test@example.com&password=SecretPW101&screenname=' +
  'IHeartGames&zip=99999';
users[1] = '?email=user@example.com&password=Password123&screenname=' +
  'PCs4Eva&zip=99999';
users[2] = '?email=fluffy@example.com&password=SecretPW101&screenname=' +
  'MonkeysAreCute&zip=99999';
//users[1] = {email:'user@example.com', password:'Password123',
  //username: 'PCs4Eva', zip: '99999'};
//users[2] = {email:'test@example.com', password:'SecretPW101',
  //username: 'MonkeysAreCute', zip: '99999'};

describe('should populate the database', function() {
  it('should make a user and get a jwt', function(done) {
    chai.request(url)
    .post('api/user' + users[0])
    .end(function(err, res) {
      console.log(res.body);
      jwtA = res.body.jwt;
      done();
    });
  });

  it('should make a user and get a jwt', function(done) {
    chai.request(url)
    .post('api/user' + users[1])
    .end(function(err, res) {
      jwtB = res.body.jwt;
      done();
    });
  });

  it('should make a user and get a jwt', function(done) {
    chai.request(url)
    .post('api/user' + users[2])
    .end(function(err, res) {
      jwtC = res.body.jwt;
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtA)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/' +
      'v1418941323/20141218_221818405_iOS_r4ollg.jpg'})
    .end(function(err, res) {
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtB)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/' +
      'v1418941297/20141218_221735199_iOS_otjt3z.jpg'})
    .end(function(err, res) {
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtC)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/' +
      'v1418941330/20141218_221829687_iOS_nzzyim.jpg'})
    .end(function(err, res) {
      done();
    });
  });

  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[0])
    .end(function(err, res) {
      done();
    });
  });

  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[1])
    .end(function(err, res) {
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[2])
    .end(function(err, res) {
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[3])
    .end(function(err, res) {
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[4])
    .end(function(err, res) {
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[5])
    .end(function(err, res) {
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[6])
    .end(function(err, res) {
      done();
    });
  });
});

// _.forEach(games, function(item) {
//   game = new Game(games[item]);
//   game.save(function(err) { return err; });
// });

// _.forEach(users, function(item) {
//   user = new User(users[item]);
//   user.save(function(err) { return err; });
// });

//return {users: users, games: games};
