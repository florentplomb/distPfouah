'use strict';

var User = require('./user.model');
var Score = require('../score/score.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
var bcrypt = require('bcryptjs');
//var bcrypt = require('bcrypt');

var validationError = function(res, err) {
  return res.json(422, err);
};

function getRandomInt() {
  return Math.random() * (9999999999 - 99999) + 9999;
}

/**
 * Get list of users
 * restriction: 'admin'
 */


exports.index = function(req, res) {

  User.find()
    .populate({
      path: 'imgId',
      select: '-data -likeBy',
    })
    .select('-salt -hashedPassword -scores')
    .exec(function(err, users) {
      if (err) return res.send(500, err);
      if (users.length === 0) return res.status(400).json({
        message: 'users empty'
      }).end();
      return res.json(200, users);


    })

};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  if (!req.body.pseudo) return res.status(400).json({
    message: 'need pseudo'
  }).end();
  if (!req.body.hashedPassword) return res.status(400).json({
    message: 'need password'
  }).end();
  if (!req.body.imgId) return res.status(400).json({
    message: 'need imgId'
  }).end();

  var newUser = new User();

  newUser.pseudo = req.body.pseudo;
  newUser.imgId = req.body.imgId;
  newUser.salt = getRandomInt();
  newUser.hashedPassword = bcrypt.hashSync(req.body.hashedPassword, 8);
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    res.json({
      user: user.profile
    });
  });
};

exports.score = function(req, res, next) {
  var usersScore = [];
  User.find()
    .select('-salt -hashedPassword ')
    .populate('scores')
    .exec(function(err, users) {
      if (users.length === 0) {

        res.status(422).json({
          message: 'pas de users dans la bd'
        }).end();

      } else {



        for (var i = 0; i < users.length; i++) {
          var scores = users[i].scores
          var scoreTot = 0;
          var hsTrash = 0;
          var hsFlash = 0;
          var hsWash = 0;
          var totalHs = 0;
          var tab = {};
          var user = {};
          for (var y = 0; y < scores.length; y++) {



            if (scores[y].gameName === "trash") {

              var ptsTrash = scores[y].pts * 1.4

              scoreTot = ptsTrash + scoreTot;

              if (scores[y].pts > hsTrash) {
                hsTrash = scores[y].pts;
              }

            }
            if (scores[y].gameName === "flash") {

              var ptsFlash = scores[y].pts

              scoreTot = ptsFlash + scoreTot;

              if (scores[y].pts > hsFlash) {
                hsFlash = scores[y].pts;
              }

            }
            if (scores[y].gameName === "wash") {
              var ptsWash = scores[y].pts * 3.75

              scoreTot = ptsWash + scoreTot;

              if (scores[y].pts > hsWash) {
                hsWash = scores[y].pts;
              }

            }

          }
          totalHs = hsWash + hsTrash + hsFlash;
          tab = {
            "scoreTot": Math.round(scoreTot),
            "hsWash": hsWash,
            "hsFlash": hsFlash,
            "hsTrash": hsTrash,
            "totalHs": totalHs
          };
          user.id = users[i].id;
          user.pseudo = users[i].pseudo;
          user.imgUrl = users[i].imgUrl;
          user.like = users[i].like;
          user.scores = tab;

          usersScore.push(user);

        }

        return res.json(usersScore);
      }



    })


};

function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {

  for (var i = 0; i < arraytosearch.length; i++) {

    if (arraytosearch[i][key] === valuetosearch) {
      return i;
    }
  }
  return null;
}

function scoreUsersData(req, res, next, callback) {


  var scoreTot = 0;
  var hsTrash = 0;
  var hsFlash = 0;
  var hsWash = 0;
  var totalHs = 0;

  Score.find()
    .and({
      player: req.params.id
    })
    .exec(function(err, scores) {
      if (err) {
        return next(err);
      }

      for (var i = 0; i < scores.length; i++) {


        if (scores[i].gameName === "wash") {

          var ptsWash = scores[i].pts * 3.75

          scoreTot = ptsWash + scoreTot;

          if (scores[i].pts > hsWash) {
            hsWash = scores[i].pts;
          }

        }


        if (scores[i].gameName === "trash") {

          var ptsTrash = scores[i].pts * 1.4

          scoreTot = ptsTrash + scoreTot;

          if (scores[i].pts > hsTrash) {
            hsTrash = scores[i].pts;
          }

        }
        if (scores[i].gameName === "flash") {

          var ptsFlash = scores[i].pts

          scoreTot = ptsFlash + scoreTot;

          if (scores[i].pts > hsFlash) {
            hsFlash = scores[i].pts;
          }

        }

      }

      totalHs = hsWash + hsTrash + hsFlash;
      var tab = {
        "scoreTot": Math.round(scoreTot),
        "hsWash": hsWash,
        "hsFlash": hsFlash,
        "hsTrash": hsTrash,
        "totalHs": totalHs
      };


      var usersScore = [];
      var usr = {}
      User.find()
        .populate('scores')
        .exec(function(err, users) {
          if (users.length === 0) {

            res.status(422).json({
              message: 'pas de users dans la bd'
            }).end();

          } else {



            for (var i = 0; i < users.length; i++) {
              var scs = users[i].scores
              var scsTot = 0;
              var usr = {};


              for (var y = 0; y < scs.length; y++) {



                if (scs[y].gameName === "trash") {

                  var ptsTrash = scs[y].pts * 1.4

                  scsTot = ptsTrash + scsTot;

                }
                if (scs[y].gameName === "flash") {

                  var ptsFlash = scs[y].pts

                  scsTot = ptsFlash + scsTot;

                }
                if (scs[y].gameName === "wash") {
                  var ptsWash = scs[y].pts * 3.75

                  scsTot = ptsWash + scsTot

                }


              }


              usr.id = users[i].id;
              usr.pts = scsTot;
              usersScore.push(usr);
            }
            usersScore.sort(function(a, b) {
              return parseInt(a.pts) - parseInt(b.pts)
            });
            usersScore.reverse();
            var index = functiontofindIndexByKeyValue(usersScore, "id", req.params.id);
            index++;


            tab.rank = index;
            callback(tab);
            //return res.json(tab);
          }


        })


    });



}


exports.userScore = function(req, res, next) {

  var userId = req.params.id;
  User.findById(userId, function(err, player) {
    if (err) {
      return validationError(res, err)
    }
    if (!player) {
      return res.json("user undefined");
    }
    scoreUsersData(req, res, next, callback);
  })

  var usrScore = {};
  var callback = function(tab) {

    var userId = req.params.id;
    User.findById(userId)
      .select('-hashedPassword -salt -scores')
      .exec(function(err, user) {
        if (err) return res.send(500, err);
        usrScore.user = user;
        usrScore.scores = tab;
        return res.json(200, usrScore);
      })

  }



}



exports.login = function(req, res, next) {

  if (!req.body.pseudo) return res.status(400).json({
    message: 'need pseudo'
  }).end();
  if (!req.body.hashedPassword) return res.status(400).json({
    message: 'need password'
  }).end();

  User.findOne({
    'pseudo': req.body.pseudo
  }, "", function(err, user) {
    if (err) return validationError(res, err)

    if (!user) {
      return res.status(422).json({
        message: 'wrong pseudo'
      }).end();
    }
    bcrypt.compare(req.body.hashedPassword, user.hashedPassword, function(err, isMatch) {
      if (err) {
        return res.status(422).json({
          message: 'wrong password'
        }).end();
      }

      if (!isMatch) {
        return res.status(422).json({
          message: 'wrong password'
        }).end();
      }
      var userId = user.id;
      req.params.id = userId;
      var usrScore = {};
      var callback = function(tab) {
        User.findById(userId)
          .select('-hashedPassword -scores ')
          .exec(function(err, user) {
            if (err) return res.send(500, err);
            usrScore.user = user;
            usrScore.scores = tab;
            return res.json(200, usrScore);
          })
      }
      scoreUsersData(req, res, next, callback);

    });
  })


};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;
  User.findById(userId)
    .select('-hashedPassword')
    .populate('scores')
    .exec(function(err, user) {
      if (!user) return res.status(400).json({
        message: 'user undefined'
      }).end();
      if (err) return res.send(500, err);
      return res.json(200, user.profile);
    })
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function(err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user.profile);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.send(500, err);
}