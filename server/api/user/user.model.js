'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
//var authTypes = ['kiou'];

var UserSchema = new Schema({

  pseudo: {type: String, required: true},
  hashedPassword: {type: String, required: true},

  imgId: { type: Schema.Types.ObjectId, ref: 'Image' },

   salt: {
    type: Number
  },


  scores: [ { type: Schema.Types.ObjectId, ref: 'Score' } ],

  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: String,
    default: 'user'
  },
});



//Public profile information
UserSchema
.virtual('profile')
.get(function() {
  return {
    'id': this.id,
    'pseudo': this.pseudo,
    'like' : this.like,
    'imgId' : this.imgId,
    'salt' : this.salt,
    'scores' : this.scores

  };
});






// Validate empty password
UserSchema
.path('hashedPassword')
.validate(function(hashedPassword) {
  return hashedPassword.length;
}, 'Password cannot be blank');

//Validate email is not taken

//Validate pseudo is not taken
UserSchema
.path('pseudo')
.validate(function(value, respond) {
  var self = this;
  this.constructor.findOne({
    pseudo: value
  }, function(err, user) {
    if (err) throw err;
    if (user) {
      if (self.id === user.id) return respond(true);
      return respond(false);
    }
    respond(true);
  });
}, 'The specified pseudo is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
// UserSchema
//   .pre('save', function(next) {
//     if (!this.isNew) return next();

//     if (!validatePresenceOf(this.hashedPassword))
//       next(new Error('Invalid password'));
//     else
//       next();
//   });

// /**
//  * Methods
//  */
// UserSchema.methods = {
//   /**
//    * Authenticate - check if the passwords are the same
//    *
//    * @param {String} plainText
//    * @return {Boolean}
//    * @api public
//    */
//   authenticate: function(plainText) {
//     return this.encryptPassword(plainText) === this.hashedPassword;
//   },

//   /**
//    * Make salt
//    *
//    * @return {String}
//    * @api public
//    */
//   makeSalt: function() {
//     return crypto.randomBytes(16).toString('base64');
//   },

//   /**
//    * Encrypt password
//    *
//    * @param {String} password
//    * @return {String}
//    * @api public
//    */
//   encryptPassword: function(password) {
//     if (!password || !this.salt) return '';
//     var salt = new Buffer(this.salt, 'base64');
//     return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
//   }
// };

module.exports = mongoose.model('User', UserSchema);
