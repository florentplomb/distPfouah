'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  pts:{type: Number, required: true},
  player:{ type: Schema.Types.ObjectId, ref: 'User',required: true },
  gameName:{ type: String,required: true },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', ScoreSchema);