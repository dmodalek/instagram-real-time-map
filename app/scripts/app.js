/*global Insta, Backbone, $*/

'use strict';

var app = {
	config: {
		boundaries: [
			[47.665387, 5.592041],
			[45.813486, 10.832520]
		]
	},

	init: function () {

		// Extend Events
		var vent = _.extend({}, Backbone.Events);

		// Router
		var router = new Insta.Router({
			vent: vent
		});

		// Collection
		app.instagrams = new Insta.Instagrams({
			model: Insta.Instagram,
			vent: vent,
			config: app.config
		});

		// View
		app.mapView = new Insta.MapView({
			collection: app.instagrams
		});

		// About
		app.aboutView = new Insta.AboutView({
			vent: vent,
			router: router
		});

		// // Socket
		app.socket = new Insta.Socket({
			vent: vent
		});
	},
};

///////////////////////////////////////////////////////////

// Bootstrap

$(function () {

	new app.init();

	Backbone.history.start({
		pushState: true,
		root: '/'
	});

});
