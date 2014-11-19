var User = require('../models/user.js');
var Game = require('../models/game.js');

//expects an array of users, all in the same zip code
module.export = function(sameZip) {
  var i, j, k;
  var adjMat = [];
  var userIds = [];

  //pulls userIds into userIds array
  for (i = 0; i < sameZip.length; i++) {
    userIds[i] = sameZip[i]._id;
  }

  //build adjacency matrix
  for (i = 0; i < sameZip.length; i++) {
    Game.findOne(userIds[i]._id, function(err, data) {
      thisUserWants = data.wantsgames; //pulls out wantsgames array
      for (j = 0; j < thisUserWants.length; i++) { //loops through wants games array

      }
    })
    //for (j = 0; j < sameZip.length; i++) {
      //Game.findOne(userIds[i]._id, function(err, data) {
      //  thisUserWants = data.wantsgames;
      //  for (k = 0; k < thisUserWants; k++)
      //  {

        //}
      })
    }
  }

  //find matches between users
  for (i = 0; i < sameZip.length; i++) {
    for (j = i + 1; j < sameZip.length; i++) {

    }
  }

  //determine which games match
};