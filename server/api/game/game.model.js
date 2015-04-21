'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  name: String,
  totalScore:{ type: Number, default: 0 },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});


GameSchema
  .path('name')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({
      name: value
    }, function(err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified name address is already in use.');
module.exports = mongoose.model('Game', GameSchema);