'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var routes = {};

routes.index = function(req, res) {
	res.sendFile(path.join(__dirname + '/app/index.html'));
};

module.exports = routes;
