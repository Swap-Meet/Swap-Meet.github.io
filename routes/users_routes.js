'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {

  //existing users come in here, generates jwt token
  //don't have jwt token, but know password and email
  app.get('/api/user', passport.authenticate('basic', {session: false}),
    //this function overrides the default authentication
    function(req, res) {
      //console.log(req);
      res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
    }
  );

  //creating a new user
  app.post('/api/user', function(req, res) {
    //console.log(req.body);
    User.findOne({'basic.email': req.body.email}, function(err, user) {

      if (err) return res.status(500).send('server error');

      if (user) return res.status(500).send('cannot create that user');

      if (req.body.password === req.body.email) {
        return res.status(500).send('email and password cannot be the same');
      }

      //password pattern: any 8-12 character length combo of ASCII
      //with at least one number and one letter
      var passwordPattern = /^(?=.*\d+)(?=.*[a-z A-Z])[ -~]{8,12}$/;
      if (!passwordPattern.test(req.body.password)) {
        return res.status(500).send('invalid password');
      }

      var newUser = new User();
      newUser.basic.email = req.body.email;
      newUser.basic.password = newUser.generateHash(req.body.password);
      //insert code to make sure password and confirmation password match
      newUser.screenName = req.body.screenName;
      newUser.loc = req.body.loc;

      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });

  /*app.delete('/api/users', jwtadminauth, function(req, res) {
    User.findOne({'basic.email': req.body.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (!user) return res.status(500).send('user not found');

      User.remove({'basic.email': req.body.email}, function(err) {
        if (err) return res.status(500).send('server error');
        return res.status(200).send('user deleted');
      });
    });
  });*/
};