/*global Backbone */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.Router = Backbone.Router.extend({

		routes: {
			'about': 'about',
			'detail:id': 'detail'
		},

		initialize: function(options) {
			this.vent = options.vent;
		},

		about: function(){
			this.vent.trigger('router:about');
		},

		detail: function(id) {
			console.log('Detail View');
			this.vent.trigger('router:detail');
		}
	});

})();
