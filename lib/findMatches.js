var User = require('../models/user.js');
var Game = require('../models/game.js');
var Match = require('../models/match.js');

//expects an array of users, all in the same zip code
module.export = function(sameZip) {
  var i, j, k;
  var adjMat = [];
  var userIds = [];
  var matchArray = [];

  //pulls userIds into userIds object
  for (i = 0; i < sameZip.length; i++) {
    userIds[i] = sameZip[i]._id;
  }

  //build adjacency matrix
  for (i = 0; i < sameZip.length; i++) {
    //find user with first ID
    Game.findOne(userIds[i]._id, function(err, data) {
      thisUserWants = data.wantsgames; //pulls out wantsgames array

      //loops through wants games array
      for (j = 0; j < thisUserWants.length; i++) {
        adjMat[i][userIds.indexOf(thisUserWants[j].owner)] = 1
      }
    })
  }

  //find matches between users
  for (i = 0; i < sameZip.length; i++) {
    for (j = i + 1; j < sameZip.length; i++) {
      if (adjMat[i][j] == 1 && adjMat[j][i])
      {
        var match = new Match();
        match.user1 = userIds[i];
        match.user2 = userIds[j];
        matchArray.push(match);
      }
    }
  }

  return matchArray;
  //determine which games match
};



//cycle through all users

//cycle through all wants games in each user

//look up owner of each wants game

//if zip is