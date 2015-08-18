var express = require('express');
var passport= require('passport');
var router = express.Router();
var User = require('../models/User');

var UsersController = require("../controllers/Users");
var PuppiessController = require("../controllers/Puppies");

var authenticateUser = passport.authenticate('local',{failureRedirect: '/login'}

);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Pup Buds' });
});

var isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) res.redirect('/login');
  return next();
};

var loadCurrentUser = function(req, res, next) {
  if (req.session.passport) {
    User
      .findOne({ username: req.session.passport.user })
      .then(
        function(user) {
          /// plug the current User instance to the req
          req.currentUser = user;
          next();
        }, function(err) {
          return next(err);
      });
  } else {
    next();
  }
};

//login form //IF we call our view login
router.get('/login', function (req, res) {
  res.render('auth/login', {user : req.user});
});

//login submit handler
router.post('/login', passport.authenticate(
  'local',
  {
    failureRedirect: '/login'
  }),

  function (req, res, next) {
    req.session.save(function (err) {
      if (err) return next(err);
      //to home / index?
      res.redirect('/');
    });
  }
);

//facebook authorization
router.get('/auth/facebook', passport.authenticate('facebook',
  {
    scope:
    [
      'email',
      'user_birthday',
      'user_location'
    ]
  }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/index',
  failureRedirect: '/login'
}));

//User log outs
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


// chat page
router.get('/chat', function (req, res, next) {
  res.render('users/chat');
});

//isLoggedIn MIDDLEWARE//

//SecretRoute

//Defined routes
router.get('/register', UsersController.userNew);
router.post('/register', UsersController.userCreate);


module.exports = router;
