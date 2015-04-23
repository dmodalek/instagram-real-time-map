/*global App, $, io, google*/

"use strict";

//
// Options

var options = {
	boundaries: [
	[47.665387, 5.592041],
	[45.813486, 10.832520]
	]
};


//
// Backbone Definitions

// Router

var MapRouter = Backbone.Router.extend({
	routes: {
		'detail/:id': 'showDetail',
		'':           'showMap'
	},

	showDetail: function(id) {
		console.log('Route: Detail');
		window.App.Views.detail.render(id);
	},
});


// Monitor

var Monitor = function(collection) {
	_.extend(this, Backbone.Events);
	this.listenTo(collection, 'all', function (eventName) {
		console.log('Event: ' + eventName);
	});
};

// Models

var Instagram = Backbone.Model.extend({
	defaults: {
		id: '0',
		selected: false,
		type: '-',
		caption: {
			text: '-'
		},
		location: {
			latitude: '0',
			longitude: '0'
		}
	}
});

// Collections

var Instagrams = Backbone.Collection.extend({
	model: Instagram,

	// Unselect all models
	resetSelected: function() {
		this.each(function(model) {
			model.set({'selected': false});
		});
	},

	// Select a specific model from the collection
	selectByID: function(id) {
		this.resetSelected();
		var instagram = this.get(id);
		instagram.set({'selected': true});
		return instagram.id;
	}
});

// Views

var LayoutView = Backbone.View.extend({

});

var DetailView = Backbone.View.extend({

	tagName: 'section',
	className: 'detail',

	render: function(instagramId) {
		console.log(instagramId);
		this.$el.html(this.model.get('caption').text);
		this.$el.toggleClass('selected', this.model.get('selected'));
	    return this; // allows to chain othr method calls on render()
	}



	// template: _.template('Detail'),
	// render: function() {
		// this.$el.html(this.template(this.model.attributes));
		// return this;
	// },

	// initialize: function() {
		// console.log('Init Modal View');
	// }
});

var MapView = Backbone.View.extend({

	el: $('#map_canvas'),

	initialize: function() {

		// Create map
		var leaflet_map = L.map('map_canvas', {
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
		}).addTo(leaflet_map);

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
			ev.layer.bindPopup(L.Util.template(imageTemplate, image), { className: 'leaflet-popup-instagram', offset: new L.Point(40, -440)}).openPopup();
		});

		leaflet_map.addLayer(markerClusterGroup);

		// Current Location
		var lc = L.control.locate().addTo(leaflet_map);


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


///////////////////////////////////////////////////////////


//
// Socket IO Communication
// - TODO: Implement BulkAdd with Layers, see https://github.com/Leaflet/Leaflet.markercluster

var initSocketIO = function() {

	var self = this,
	socket = io.connect();

	//
	// Initial add event

	socket.on('initialAdd', function(data){
		console.log("Add initial Instagrams ("+ data.initialAdd.length +" candiates)");
		addToCollection(data.initialAdd);
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
	var filterInstagrams = function(instagrams) {

		var boundaries = options.boundaries;

		// Make array if single instagram
		if (_.isArray(instagrams) == false) {
			instagrams = new Array(instagrams);
		}

		return _.filter(instagrams, function(instagram){ return instagram.type === 'image' && instagram.location && instagram.location.latitude > options.boundaries[0][0] && instagram.location.latitude > options.boundaries[1][0] && instagram.location.longitude > options.boundaries[0][1] && instagram.location.longitude > options.boundaries[1][1] });
	};

	// Helper Function: add instagrams to Collection
	var addToCollection = function(instagrams) {

		var instagram = new Instagram(filterInstagrams(instagrams));

		console.log('123');
		console.log(instagram);

		App.Collections.instagrams.add(instagram);
	};
}


///////////////////////////////////////////////////////////


//
// Instagram Real Time Map

window.App = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Events: _.extend({}, Backbone.Events), // The global Event Bus

	init: function () {

		console.log('Init App');

		// Router
		var router = new MapRouter();
		Backbone.history.start({
			pushState: true,
			root: '/'
		});

		// Socket.io
		initSocketIO();

		// Collections
		App.Collections.instagrams = new Instagrams();

		// Views
		App.Views.layout = new LayoutView();

		App.Views.map = new MapView({
			collection: App.Collections.instagrams
		});

		App.Views.detail = DetailView;

		// Events
		App.Monitor = new Monitor(App.Collections.instagrams);
	},
};



//
// Bootstrap

$(document).ready(function () {
	'use strict';

	App.init();
});
