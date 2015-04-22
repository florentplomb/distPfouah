'use strict';

var _ = require('lodash');
var LimitLike = require('./limitLike.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

function handleError(res, err) {
  return res.send(500, err);
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Get list of limitLikes
exports.index = function(req, res) {

  var date = Date.now();
  var text = makeid();
  var cookie = text + date + text;
  var limitLike = new LimitLike();
  limitLike.code = cookie;
  limitLike.save(function(err, limitLike) {
    if (err) return validationError(res, err);
    res.json({
      code : limitLike.code
    });
  });


};

// Get a single limitLike
exports.show = function(req, res) {
  LimitLike.findById(req.params.id, function(err, limitLike) {
    if (err) {
      return handleError(res, err);
    }
    if (!limitLike) {
      return res.send(404);
    }
    return res.json(limitLike);
  });
};

// Creates a new limitLike in the DB.
exports.create = function(req, res) {
  LimitLike.create(req.body, function(err, limitLike) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, limitLike);
  });
};

// Updates an existing limitLike in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  LimitLike.findById(req.params.id, function(err, limitLike) {
    if (err) {
      return handleError(res, err);
    }
    if (!limitLike) {
      return res.send(404);
    }
    var updated = _.merge(limitLike, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, limitLike);
    });
  });
};

// Deletes a limitLike from the DB.
exports.destroy = function(req, res) {
  LimitLike.findById(req.params.id, function(err, limitLike) {
    if (err) {
      return handleError(res, err);
    }
    if (!limitLike) {
      return res.send(404);
    }
    limitLike.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}