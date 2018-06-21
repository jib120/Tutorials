var passport = require("passport");
var mongoose = require("mongoose");
var moment = require("moment");
//const sleep = require("sleep");
var User = mongoose.model("User");
const { validationResult } = require("express-validator/check");
const ValidationError = require("../models/validationerror");

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  //sleep.sleep(3); //sleep for 3 seconds
  // get the validation result which is defined in router
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(422).json({ errors: errors.array() });
  }

  var newuser = new User({
    username: req.body.username,
    email: req.body.email
  });

  User.findOne({ username: newuser.username }, function(err, user) {
    if (user) {
      var error = new ValidationError(
        "body",
        "username",
        newuser.username,
        "User Name is existed!"
      );
      res.status(422).json({ errors: [error] });
    } else {
      User.findOne({ email: newuser.email }, function(err, user) {
        if (user) {
          var error = new ValidationError(
            "body",
            "username",
            newuser.email,
            "Email is existed!"
          );
          res.status(422).json({ errors: [error] });
        } else {
          //set creation time
          newuser.timecreated = moment(new Date(Date.now()));
          // set hash and salt
          newuser.setPassword(req.body.password);

          console.log(newuser);
          newuser.save(function(err) {
            var token;
            token = newuser.generateJwt();
            res.status(200);
            res.json({
              token: token
            });
          });
        }
      });
    }
  });
};

module.exports.login = function(req, res) {
  //sleep.sleep(3); //sleep for 3 seconds
  // get the validation result which is defined in router
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return if validation fails
    return res.status(422).json({ errors: errors.array() });
  }

  const username = req.body.username;
  const password = req.body.password;

  // check with passport
  passport.authenticate("local", function(err, user, info) {
    // If Passport throws/catches an error
    if (err) {
      var error = new ValidationError("body", "password", password, err);
      res.status(422).json({ errors: [error] });
      return;
    }
    // if no user found, meaning validation fails
    if (!user) {
      var error = new ValidationError("body", "username", username, info);
      return res.status(422).json({ errors: [error] });
    }

    // If a user is found
    if (user) {
      var token = user.generateJwt();
      res.status(200);
      res.json({
        token: token
      });
    }
  })(req, res);
};