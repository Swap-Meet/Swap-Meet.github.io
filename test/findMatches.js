var matches = require('../lib/findMatches.js');

// var game1 = new Game;
// game1.gameId = '5';
// game1.ownerId = 0;

var data = [
{_id: 'A',
email: "hello",
zip: "98027",
hasGames:['1', '2', '3', '4'],
wantsGames:[{gameId:'5', ownerId:'B'}, {gameId:'8', ownerId:'C'}, {gameId:'9', ownerId: 'C'}]
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
var result = matches(data);

console.log(result[0].user1game);
//console.log(result[0].user1game);
