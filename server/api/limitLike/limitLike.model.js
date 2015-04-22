'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LimitLikeSchema = new Schema({
  code: String
});

module.exports = mongoose.model('LimitLike', LimitLikeSchema);