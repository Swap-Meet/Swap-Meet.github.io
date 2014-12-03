/*var User = require('../models/user.js');
var Game = require('../models/game.js');
var Match = require('../models/match.js');
var _ = require('lodash');

//expects an array of users, all in the same zip code
function findMatches(sameZip) {
  var i, j, k, match;
  var adjMat = [];
  var userIds = [];
  var matchArray = [];
  var temp1D = [];

  //console.log(sameZip.length);
  for (i = 0; i < sameZip.length; i++) {
    for (j = 0; j < sameZip.length; j++) {
      temp1D.push([]);
    }
    adjMat.push(temp1D);
    temp1D = [];
  }

  //pulls userIds into userIds object
  for (i = 0; i < sameZip.length; i++) {
    userIds[i] = sameZip[i]._id;
  }

  //console.log(userIds)

  //build adjacency matrix, i is user in question
  for (i = 0; i < sameZip.length; i++) {
    //find user with first ID
    //User.findOne({'_id':userIds[i]}, function(err, user) {
      user = sameZip[i];
      // put err check here

      thisUserWants = user.wantsGames; //pulls out wantsgames array

      //loops through wants games array
      for (j = 0; j < thisUserWants.length; j++) {
        //add 1 to adj mat since match exists
        adjMat[i][userIds.indexOf(thisUserWants[j].ownerId)].push(thisUserWants[j]);
      }
    //})
  }

  //find matches between users
  for (i = 0; i < sameZip.length - 1; i++) {
    for (j = i + 1; j < sameZip.length; j++) {

      //if entry is symmetric in matrix
      if (adjMat[i][j][0] && adjMat[j][i][0]) {

        match = {};//new Match();
        //initialize games as empty arrays
        match.user1game = [];
        match.user2game = [];

        //cycles through each users has games, adding to match arrays
        for (k = 0; k < adjMat[i][j].length; k++) {
          match.user1game.push(adjMat[i][j][k]);
          match.user2game.push(adjMat[j][i][k]);
        }

        match.user1 = userIds[i];
        match.user2 = userIds[j];

        matchArray.push(match);
      }
    }
  }

  //console.log(matchArray[0].user1game);
  return _.cloneDeep(matchArray);
}

var data = [
{_id: 'A',
email: "hello",
zip: "98027",
hasGames:['1', '2', '3', '4'],
wantsGames:[{gameId:'5', ownerId:'B'}, {gameId:'8', ownerId:'C'}]
},

{_id: 'B',
email: "hello",
zip: "98027",
hasGames:['5', '6'],
wantsGames:[]
},

{_id: 'C',
email: "hello",
zip: "98027",
hasGames:['7', '8', '9'],
wantsGames:[{gameId:'2', ownerId:'A'}, {gameId:'10', ownerId:'D'}]
},

{_id: 'D',
email: "hello",
zip: "98027",
hasGames:['10', '11', '12'],
wantsGames:[{gameId:'13', ownerId:'E'}]
},

{_id: 'E',
email: "hello",
zip: "98027",
hasGames:['13'],
wantsGames:[{gameId:'11', ownerId:'D'}]
}];

//matches(data);
//var result = findMatches(data);

//console.log(result);
//console.log(result[0].user1game);
//console.log(result[0].user1game);

//module.exports = findMatches;
*/
