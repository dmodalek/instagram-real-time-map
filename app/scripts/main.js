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

		console.log('Init InstagramRealTimeMap');

		// Init Socket.io
		initSocketIO();

		// Init Collection
		InstagramRealTimeMap.Collections.instagrams = new Instagrams({
			model: Instagram
		});

		// Init View
		InstagramRealTimeMap.Views.map = new Map({
			collection: InstagramRealTimeMap.Collections.instagrams
		});
	},
};

//
// Backbone

// Init Model
var Instagram = Backbone.Model;

// Init Collections
var Instagrams = Backbone.Collection.extend();

// Init View
var Map = Backbone.View.extend({

	el: $('#map_canvas'),

	initialize: function() {

		// Create map
		var map = L.map('map_canvas', {
			center: [46.845164, 8.536377],
			zoom: 4
		    /*minZoom: 8,
		    zoom: 2,
		    maxZoom: 12,
		    maxBounds: [
				[47.665387, 5.592041],
				[45.813486, 10.832520]
			]*/
		});

		// Basic Map Layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// Define Cluster
		var markerClusterGroup = new L.MarkerClusterGroup({
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
		markerClusterGroup.on('click', function (ev) {
			var image = ev.layer;
			var imageTemplate = '<a href="{link}" target="_blank" title="View on Instagram"><img src="{image_big}"/></a><p>{caption}</a></p>';
			ev.layer.bindPopup(L.Util.template(imageTemplate, image), { className: 'leaflet-popup-instagram', offset: new L.Point(40, -420)}).openPopup();
		});

		map.addLayer(markerClusterGroup);


		//
		// Update View on Add Event

		this.collection.bind('add', function(model) {

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
				console.log('Pre-Loaded');
				markerClusterGroup.addLayer(marker);
			});
		});
	}
});

//
// Socket IO Communication

// TODO: Implement BulkAdd with Layers, see https://github.com/Leaflet/Leaflet.markercluster

var initSocketIO = function() {

	var self = this,
		socket = io.connect();

	//
	// Initial add event

	socket.on('initialAdd', function(data){
		console.log("Add initial Instagrams");
		self.addToCollection(data.initialAdd);
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
			console.log("Add new Instagrams");
			self.addToCollection(current);
		});
	});

	// Helper Function: filter instagrams
	self.filterInstagrams = function(instagrams) {

		// Make array if single instagram
		if (_.isArray(instagrams) == false) {
			instagrams = new Array(instagrams);
		}

		return _.filter(instagrams, function(instagram){ return instagram.type === 'image' && instagram.location });
	};

	// Helper Function: add instagrams to Collection
	self.addToCollection = function(instagrams) {
		InstagramRealTimeMap.Collections.instagrams.add(this.filterInstagrams(instagrams));
	};
}



//
// Bootstrap

$(document).ready(function () {
	'use strict';

	InstagramRealTimeMap.init();
});
