/*global Backbone */
var Insta = Insta || {};

(function () {
	'use strict';

	// Models
	Insta.Instagram = Backbone.Model.extend({
		defaults: {
			id: null,
			selected: false,
			type: null,
			images: {
				thumbnail: {},
				standard_resolution: {}
			},
			caption: {
				text: ''
			},
			location: {
				latitude: null,
				longitude: null
			}
		}
	});

	// Collections
	Insta.Instagrams = Backbone.Collection.extend({

		initialize: function(options) {
			this.vent = options.vent;
			this.config = options.config;

			_.bindAll(this, 'addToCollection');
			this.vent.bind('socket:add', this.addToCollection);
		},

		addToCollection: function(instagrams) {
			var instagrams = this._parseInstagrams(instagrams.data);
			this.add(instagrams);
		},

		_parseInstagrams: function(instagrams) {

			var boundaries = this.config.boundaries;
			var parsedInstagrams;

			// Make array if single instagram
			if (_.isArray(instagrams) == false) {
				parsedInstagrams = new Array(instagrams);
			}

			parsedInstagrams = _.filter(instagrams, function(instagram){
				return 	instagram.type === 'image' &&
						instagram.location //&&
						// instagram.location.latitude > options.boundaries[0][0] &&
						// instagram.location.latitude > options.boundaries[1][0] &&
						// instagram.location.longitude > options.boundaries[0][1] &&
						// instagram.location.longitude > options.boundaries[1][1]
			});

			return parsedInstagrams;
		},

		// // Unselect all models
		// resetSelected: function() {
		// 	this.each(function(model) {
		// 		model.set({'selected': false});
		// 	});
		// },

		// // Select a specific model from the collection
		// selectByID: function(id) {
		// 	this.resetSelected();
		// 	var instagram = this.get(id);
		// 	instagram.set({'selected': true});
		// 	return instagram.id;
		// },
	});

})();
