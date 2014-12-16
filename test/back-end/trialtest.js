'use strict';

process.env.MONGO_URL = 'mongodb://localhost/game_swap_test';

var User = require('../../models/user.js');
var Game = require('../../models/game.js');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;
var MongoClient;
var jwtA;
var jwtB;
var gameA1Id;
var gameA2Id;
var gameA3Id;
var gameB1Id;
var gameB2Id;
var gameB3Id;
var Agames;
var AId;
var BId;
var url = 'http://localhost:3000/';
var loginA = '?email=testA@example.com&password=Monkeys911' +
  '&screenname=BunniesFromHell&zip=99999';
var loginB = '?email=testB@example.com&password=Monkeys911' +
  '&screenname=LindaMummy&zip=99999';
var loginC = '?email=testC@example.com&password=Monkeys911' +
  '&screenname=Monkey911&zip=99999'
var loginURLBadPW =
  '?email=munchkins&password=pie&zip=35847&screenname=crazyfool';
//var loginURLNoZip =
 // '?email=munchkins&password=pie&zip=35847&screenname=crazyfool';
var game1A = {title: 'Monkey Island', platform:'XBOX'};
var game2A = {title: 'Grim Fandango', platform:'PC'};
var game3A = {title: 'Settlers of Catan', platform:'Board'};
var game4A = {title: 'Uno', platform:'Card'};
var game1B = {title: 'Heroes of Might and Magic', platform:'PC'};
var game2B = {title: 'Mental Floss', platform:'Board'};
var game3B = {title: 'Chess', platform:'Board'};
var game4B = {title: 'Team Fortress 2', platform:'PC'};

//clear existing users and games
User.collection.remove(function(err) {if (err) throw err;});
Game.collection.remove(function(err) {if (err) throw err;});

describe('basic user and search tests', function() {
  this.timeout(2000);

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

  it('should refuse to create a user with the same email', function(done) {
    chai.request(url)
    .post('api/user' + loginA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.be.gt(0);
      console.log(res.body.msg);
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
      //console.log(res);
      //console.log('body', res.body);
      expect(res.body.error).to.eql(0);
      expect(res.body.items.owner).to.be.a('String');
      done();
    });
  });

  // it('should be able to add a game to A using jwt token', function(done) {
  //   chai.request(url)
  //   .post('api/games/inventory')
  //   .set('jwt', jwtA)
  //   .send(game2A)
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     //console.log(res);
  //     gameA2Id = res.body.items._id;
  //     expect(res.body.error).to.eql(0);
  //     expect(res.body.items.owner).to.be.a('String');
  //     done();
  //   });
  // });

  // it('should be able to add a game to A using jwt token', function(done) {
  //   chai.request(url)
  //   .post('api/games/inventory')
  //   .set('jwt', jwtA)
  //   .send(game3A)
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     //console.log(res);
  //     gameA3Id = res.body.items._id;
  //     expect(res.body.error).to.eql(0);
  //     expect(res.body.items.owner).to.be.a('String');
  //     AId = res.body.items.owner;
  //     done();
  //   });
  // });

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

  // it('should be able to add a game to B using jwt token', function(done) {
  //   chai.request(url)
  //   .post('api/games/inventory')
  //   .set('jwt', jwtB)
  //   .send(game2B)
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     //console.log(res);
  //     gameA3Id = res.body.items._id;
  //     BId = res.body.items.owner;
  //     expect(res.body.error).to.eql(0);
  //     expect(res.body.items.owner).to.be.a('String');
  //     done();
  //   });
  // });

  it('A should have games in user inventory', function(done) {
    chai.request(url)
    .get('api/games/inventory')
    .set('jwt', jwtA)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.error).to.eql(0);
      expect(res.body.items).to.be.an('Array');
      Agames = res.body.items;
      //var gameId = res.body.items.gameId;
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

  // it('anyone should be able to browse games without jwt', function(done) {
  //   chai.request(url)
  //   .get('api/browse')
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.body.items).to.be.an('Array');
  //     expect(res.body.items[0]._id).to.be.a('String');
  //     done();
  //   });
  // });

  // it('A should be able to view inventory with a jwt token', function(done) {
  //   chai.request(url)
  //   .get('api/games/inventory')
  //   .set('jwt', jwtA)
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.body.error).to.eql(0);
  //     //console.log('items', res.body.items);
  //     expect(res.body.items).to.be.an('Array');
  //     expect(res.body.items[0].title).to.be.a('String');
  //     done();
  //   });
  // });

  // it('should be able to search games while logged in', function(done) {
  //   chai.request(url)
  //   .get('api/search')
  //   .set('jwt', jwtB)
  //   .end(function(err, res) {
  //     //console.log(res);
  //     expect(err).to.eql(null);
  //     expect(res.body.error).to.eql(0);
  //     expect(res.body.items).to.be.an('Array');
  //     //console.log('monkeymonkey', res.body);
  //     expect(res.body.items[0].title).to.be.a('String');
  //     done();
  //   });
  // });



  // it('should be able to get some games without authentication', function(done) {
  //   chai.request(url)
  //   .get('api/browse')
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.body.error).to.eql(0);
  //     expect(res.body.items).to.be.an('Array');
  //     expect(res.body.items[0].platform).to.be.a('String');
  //     //console.log('gameId to look for', gameB1Id);
  //     done();
  //   });
  // });
});

describe('trading tests', function() {

  MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

  //connect away
  MongoClient.connect('mongodb://localhost/game_swap_test', function(err, db) {
    if (err) throw err;
    console.log("Connected to Database");

    User.collection.remove(function(err) {if (err) throw err;});
    Game.collection.remove(function(err) {if (err) throw err;});
    //simple json record
    var game1A = {_id:"1A", title:"Monkey Island", platform:"XBOX"};
    var game2A = {_id:"2A", title:"God of War", platform:"PC"};
    var game3A = {_id:"3A", title:"Bunny Wars", platform:"XBOX"};
    var game1B = {_id:"1B", title:"Pokemon Snap", platform:"PS2"};
    var game2B = {_id:"2B", title:"Monkey Island 4", platform:"XBOX"};
    var game3B = {_id:"3B", title:"Sam and Max", platform:"PC"};
    //insert record
    db.collection('games').insert([game1A, game2A, game3A, game1B, game2B, game3B], function(err, records) {
      if (err) throw err;
      console.log("Record added");
    });
  });


   afterEach(function(done) {
     //clear existing users and games

     done();
   });

  describe('favorites tests', function() {
    it('should be able to create a new user A and get back info', function(done) {
      chai.request(url)
      .post('api/user' + loginA)
      .end(function(err, res) {
        //console.log(res);
        expect(err).to.eql(null);
                console.log('body', res.body);
        expect(res.statusCode).to.eql(200);
        expect(res.body).to.have.property('jwt');
        expect(res.body.error).to.eql(0);
        jwtA = res.body.jwt;
        expect(jwtA).to.be.a('string');
        done();
      });
    });

    // it('should be able to create a new user B and get back info', function(done) {
    //   chai.request(url)
    //   .post('api/user' + loginB)
    //   .end(function(err, res) {
    //     expect(err).to.eql(null);
    //     expect(res.statusCode).to.eql(200);
    //     expect(res.body).to.have.property('jwt');
    //     expect(res.body.error).to.eql(0);
    //     jwtB = res.body.jwt;
    //     expect(jwtB).to.be.a('string');
    //     done();
    //   });
    // });

    // it('B should be able to add a game to favorites', function(done) {
    // console.log('id is', gameId);
    // chai.request(url)
    // .post('api/games/favorites')
    // .set('jwt', jwtB)
    // .send({_id: game1B._id})
    // .end(function(err, res) {
    //   console.log(res);
    //   expect(err).to.eql(null);
    //   //console.log('2', res.body);
    //   expect(res.body.error).to.eql(0);
    //   done();
    //   });
    // });

    // it('B should be able to add another game to favorites', function(done) {
    //   //console.log('id is', gameId);
    //   chai.request(url)
    //   .post('api/games/favorites')
    //   .set('jwt', jwtB)
    //   .send({_id: game2B._id})
    //   .end(function(err, res) {
    //     expect(err).to.eql(null);
    //     expect(res.body.error).to.eql(0);
    //     //console.log('gameids', gameA3Id, gameA2Id);
    //     done();
    //   });
    // });

    // it('B should be able to view favorites', function(done) {
    //   chai.request(url)
    //   .get('api/games/favorites')
    //   .set('jwt', jwtB)
    //   .end(function(err, res) {
    //     expect(err).to.eql(null);
    //     expect(res.body.error).to.eql(0);
    //     expect(res.body.items).to.be.an('array');
    //     expect(res.body.items.length).to.eql(2);
    //     done();
    //   });
    // });

    // it('B should be able to delete a favorite', function(done) {
    //   chai.request(url)
    //   .delete('api/games/favorites')
    //   .set('jwt', jwtB)
    //   .send({id: game1B._id})
    //   .end(function(err, res) {
    //     expect(err).to.eql(null);
    //     expect(res.body.error).to.eql(0);
    //     done();
    //   });
    // });

    // it('B now have 2 games in favorites', function(done) {
    //   chai.request(url)
    //   .get('api/games/favorites')
    //   .set('jwt', jwtB)
    //   .end(function(err, res) {
    //     expect(err).to.eql(null);
    //     expect(res.body.error).to.eql(0);
    //     expect(res.body.items.length).to.eql(1);
    //     done();
    //   });
    // });

    // it('should not be able to delete a favorite w/ invalid id', function(done) {
    //   chai.request(url)
    //   .delete('api/games/favorites')
    //   .set('jwt', jwtB)
    //   .send({id: '8675309'})
    //   .end(function(err, res) {
    //     expect(res.body.error).to.eql(7);
    //     done();
    //   });
    // });
  });
});

  // describe('trading tests', function() {
  //   it('A should be able to save an outgoing request', function(done) {
  //   chai.request(url)
  //   .post('api/games/outgoingrequests')
  //   .set('jwt', jwtA)
  //   .send({id: gameB1Id, gameIdArray: [Agames[0].id, Agames[1].id]})
  //   .end(function(err, res) {
  //     expect(err).to.eql(null);
  //     //console.log('a games', Agames)
  //     expect(res.body.error).to.eql(0);
  //     done();
  //   });
  // });

  //   it('A should be not be able to save an outgoing request w/ invalid game',
  //     function(done) {
  //     chai.request(url)
  //     .post('api/games/outgoingrequests')
  //     .set('jwt', jwtA)
  //     .send({id: "459873450298342", gameIdArray: [Agames[0].id, Agames[1].id]})
  //     .end(function(err, res) {
  //       expect(err).to.eql(null);
  //       //console.log('a games', Agames)
  //       expect(res.body.error).to.not.eql(0);
  //       done();
  //     });
  //   });

  //   it('B should be able get see As incoming request', function(done) {
  //     chai.request(url)
  //     .get('api/games/incomingrequests')
  //     .set('jwt', jwtB)
  //     .end(function(err, res) {
  //       //console.log(res);
  //       expect(err).to.eql(null);
  //       expect(res.body.error).to.eql(0);
  //       expect(res.body.items).to.be.an('Array');
  //       expect(res.body.items[0].owner).to.be.a('String');
  //       done();
  //     });
  //   });

  //     // it('B should be able to delete an incoming request', function(done) {
  //   //   chai.request(url)
  //   //   .delete('api/games/incomingrequests')
  //   //   .set('jwt', jwtB)
  //   //   .send({gameId: gameB1Id, ownerId: AId})
  //   //   .end(function(err, res) {
  //   //     expect(err).to.eql(null);
  //   //     console.log('gameId to look for', gameB1Id);
  //   //     expect(res.body.error).to.eql(0);
  //   //     done();
  //   //   });
  //   // });

  //   it('A should be able to delete an outgoing request', function(done) {
  //     chai.request(url)
  //     .delete('api/games/outgoingrequests')
  //     .set('jwt', jwtA)
  //     .send({gameId: gameB1Id, ownerId: BId})
  //     .end(function(err, res) {
  //       expect(err).to.eql(null);
  //       //console.log('gameId to look for', gameB1Id);
  //       expect(res.body.error).to.eql(0);
  //       done();
  //     });
  //   });
//  });
//  });


//});
