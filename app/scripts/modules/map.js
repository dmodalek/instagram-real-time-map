/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.MapCollectionView = Backbone.View.extend({

		el: $('#map_canvas'),

		events: {
			'click .leaflet-marker-icon': '_selectInstagram'
		},

		initialize: function(options) {
			this.collection = options.collection;
			this.listenTo(this.collection, 'add', this._addMarker);
			this._createMap();
		},

		_createMap: function() {
			this.map = L.map('map_canvas', {
				center: [46.845164, 8.536377],
				zoom: 4,
			    /*minZoom: 8,
			    zoom: 2,
			    maxZoom: 12,
			    maxBounds: options.boundaries
			    */
			});

			// Basic Map Layer
			var basicLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map);

			// Current Location
			var lc = L.control.locate().addTo(this.map);

			// Cluster
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
			})
			.on('click', function (ev) {
				new Insta.MapDetailView({ instagram: ev.layer});
			})
			.addTo(this.map);
		},

		_addMarker: function(model) {
			new Insta.MapMarkerView({ cluster: this.markerClusterGroup, model : model});
		},

		_selectInstagram: function() {
			console.log('selected');
		}
	});

	Insta.MapMarkerView = Backbone.View.extend({

		// template: _.template( $('#personTemplate').html()),

		initialize: function(options){
			this.cluster = options.cluster;
			this.model = options.model;
			this.render();
		},

		render: function(){

			var self = this;
			var icon = new L.Icon({iconUrl: this.model.get('images').thumbnail.url});
			var marker = new L.Marker([this.model.get('location').latitude, this.model.get('location').longitude], { icon:  icon});

			marker.caption = this.model.get('caption').text;
			marker.link = this.model.get('link');
			marker.image = this.model.get('images').thumbnail.url;
			marker.image_big = this.model.get('images').standard_resolution.url;
			marker.id = this.model.get('id');

			// Pre-Load image
			$.ajax({
				url: marker.image,
				type: 'GET',
				crossDomain: true
			}).done(function (data) {
				self.cluster.addLayer(marker);
			});
		}
	});

	Insta.MapDetailView = Backbone.View.extend({

		template: '<a href="{link}" target="_blank" title="View on Instagram"><img src="{image_big}"/></a><p>{caption}</a></p>',

		initialize: function(options) {
			this.instagram = options.instagram;
			this.render();
		},

		render: function() {
			this.instagram.bindPopup(L.Util.template(this.template, this.instagram), { className: 'leaflet-popup-instagram', offset: new L.Point(40, -440), autoPanPadding: [200, -400], closeOnClick: true, keepInView: true}).openPopup();
		}
	});

})();
