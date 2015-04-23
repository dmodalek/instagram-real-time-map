"use strict";

var Instagram = require('instagram-node-lib');
var express = require("express");
var env = require('dotenv').load();				// Load environment settings
var logger = require('morgan');					// Logs HTTP Requests

var app = express();
var port = process.env.PORT || 5000;
var io = require('socket.io').listen(app.listen(port));

//
// Hashtag

var hashtag = 'awesome';


//
// Instagram

// Set the configuration
Instagram.set('client_id', process.env.INSTAGAM_CLIENT_ID);
Instagram.set('client_secret', process.env.INSTAGAM_CLIENT_SECRET);
Instagram.set('callback_url', process.env.SITE_URL + '/callback');
Instagram.set('redirect_uri', process.env.SITE_URL);
Instagram.set('maxSockets', 10);

// Subscribe to Instagram Real Time API with Hashtag
Instagram.subscriptions.subscribe({
	object: 'tag',
	object_id: hashtag,
	aspect: 'media',
	callback_url: process.env.SITE_URL + '/callback',
	type: 'subscription',
	id: '#'
});


//
// Socket.io

// First connection
io.sockets.on('connection', function (socket) {
	console.log("Socket IO: Connected. Waiting for Handshake...");
	Instagram.tags.recent({
		name: hashtag,
		complete: function(data) {
			console.log("Socket IO: Initial Add");
			socket.emit('initialAdd', { initialAdd: data });
		}
	});
});

// Handshake
app.get('/callback', function(req, res){
	console.log("Socket IO: Handshake");
	var handshake =  Instagram.subscriptions.handshake(req, res);
});

// New Instagrams
app.post('/callback', function(req, res) {
	console.log("Socket IO: Send Instagrams to Client");
	var data = req.body;
	data.forEach(function(tag) {
		var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+process.env.INSTAGAM_CLIENT_ID;
		io.sockets.emit('add', { add: url });
	});
	res.end();
});

// Socket.io on Heroku https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
// io.configure(function () {
//   io.set("transports", [
//     'websocket'
//     , 'xhr-polling'
//     , 'flashsocket'
//     , 'htmlfile'
//     , 'jsonp-polling'
//     ]);
//   io.set("polling duration", 10);
// });


///////////////////////////////////////////////////////////


//
// Express

app.configure(function(){
	app.use(logger('dev', { immediate: true, format: 'dev' }));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler());

	if ('development' === process.env.NODE_ENV) {
		app.use(express.static(__dirname + '/app'));
		app.use(express.static(__dirname + '/.tmp'));
	} else {
		app.use(express.static(__dirname + '/dist'));
	}
});

// This must be the last route
app.get('/detail/:id', function(req, res){
	res.sendfile(__dirname + '/app/index.html');
});

console.log("Listening on " + process.env.SITE_URL);
