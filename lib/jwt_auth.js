'use strict';

var jwt = require('jwt-simple');
var User = require('../models/user.js');

module.exports = function(secret) {
  return function(req, res, next) {

    //reads the token off the request, we will store the jwt token in the header
    var token = req.headers.jwt || req.body.jwt;

    var decoded;

    try {
      decoded = jwt.decode(token, secret);
    }
    catch (err) { //use catch because jwt-simple doesn't support callbacks
      console.log(err); //this executes if token is incorrect
      return res.status(403).json({error:7});
    }

    // next, see if user exists
    User.findOne({_id: decoded.iss}, function(err, user) {
      if (err) return res.status(403).json({error:1});
      if (!user) return res.status(403).json({error:6});

      req.user = user;

      //calls next middleware function, in this case
      next();

    });
  };
};
