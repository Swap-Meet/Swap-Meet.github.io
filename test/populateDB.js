'use strict';

//process.env.MONGO_URL = 'mongodb://localhost/game_swap_test';

var User = require('../models/user.js');
var Game = require('../models/game.js');
var Trade = require('../models/trade.js');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../server');

//var url = 'http://localhost:3000/';
var url = 'https://cryptic-savannah-2534.herokuapp.com/';
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
var jwtD;
var jwtE;
var gameIds = [];

games[0] = {title:'The Curse of Monkey Island', platform:'PC',
image_urls: ['http://ecx.images-amazon.com/images/I/51JHJN1YW3L._SY300_.jpg'],
condition: 'good', short_description: 'insult sword fighting FTW!'};
games[1] = {title:'God of War', platform:'PS3',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941698/God_of_War_Ascension_eseajx.jpg'],
condition: 'good', short_description: 'Kill stuff good'};
games[2] = {title:'FIFA 15', platform:'PS3',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941855/FIFA_15_Cover_Art_grdzh9.jpg'],
condition: 'good', short_description: 'Messi is the master'};
games[3] = {title:'Grim Fandango', platform:'PC',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941704/Grim-Fandango1_owy0kx.jpg'],
condition: 'excellent', short_description:
  'My scythe--I like to keep it next to where my heart used to be'};
games[4] = {title:'Settlers of Catan', platform:'Board',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'a_auto_right/v1418941268/20141218_154511506_iOS_ttwolz.jpg'],
condition: 'good', short_description:
  'A brick for your sheep?'};
games[5] = {title:'Settlers of Catan: Knights and Cities', platform:'Board',
image_urls: ['http://images.fanpop.com/images/image_uploads/Differents-' +
  'Boards-settlers-of-catan-521934_1157_768.jpg'],
condition: 'used', short_description:
  'A Settlers of Catan expansion pack.'};
games[6] = {title:'Team Fortress 2', platform:'PC',
image_urls: ['http://gamerepublic.ru/UserFiles/CD_Cover2(62).jpg'],
condition: 'used', short_description:
  'I am getting rid of this so my boyfriend will spend time with me.'};
games[7] = {title:'Call of Duty: Ghosts', platform:'XBOX360',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941839/8125h60acML__SL1200__s029mu.jpg'],
condition: 'used', short_description:
  'Ghost-Ride That Whip!'};
games[8] = {title:'De Blob', platform:'Wii',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1416608782/lwdaetajtauu3fi681kt.jpg'],
condition: 'used', short_description:
  'Paint the town red. Its blobs of fun!!!'};
games[9] = {title:'Dance Dance Revolution', platform:'PS2',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1418941847/Dance_Dance_Revolution_North_American_PlayStation_cover_art_xggrsu.png'],
condition: 'used', short_description:
  'Boots and Pants and Boots and Pants!'};
games[10] = {title:'Star Wars III: Clone Wars', platform:'XBOX360',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1418941719/legoxbox_yuao1y.jpg'],
condition: 'used', short_description:
  'Everything is Awesome... In Space!'};
games[11] = {title:'Pengoloo', platform:'Board',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'a_auto_right/v1418941283/20141218_154643982_iOS_njgi8d.jpg'],
condition: 'used', short_description:
  'A Penguin Eggs-pedition!'};
games[12] = {title:'Spot It Jr.', platform:'Card',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'a_auto_right/v1418941265/20141218_154443221_iOS_ixdrpo.jpg'],
condition: 'used', short_description:
  'Find a match, junior!'};
games[13] = {title:'Rayman: Raving Rabbids', platform:'Wii',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1416603114/gf79xh6yw4m726jw50sa.jpg'],
condition: 'used', short_description:
  'These rabbits are cray-cray!'};
games[14] = {title:'Wii Fit', platform:'Wii',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1416601976/rcopdo45tbyfgkqajzae.jpg'],
condition: 'used', short_description:
  'Get off the couch and get on the wii board.'};
games[15] = {title:'Resident Evil: The Umbrella Chronicles', platform:'Wii',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1416596033/ebu7tfmqkiah3zvelff3.jpg'],
condition: 'used', short_description:
  'Evil resides underneath an umbrella'};

games[16] = {title:'Super Mario Galaxy 2', platform:'Wii',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1419292522/Super-Mario-Galaxy-2_WII_US_ESRB_z5mepy.jpg'],
condition: 'used', short_description:
  'Shoot into space with Mario and the gang.'};
games[17] = {title:'Assassin\'s Creed: Heritage Collection', platform:'PC',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1419292503/cc1d0bf2aa86d056889bfbb9481ddc5d96c55310_r8phqs.jpg'],
condition: 'used', short_description:
  'I feel the need... the need for creed.'};
games[18] = {title:'World of Warcraft', platform:'PC',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1419292488/20111227110019_WoW_Box_Art1_khl4ea.jpg'],
condition: 'used', short_description:
  'Oh, baby, baby it\'s a wild world of warcraft.'};
games[19] = {title:'Far Cry', platform:'PC',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1419292475/1_Far_Cry_pc_qnjkc7.jpg'],
condition: 'used', short_description:
  'It\'s a far cry from something, but I don\'t know what.' };
games[20] = {title:'Watch Dogs', platform:'PS4',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292275/watch-dogs-ps4_mc7o5a.jpg'],
condition: 'used', short_description:
  'Who let the dogs out? Who.. Who.. Who..'};
games[21] = {title:'The Legend of Zelda: Twilight Princess', platform:'Wii',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292269/TwilightPrincessRatingTFinalBox_fpikey.jpg'],
condition: 'used', short_description:
  'It is legendary.'};
games[22] = {title:'KC Munchkin', platform:'Odyssey2',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292260/odyssey_2_kc_munchkin_box_mopfgm.jpg'],
condition: 'used', short_description:
  'The original Pacman imitator!'};
games[23] = {title:'Metroid', platform:'NES',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292252/Metroid_hud84t.jpg'],
condition: 'used', short_description:
  'Metroid kills space stuff'};
games[24] = {title:'Second Son: Limited Edition', platform:'PS4',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292240/infamous-second-son-01_bsi9vq.jpg'],
condition: 'used', short_description:
  'What happened to my first son?'};
games[25] = {title:'Gauntlet', platform:'NES',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292232/Gauntlet-NES-1989_fbx2ht.jpg'],
condition: 'used', short_description:
  'Run the Gauntlet!'};
games[26] = {title:'Grand Theft Auto: San Andreas', platform:'PS2',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292224/FOB_ps2_jekp0r.jpg'],
condition: 'used', short_description:
  'Steal cars in California.'};
games[27] = {title:'Excitebike', platform:'NES',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292216/Excitebike_cover_uihgbx.jpg'],
condition: 'used', short_description:
  'The original dirt bike game.'};
games[28] = {title:'Madden NFL 13', platform:'XBOX360',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1419292207/en-INTL_L_Xbox360_Madden_NFL_13_FKF-00364_ajs1ok.jpg'],
condition: 'used', short_description:
  'Football!'};
games[29] = {title:'Computer Golf', platform:'Odyssey2',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/' +
'v1419292197/Computer_Golf_-_Magnavox_Odyssey_200001_yshxyw.jpg'],
condition: 'used', short_description:
  'Get your putter ready for some intense 8-bit golf action'};
games[30] = {title:'Forza 5 Motorsport', platform:'XBOXONE',
image_urls: ['http://res.cloudinary.com/swapmeet/image/upload/v1419292189/B00CMQTTQG_box_eqifxm.jpg'],
condition: 'used', short_description:
  'Vrooom Vrooom'};

// users[0] = {email:'test@example.com', password:'SecretPW101',
//   username: 'IHeartGames', zip: '99999'};
// users[1] = {email:'user@example.com', password:'Password123',
//   username: 'PCs4Eva', zip: '99999'};
// users[2] = {email:'test@example.com', password:'SecretPW101',
//   username: 'MonkeysAreCute', zip: '99999'};

users[0] = '?email=bunnies@example.com&password=Password123&screenname=' +
  'IHeartGames&zip=99999';
users[1] = '?email=user@example.com&password=Password123&screenname=' +
  'PCs4Eva&zip=99999';
users[2] = '?email=fluffy@example.com&password=Password123&screenname=' +
  'MonkeysAreCute&zip=99999';
users[3] = '?email=rainbows@example.com&password=Password123&screenname=' +
  'Booyah&zip=99999';
users[4] = '?email=unicorns@example.com&password=Password123&screenname=' +
  'SeahawksRule&zip=99999';
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
      console.log(res.body);
      jwtB = res.body.jwt;
      done();
    });
  });

  it('should make a user and get a jwt', function(done) {
    chai.request(url)
    .post('api/user' + users[2])
    .end(function(err, res) {
      console.log(res.body);
      jwtC = res.body.jwt;
      done();
    });
  });

  it('should make a user and get a jwt', function(done) {
    chai.request(url)
    .post('api/user' + users[3])
    .end(function(err, res) {
      console.log(res.body);
      jwtD = res.body.jwt;
      done();
    });
  });

  it('should make a user and get a jwt', function(done) {
    chai.request(url)
    .post('api/user' + users[4])
    .end(function(err, res) {
      console.log(res.body);
      jwtE = res.body.jwt;
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtA)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/a_auto_right/' +
      'v1418941323/20141218_221818405_iOS_r4ollg.jpg'})
    .end(function(err, res) {
      console.log(res.body);
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtB)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/a_auto_right/' +
      'v1418941297/20141218_221735199_iOS_otjt3z.jpg'})
    .end(function(err, res) {
      console.log(res.body);
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtC)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/a_auto_right/' +
      'v1418941330/20141218_221829687_iOS_nzzyim.jpg'})
    .end(function(err, res) {
      console.log(res.body);
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtD)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/' +
      'a_auto_right/v1418941317/20141218_221750433_iOS_agylvg.jpg'})
    .end(function(err, res) {
      console.log(res.body);
      done();
    });
  });

  it('should add a profile pic', function(done) {
    chai.request(url)
    .put('api/user/myprofile')
    .set('jwt', jwtE)
    .send({'avatar_url': 'http://res.cloudinary.com/swapmeet/image/upload/' +
      'a_auto_right/v1418941202/20140123_204033588_iOS_oqnes8.jpg'})
    .end(function(err, res) {
      console.log(res.body);
      done();
    });
  });

  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[0])
    .end(function(err, res) {
      gameIds[0] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });

  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[1])
    .end(function(err, res) {
      gameIds[1] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtA)
    .send(games[2])
    .end(function(err, res) {
      gameIds[2] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[3])
    .end(function(err, res) {
      gameIds[3] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[4])
    .end(function(err, res) {
      gameIds[4] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtB)
    .send(games[5])
    .end(function(err, res) {
      gameIds[5] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[6])
    .end(function(err, res) {
      gameIds[6] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[7])
    .end(function(err, res) {
      gameIds[7] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[8])
    .end(function(err, res) {
      gameIds[8] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[9])
    .end(function(err, res) {
      gameIds[9] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[10])
    .end(function(err, res) {
      gameIds[10] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[11])
    .end(function(err, res) {
      gameIds[11] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[12])
    .end(function(err, res) {
      gameIds[12] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[13])
    .end(function(err, res) {
      gameIds[13] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[14])
    .end(function(err, res) {
      gameIds[14] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtC)
    .send(games[15])
    .end(function(err, res) {
      gameIds[15] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  //////
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[16])
    .end(function(err, res) {
      gameIds[16] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[17])
    .end(function(err, res) {
      gameIds[17] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[18])
    .end(function(err, res) {
      gameIds[18] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[19])
    .end(function(err, res) {
      gameIds[19] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[20])
    .end(function(err, res) {
      gameIds[20] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[21])
    .end(function(err, res) {
      gameIds[21] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[22])
    .end(function(err, res) {
      gameIds[22] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtD)
    .send(games[23])
    .end(function(err, res) {
      gameIds[23] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtE)
    .send(games[24])
    .end(function(err, res) {
      gameIds[24] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtE)
    .send(games[25])
    .end(function(err, res) {
      gameIds[25] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtE)
    .send(games[26])
    .end(function(err, res) {
      gameIds[26] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtE)
    .send(games[27])
    .end(function(err, res) {
      gameIds[27] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtE)
    .send(games[28])
    .end(function(err, res) {
      gameIds[28] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtE)
    .send(games[29])
    .end(function(err, res) {
      gameIds[29] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });
  it('should add game', function(done) {
    chai.request(url)
    .post('api/games/inventory')
    .set('jwt', jwtE)
    .send(games[30])
    .end(function(err, res) {
      gameIds[30] = res.body.items._id;
      console.log(res.body);
      done();
    });
  });

  //////
  it('should add a favorite', function(done) {
    chai.request(url)
    .post('api/games/favorites')
    .set('jwt', jwtA)
    .send({_id: gameIds[6]})
    .end(function(err, res) {
      //gameIds[6] = res.body._id;
      console.log(res.body);
      done();
    });
  });
  it('should add a favorite', function(done) {
    chai.request(url)
    .post('api/game/favorites')
    .set('jwt', jwtA)
    .send({_id: gameIds[4]})
    .end(function(err, res) {
      //gameIds[6] = res.body._id;
      console.log(res.body);
      done();
    });
  });
  it('should add an outgoing request', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtA)
    .send({id: gameIds[4], gameIdArray:[gameIds[0], gameIds[1]]})
    .end(function(err, res) {
      //gameIds[6] = res.body._id;
      console.log(res.body);
      done();
    });
  });

  it('should add an outgoing request', function(done) {
    chai.request(url)
    .post('api/games/outgoingrequests')
    .set('jwt', jwtC)
    .send({id: gameIds[0], gameIdArray:[gameIds[5], gameIds[6]]})
    .end(function(err, res) {
      //gameIds[6] = res.body._id;
      console.log(res.body);
      console.log('the ids are', gameIds);
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
