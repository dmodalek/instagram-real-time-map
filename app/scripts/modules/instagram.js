/*global Backbone */
var Insta = Insta || {};

(function () {
	'use strict';

	// Models
	Insta.Instagram = Backbone.Model.extend({
		defaults: {
			id: null,
			caption: '',
			image: null,
			url: null,
			tags: '',
			selected: false,
			location: {
				latitude: null,
				longitude: null
			}
		},

		parse: function() {
			console.log('PARSE');
		}
	});

	// Collections
	Insta.Instagrams = Backbone.Collection.extend({

		initialize: function(options) {
			this.vent = options.vent;
			this.config = options.config;
			this.model = options.model;

			_.bindAll(this, 'addToCollection');
			this.vent.bind('socket:add', this.addToCollection);

			// this.attributeMap: [
			// 	{ name: 'id', 		mapping: 'deal.title'},
			// 	{ name: 'caption', 	mapping: 'deal.division.name'},
			//   	{ name: 'image', 	mapping: 'deal.option.price.formattedAmount'},
			//   	{ name: 'url', 		mapping: 'deal.startsAt'},
			//   	{ name: 'tags', 	mapping: 'deal.endsAt'},
			//   	{ name: 'selected', mapping: 'deal.option.soldQuantity'}
			//   	{ name: 'location', mapping: 'deal.option.soldQuantity'}
			// ];
		},

		addToCollection: function(instagrams) {
			var models = this._parseInstagrams(instagrams);
			this.add(models);
		},

		_parseInstagrams: function(instagrams) {
			// var boundaries = this.config.boundaries;
			var instagramModels = [];

			// Make array if single instagram
			instagrams = (_.isArray(instagrams)) ? instagrams : new Array(instagrams);

			// Remove some that do not have a location
			instagrams = _.filter(instagrams, function(instagram){
				return 	instagram.type === 'image' &&
						instagram.location; // &&
						// instagram.location.latitude > boundaries[0][0] &&
						// instagram.location.latitude > boundaries[1][0] &&
						// instagram.location.longitude > boundaries[0][1] &&
						// instagram.location.longitude > boundaries[1][1];
			});


			// Create clean models
			_.each(instagrams, function(instagram) {

				instagramModels.push({
					id: instagram.id,
					caption: instagram.caption.text,
					image: instagram.images.thumbnail.url,
					url: instagram.link,
					tags: instagram.tags,
					selected: false,
					location: {
						latitude: instagram.location.latitude,
						longitude: instagram.location.longitude
					}
				});
			});

			return instagramModels;
		},

		// // Unselect all models
		resetSelected: function() {
			this.each(function(model) {
				model.set({'selected': false});
			});
		},

		_getSelectedInstagram: function() {
			return this.where({selected: true});
		},

		_selectInstagram: function(marker) {
			this.resetSelected();
			var instagram = this.get(marker.id);
			instagram.set({'selected': true});
			return instagram.id;
		}
	});

})();
