'use strict';

var Game = require('../models/game');
var User = require('../models/user');
var _ = require('lodash');
var helpers = require('./helpers');

module.exports = function(searchJSON, userID, res) {

  var dataObj = {};
  var actualResult = [];
  var i;
  var j;
  var total;
  var passback;
  var start = 0;

  //find games that match query params
  Game.find(searchJSON, function(err, data) {
    if (err) return helpers.returnError(res, 1, 'caanot find games');
    //console.log(data);
    //console.log(searchJSON);
    //Flag current user's already wanted games so that front-end can display
    User.findById(userID, function(err, user) {
      if (err) return helpers.returnError(res, 66, 'cannot find user');
      //if (user === null) return helpers.returnError(res, 99, 'user is null');
      actualResult = [];

      //create JS object from Mongoose object to add boolean flag to results
      for (i = 0; i < data.length; i++) {

        dataObj = _.pick(data[i],
        ['_id', 'title', 'zip', 'owner', 'owner_screenname',
        'date_added', 'short_description', 'platform', 'owner', 'image_urls']);

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

      //no games exist
      if (!passback) return res.status(200).json({
        error: 0,
        count: 0,
        items_left: 0,
        items:[]
      });
      return res.status(200).json({
        error: 0,
        count: Math.min(10, passback.length),
        items_left: Math.max(0, total - start - 10),
        items:passback
      });
    });
  });
};
