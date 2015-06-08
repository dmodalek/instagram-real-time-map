'use strict';

// Tools
var env = require('dotenv').load();	// Load environment settings
var logger = require('morgan');		// Logs HTTP Requests

// Project
var publicDir = 'app';

///////////////////////////////////////////////////////////

//
// Express

var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();
var server = http.Server(app);

// all environments
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
app.use(favicon(__dirname + '/'+publicDir+'/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.get('/admin', routes.admin);

// development
if ('development' == app.get('env')) {

	app.use(express.static(path.join(__dirname, publicDir)));
	app.use(express.static(path.join(__dirname, '/.tmp')));
	app.set('views', path.join(__dirname, 'views'));

	// error handling middleware should be loaded after the loading the routes
	app.use(errorHandler());
}

// production
if ('production' == app.get('env')) {
	app.use(express.static(path.join(__dirname + '/dist')));
}


///////////////////////////////////////////////////////////

//
// Instagram API

var Instagram = require('instagram-node-lib');

// Set the configuration
Instagram.set('client_id', process.env.INSTAGAM_CLIENT_ID);
Instagram.set('client_secret', process.env.INSTAGAM_CLIENT_SECRET);
Instagram.set('callback_url', process.env.SITE_URL + '/callback');
Instagram.set('redirect_uri', process.env.SITE_URL);
Instagram.set('maxSockets', 10);

// POST: Subscribe to Instagram Real Time API with Hashtag
Instagram.subscriptions.subscribe({
	object: 'tag',
	object_id: process.env.HASHTAG,
	aspect: 'media',
	callback_url: process.env.SITE_URL + '/callback',
	type: 'subscription',
	id: '#'
});


///////////////////////////////////////////////////////////

//
// Socket.io

var socket = require('socket.io');
var io = socket(server);

// Start Server with socket.io
server.listen(app.get('port'));

// Client Connection
// - fired once when a Client connects
io.sockets.on('connection', function (socket) {
	console.log("— Socket IO: Connection —");
	Instagram.tags.recent({
		name: process.env.HASHTAG,
		complete: function(data) {
			console.log("> Socket IO: Recent Instagrams");
			socket.emit('socketRecentInstagrams', { data: data});
		}, error: function(e) {
			console.log('> Socket.io: Error');
			console.log(e);
		}
	});
});

// GET: Handshake
// - verifies that we realy want to create a subscription
app.get('/callback', function(req, res){
	console.log("— Socket IO: Handshake —");
	var handshake =  Instagram.subscriptions.handshake(req, res);
});

// POST: New Instagrams
// - Instagrams POST to this URL when new Instagrams are available
app.post('/callback', function(req, res) {
	console.log("— Socket IO: New Instagrams —");

	var data = req.body;
	data.forEach(function(tag) {
		var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+process.env.INSTAGAM_CLIENT_ID;
		io.sockets.emit('socketNewInstagrams', { url: url });
	});
	res.end();
});


// Get all other routes
app.get('/*', routes.home);
