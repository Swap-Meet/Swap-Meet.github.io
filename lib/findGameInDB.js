'use strict';

var Game = require('../models/game');
var User = require('../models/user');
//var geodist = require('geodist');

module.exports = function(searchJSON, userID) {

  var dataObj = {};
  var actualResult = [];
  var i;
  var j;
  var total;
  var passback;
  var start = 0;

  //find games that match query params
  Game.find(searchJSON, function(err, data) {
    if (err) return 1;

    //Flag current user's already wanted games so that front-end can display
    User.findById(userID, function(err, user) {
      if (err) return 6;
      if (user === null) return 6;
      actualResult = [];

      //create JS object from Mongoose object to add boolean flag to results
      for (i = 0; i < data.length; i++) {
        dataObj._id = data[i]._id;
        dataObj.title = data[i].title;
        dataObj.platform = data[i].platform;
        dataObj.image_urls = data[i].image_urls;
        dataObj.already_wanted = false;
        for (j = 0; j < user.outgoingRequests.length; j++) {
          if (data[i]._id === user.outgoingRequests[j].gameId) {
            dataObj.already_wanted = true;
            break;
          }
        }
        actualResult.push(dataObj);
      }
      //Return results in chunks for front-end pagination
      total = data.length;
      passback = actualResult.slice(searchJSON.start,
        Math.min(actualResult.length + 1, start + 10));
      if (!passback) return {
        error: 0,
        count: 0,
        items_left: 0,
        items:[]
      };
      return {
        error: 0,
        count: Math.min(10, passback.length),
        items_left: Math.max(0, total - start - 10),
        items:passback
      };
    });
  });
};
