'use strict';

var _ = require('lodash');
var Image = require('./image.model');
var Player = require('../user/user.model');
var Limitlike = require('../limitLike/limitLike.model');
var fs = require('fs');

var validationError = function(res, err) {
  return res.json(422, err);
};
function handleError(res, err) {
  return res.send(500, err);
}


// Get list of images
exports.index = function(req, res) {
  Image.find()
  .select('-data')
  .exec(function(err, images) {
    if (err) {
      return validationError(res, err);
    }
    return res.json(200, images);
  })
};


exports.liked = function(req, res) {

  if (!req.body.like) return res.status(400).json({
    message: 'need like'
  }).end();

  if (!req.body.check) return res.status(400).json({
    message: 'need check'
  }).end();


  Image.findById(req.params.id, function(err, image) {
    if (err) {
      return validationError(res, err);
    }
    if (!image) {
      return validationError(res, err);
    }

    Limitlike.findOne({
      code: req.body.check
    },"",function (err, limiteLike) {

      if (!limiteLike) {
        return res.json({
          code: 204,
          message: "Code wrong"
        }).end();
      }

    for (var i = 0; i < image.likeBy.length; i++) {

      if (image.likeBy[i] === req.body.check) {
        return res.status(400).json({
          message: 'Vote already set'
        }).end();
      }
    }

    if (req.body.like === "p") {
      image.like = image.like + 1;
    } else if (req.body.like === "n") {
      image.like = image.like - 1;
    } else {
       return res.status(400).json({
          message: 'like invalide'
        }).end();
    }
    image.likeBy.push(req.body.check);
    image.save(function(err, img) {
      if (err) return validationError(res, err);
      return res.json(img.like);
    });
  });
  });
};
// Get a single image
exports.show = function(req, res) {
  Image.findById(req.params.id, function(err, image) {
    if (err) {
      return validationError(res, err);
    }
    if (!image) {
      return res.send(404);
    }
    return res.end(image.data,'binary');
  });
};

// Creates a new image in the DB.
exports.create = function(req, res) {


  if (!req.body.imgBase64) {
    return res.json("json invalid");
  }

  var newImg = new Image();
  var imgBuf = new Buffer(req.body.imgBase64,'base64');
  newImg.data = imgBuf;
  newImg.contentType = "image/png";
  newImg.save(function(err, img) {
    if (err) return validationError(res, err);
    return res.json(img.id);

  });

}

// Updates an existing image in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Image.findById(req.params.id, function(err, image) {
    if (err) {
      return handleError(res, err);
    }
    if (!image) {
      return res.send(404);
    }
    var updated = _.merge(image, req.body);
    updated.save(function(err) {
      if (err) {
        return validationError(res, err);
      }
      return res.json(200, image);
    });
  });
};

// Deletes a image from the DB.
exports.destroy = function(req, res) {
  Image.findById(req.params.id, function(err, image) {
    if (err) {
      return handleError(res, err);
    }
    if (!image) {
      return res.send(404);
    }
    image.remove(function(err) {
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