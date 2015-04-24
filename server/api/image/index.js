'use strict';

var express = require('express');
var controller = require('./image.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.get('/',controller.index);
router.get('/:id',controller.show);
router.post('/',controller.create);
router.post('/:id/liked',controller.liked);
router.put('/:id',auth.hasRole('admin'),controller.update);
router.delete('/:id',auth.isAuthenticated(),auth.hasRole('admin'),controller.destroy);

module.exports = router;