/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.AboutModel = Backbone.Model.extend();

	Insta.AboutView = Backbone.View.extend({

		el: '#about-markup',

		events: {
			'click .about-trigger': 'toggleState',
			'click .close-trigger': 'toggleState'
		},

		initialize: function(options) {

			this.vent = options.vent;
			this.router = options.router;
			this.vent.bind('router:about', this.toggleState, this);

			this.aboutModel = new Insta.AboutModel();
			this.listenTo(this.aboutModel, 'change:open', this.render);

			this.UIBtnn = new UIMorphingButton(this.el, {
				closeEl : '.close-trigger'
			} );
		},

		toggleState: function() {
			this.aboutModel.set('open', !this.aboutModel.get('open'));
		},

		render: function() {
			if(this.aboutModel.get('open')) {
				console.log('Show Detail');
				// this.router.navigate('/about');
			} else {
				console.log('Hide Detail');
				// this.router.navigate('/');
			}
		}
	});

})();
