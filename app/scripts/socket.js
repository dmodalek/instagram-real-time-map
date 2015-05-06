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

		var onSocketRecentInstagrams = function(recentInstagrams){
			console.log('Socket: Recent Instagrams');
			vent.trigger('socket:add', recentInstagrams.data);
		};

		var onSocketNewInstagrams = function(newInstagrams) {

			$.ajax({
				url: newInstagrams.url,
				type: 'POST',
				crossDomain: true,
				dataType: 'jsonp'
			}).done(function (newInstagrams) {
				console.log('Socket: New Instagrams');
				vent.trigger('socket:add', newInstagrams.data);
			});
		};

		// Socket Event: Recent Instagrams
		socket.on('socketRecentInstagrams', onSocketRecentInstagrams);

		// Socket Event: New Instagrams
		socket.on('socketNewInstagrams', onSocketNewInstagrams);



	};

})();
