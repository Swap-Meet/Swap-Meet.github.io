var User = require('../models/user.js');
var Game = require('../models/game.js');
var Match = require('../models/match.js');

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
      //err check

      thisUserWants = user.wantsGames; //pulls out wantsgames array

      //loops through wants games array
      for (j = 0; j < thisUserWants.length; j++) {
        //add 1 to adj mat since match exists
        //console.log('col', userIds.indexOf(thisUserWants[j].ownerId));
        //console.log('row', i)
        adjMat[i][userIds.indexOf(thisUserWants[j].ownerId)].push(thisUserWants[j]);
      }
    //})
  }

  //find matches between users
  for (i = 0; i < sameZip.length - 1; i++) {
    for (j = i + 1; j < sameZip.length; j++) {
      //console.log(adjMat[i][j][0], adjMat[j][i][0]);
      if (adjMat[i][j][0] && adjMat[j][i][0]) {
        //console.log(adjMat[i][j], adjMat[j][i]);
        match = new Match();
        //console.log(typeof adjMat[i][j]);
        match.user1game = [];
        //console.log(match.user1game);

        for (k = 0; k < adjMat[i][j].length; k++) {
          //console.log(match.user1game[0]);
          //console.log(adjMat[i][j][k]);
          match.user1game.push(adjMat[i][j]);
          match.user2game.push(adjMat[j][i]);
        }

        console.log(match.user1game[0]);
        //var newArray = adjMat[i][j].map(function(arr) {
        //    return arr.slice();
        //});
        //console.log(newArray);
        //match.user2game = 'moo';
        match.user1 = userIds[i];
        match.user2 = userIds[j];
        //match.user1game = adjMat[i][j].slice(0);

        //match.user2game = adjMat[j][i];
        matchArray.push(match);
        //console.log(match);
      }
    }
  }

  return matchArray;
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
var result = findMatches(data);

console.log(result[1].user1game);
//console.log(result[0].user1game);

module.exports = findMatches;