/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.AboutView = Backbone.View.extend({

		el: '#about-markup',

		events: {
			'click .about-trigger': 'toggle'
		},

		initialize: function() {

			this.UIBtnn = new UIMorphingButton(document.querySelector('.about-markup'), {
				closeEl : '.close-trigger'
			} );
		},

		toggle: function() {
			this.UIBtnn.toggle();
		}

	});

})();
