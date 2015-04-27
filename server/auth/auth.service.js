'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');

var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({
  secret: config.secrets.session
});
var _ = require('underscore');

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */

function isAuthenticated() {

  return compose()

  .use(function(req, res, next) {


    if (!req.headers['salt']) return res.status(400).json({
      message: 'header wrong'
    }).end();
    var userSalt = req.headers['salt'];

    User
      .find()
      .and({
        salt: userSalt
      })
      .exec(function(err, userFound) {
        if (userFound.length === 0) {
          res.status(422).json({
            message: 'Not authorized'
          }).end();
        }else{
            next();

        }
      });
  });

}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {

    return compose()

  .use(function(req, res, next) {

    if (!req.headers['salt']) return res.status(400).json({
      message: 'header wrong'
    }).end();
    var userSalt = req.headers['salt'];

    User
      .find()
      .and({
        salt: userSalt
      })
      .and({roles : roleRequired })
      .exec(function(err, userFound) {
        if (userFound.length === 0) {
          res.status(422).json({
            message: 'Not authorized'
          }).end();
        }else{
            next();

        }
      });
  });

}




/**
 * Set token cookie directly for oAuth strategies
 */


exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;

