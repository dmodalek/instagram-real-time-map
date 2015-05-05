/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.AboutView = Backbone.View.extend({

		el: '#about-markup',

		events: {
			'click .about-button': 'toggle'
		},

		initialize: function() {

			this.UIBtnn = new UIMorphingButton(document.querySelector('.about-markup'), {
				closeEl : '.icon-close'
			} );

			this.render();
		},

		render: function() {

		},

		toggle: function() {
			this.UIBtnn.toggle();
		}

	});

})();
