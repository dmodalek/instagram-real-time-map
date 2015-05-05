'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var routes = {};

routes.home = function(req, res) {
	res.sendFile(path.join(__dirname + '/../app/index.html'));
};

routes.admin = function(req, res) {
	res.sendFile(path.join(__dirname + '/../views/admin.html'));
};

module.exports = routes;
