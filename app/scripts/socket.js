/*global _, io */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.Socket = function(options) {
		// _.bindAll(this, 'onSocketRecentInstagrams');
		// _.bindAll(this, 'onSocketNewInstagrams');

		var vent = options.vent;

		// Socket.io
		var socket = io.connect();

		var onSocketRecentInstagrams = function(data){
			console.log('Socket: Recent Instagrams');
			vent.trigger('socket:add', data);
		};

		var onSocketNewInstagrams = function(data) {

			$.ajax({
				url: data.url,
				type: 'POST',
				crossDomain: true,
				dataType: 'jsonp'
			}).done(function (data) {
				console.log('Socket: New Instagrams');
				vent.trigger('socket:add', data);
			});
		};

		// Socket Event: Recent Instagrams
		socket.on('socketRecentInstagrams', onSocketRecentInstagrams);

		// Socket Event: New Instagrams
		socket.on('socketNewInstagrams', onSocketNewInstagrams);



	};

})();
