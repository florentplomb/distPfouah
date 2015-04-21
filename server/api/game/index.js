'use strict';

var express = require('express');
var controller = require('./game.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',auth.isAuthenticated(), controller.index);
router.get('/:name',auth.isAuthenticated(), controller.show);
router.get('/:id/rank',auth.isAuthenticated(), controller.rank); // à re voir !!!
router.post('/',auth.isAuthenticated(),auth.hasRole('admin'), controller.create);
router.put('/:id',auth.isAuthenticated(),auth.hasRole('admin'), controller.update);
router.delete('/:id',auth.isAuthenticated(),auth.hasRole('admin'), controller.destroy);

module.exports = router;