/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.AboutView = Backbone.View.extend({

		el: '#about-markup',

		events: {
			'click .about-trigger': 'open',
			'click .close-trigger': 'close'
		},

		initialize: function(options) {

			this.vent = options.vent;
			this.router = options.router;
			this.vent.bind('router:about', this.open, this);

			this.UIBtnn = new UIMorphingButton(this.el, {
				closeEl : '.close-trigger'
			} );
		},

		open: function() {
			this.router.navigate('/about');
			this.UIBtnn.toggle();
		},

		close: function() {
			this.router.navigate('/');
			this.UIBtnn.toggle();
		}
	});

})();
