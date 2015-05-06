/*global Backbone */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.Router = Backbone.Router.extend({

		routes: {
			'about': 'about'
		},

		initialize: function(options) {
			this.vent = options.vent;
		},

		about: function(){
			this.vent.trigger('router:about');
		}
	});

})();
