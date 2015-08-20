var express = require('express');
var router = express.Router();

//||||||||||||||||||||||||||--
// REQUIRE PASSPORT
//||||||||||||||||||||||||||--
var passport = require('passport');

//||||||||||||||||||||||||||--
// REQUIRE MODEL
//||||||||||||||||||||||||||--
var User = require('../models/User');

//||||||||||||||||||||||||||--
// NEW USER
//||||||||||||||||||||||||||--
function usersNew  (req, res) {
  res.render('auth/register');
};

//||||||||||||||||||||||||||--
// ADD USER TO DATABASE
//||||||||||||||||||||||||||--
function usersCreate (req, res) {
  User.register(new User({
    username: req.body.username,
    name: req.body.name,
    zipCode: req.body.zipCode,
    age: req.body.age,
    bio: req.body.bio,
    url: req.body.url
  }), req.body.password, function(err, user) {
    // if (err) { console.log(err); return res.render('auth/register', {user: user}); }
    if (err) return res.render('auth/register', {user: user});
    passport.authenticate('local')(req, res, function () {
      req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/users/' + req.user.id); //+ id here?
      });
    });
  });
};

var userShow = function(req, res, next){
  var id = req.params.id;

  User.findById({_id:id}, function(error, user){
    if (error) res.json({message: 'Could not find user because ' + error});
    res.render(
      './users/show', {
        user: req.user
      });
  });
};


var userEdit = function(req, res, next){
  var id = req.params.id;

  User.findById({_id:id}, function(error, user){
    if(error) res.json({message: 'Could not find user because ' + error});
    res.render(
      './users/edit', {
        user: req.user
      });
  });
};




module.exports = {

    usersNew:      usersNew,
    usersCreate:   usersCreate,
    userShow:      userShow,
    userEdit:      userEdit

};

// res.render('users/chat', {user: req.user}); {otherUser: req.username}

///So there will be two different forms one is to register as a user
//and the other is to register as an owner
//that will be an option in the forms when a user clicks register
//it will go to one route when a owner clicks register it will
//go to another route
//we are doing tis since u cant authenticate more than one model

