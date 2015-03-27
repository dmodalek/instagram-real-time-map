"use strict";

var config = {};

var Instagram = require('instagram-node-lib');
var express = require("express");

var app = express();
var port = process.env.PORT || 5000;
var io = require('socket.io').listen(app.listen(port));
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//
// Config

config = {
	instagramClientID: '07ad147eeab64e43a8fde7b7d715e170',
	instagramClientSecret: 'e03b2ce737bb4c759461ff7aca022688',
	hashtag: 'awesome',
	siteURL: (env === 'development') ? 'http://4f122803.ngrok.com' : 'https://instagram-real-time-map.herokuapp.com'
};

//
// Express

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler());

	if ('development' === env) {
		app.use(express.static(__dirname + '/app'));
		app.use(express.static(__dirname + '/.tmp'));
	} else {
		app.use(express.static(__dirname + '/dist'));
	}

});

console.log("Listening on " + config.siteURL);


//
// Instagram

// Set the configuration

Instagram.set('client_id', config.instagramClientID);
Instagram.set('client_secret', config.instagramClientSecret);
Instagram.set('callback_url', config.siteURL + '/callback');
Instagram.set('redirect_uri', config.siteURL);
Instagram.set('maxSockets', 10);

// Subscribe to Instagram Real Time API with Hashtag

Instagram.subscriptions.subscribe({
	object: 'tag',
	object_id: config.hashtag,
	aspect: 'media',
	callback_url: config.siteURL + '/callback',
	type: 'subscription',
	id: '#'
});


//
// Socket.io

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

// First connection

io.sockets.on('connection', function (socket) {
	console.log("Socket IO: Connected. Waiting for Handshake...");
	Instagram.tags.recent({
		name: config.hashtag,
		complete: function(data) {
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
		var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+config.instagramClientID;
		io.sockets.emit('add', { add: url });
	});
	res.end();
});
