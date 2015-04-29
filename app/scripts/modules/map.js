/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.MapView = Backbone.View.extend({

		el: $('#map_canvas'),

		initialize: function(options) {

			this.collection = options.collection;
			this.map = new Map();
			this.listenTo(this.collection, 'add', this.map.addMarker);
			console.log(this.map);
		}
	});

	var Map = function() {

		var theMap = L.map('map_canvas', {
			center: [46.845164, 8.536377],
			zoom: 4,
		    /*minZoom: 8,
		    zoom: 2,
		    maxZoom: 12,
		    maxBounds: options.boundaries
		    */
		});

		// Basic Map Layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(theMap);

		// Define Cluster
		this.markerClusterGroup = new L.MarkerClusterGroup({
			showCoverageOnHover: false,
			animateAddingMarkers: false,

			iconCreateFunction: function(cluster) {
				var marker = cluster.getAllChildMarkers()[0];
				var iconUrl = marker.image;

				return new L.DivIcon({
					className: 'leaflet-cluster',
					html: '<img src="' + iconUrl + '"><b>' + cluster.getChildCount() + '</b>'
				});
			}
		});

		// Cluster Click
		this.markerClusterGroup.on('click', function (ev) {
			var image = ev.layer;
			var imageTemplate = '<a href="{link}" target="_blank" title="View on Instagram"><img src="{image_big}"/></a><p>{caption}</a></p>';
			ev.layer.bindPopup(L.Util.template(imageTemplate, image), { className: 'leaflet-popup-instagram', offset: new L.Point(40, -440)}).openPopup();
		});

		theMap.addLayer(this.markerClusterGroup);

		// Current Location
		var lc = L.control.locate().addTo(theMap);

		// Add Marker
		this.addMarker = function(model) {
			var self = this;
			var marker = new L.Marker([model.get('location').latitude, model.get('location').longitude], { icon:  new L.Icon({iconUrl: model.get('images').thumbnail.url})});
			marker.caption = model.get('caption').text;
			marker.link = model.get('link');
			marker.image = model.get('images').thumbnail.url;
			marker.image_big = model.get('images').standard_resolution.url;

			// Pre-Load image
			$.ajax({
				url: marker.image,
				type: 'GET',
				crossDomain: true
			}).done(function (data) {
				self.map.markerClusterGroup.addLayer(marker);
			});
		};

		return this;
	};

})();
