/*global InstagramRealTimeMap, $, io, google*/

//
// Instagram Real Time Map

window.InstagramRealTimeMap = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	init: function () {
		'use strict';

		console.log('Hello from Backbone!');

		var self = this;

		self.initSocketIO();

		//
		// Models

		var Instagram = Backbone.Model;


		//
		// Collections

		var Instagrams = Backbone.Collection.extend();


			// View

			var Map = Backbone.View.extend({

				el: $('#map_canvas'),

				initialize: function() {

					// create a map in the "map" div, set the view to a given place and zoom
					var map = L.map('map_canvas', {
						center: [46.845164, 8.536377],
					    // minZoom: 8,
					    zoom: 8,
					    // maxZoom: 12,
					    // maxBounds: [
		    				// [47.665387, 5.592041],
		    				// [45.813486, 10.832520]
						// ]
					});

					L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
						attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					}).addTo(map);

					var markers = new L.MarkerClusterGroup({
						showCoverageOnHover: false,

						iconCreateFunction: function(cluster) {
							var marker = cluster.getAllChildMarkers()[0];
							var iconUrl = marker.image;

							return new L.DivIcon({
								className: 'leaflet-cluster-instagram',
								html: '<img src="' + iconUrl + '"><b>' + cluster.getChildCount() + '</b>'
							});
						}

					    // animateAddingMarkers: maybe awesome
					    // spiderfyDistanceMultiplier: useful when using big icons see https://github.com/Leaflet/Leaflet.markercluster
					});

					this.collection.bind('add', function(model) {

						var LeafIcon = L.Icon.extend({
							options: {
								iconSize:     [80, 80]
							}
						});

						var marker = new L.Marker([model.get('location').latitude, model.get('location').longitude], { icon:  new LeafIcon({iconUrl: model.get('images').thumbnail.url})});

						marker.image = model.get('images').thumbnail.url;

						markers.addLayer(marker);
						map.addLayer(markers);
					});
				}
			});

		//
		// Initialize

		InstagramRealTimeMap.Collections.instagrams = new Instagrams({
			model: Instagram
		});

		// Create the Map view, binding it to the tweets collection
		InstagramRealTimeMap.Views.twitterMap = new Map({
			collection: InstagramRealTimeMap.Collections.instagrams
		});

	},


	//
	// Socket IO Communication

	// TODO: Implement BulkAdd with Layers, see https://github.com/Leaflet/Leaflet.markercluster

	initSocketIO: function() {

		var self = this,
			socket = io.connect();

		//
		// Initial add event

		socket.on('initialAdd', function(data){
			jQuery.each(data.initialAdd, function() {
				self.add(this);
			});
		});

		//
		// Add event

		socket.on('add', function(data){
			var url = data.add;
			$.ajax({
				url: url,
				type: 'POST',
				crossDomain: true,
				dataType: 'jsonp'
			}).done(function (data) {
				var current = data.data[0];
				self.add(current);
			});
		});

		// Helper Function: add images to Collection
		this.add = function(instagram) {
			if(instagram.type === 'image' && instagram.location) {
				InstagramRealTimeMap.Collections.instagrams.add(instagram);
			}
		};

	}
};


//
// Bootstrap

$(document).ready(function () {
	'use strict';

	InstagramRealTimeMap.init();
});
