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
			this.listenTo(this.collection, 'change:selected', this._selectMarker);

			this.map = this._createMap();
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

			var self = this;

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
					var iconUrl = marker.clusterImage;

					return new L.DivIcon({
						className: 'leaflet-cluster',
						html: '<img src="' + iconUrl + '"><b>' + cluster.getChildCount() + '</b>'
					});
				}
			})
			.on('click', function (ev) {
				var marker = ev.layer;
				self.collection._selectInstagram(marker);
			})
			.addTo(this.map);
		},

		_addMarker: function(model) {
			new Insta.MapMarkerView({ cluster: this.markerClusterGroup, model : model});
		},

		_selectMarker: function(model) {
			new Insta.MapDetailView({ model : model});
		}
	});

	///////////////////////////////////////////////////////////

	Insta.MapMarkerView = Backbone.View.extend({

		initialize: function(options){
			this.cluster = options.cluster;
			this.model = options.model;
			this.render();
		},

		render: function(){

			var self = this;
			var icon = new L.Icon({iconUrl: this.model.get('image')});
			var marker = new L.Marker([this.model.get('location').latitude, this.model.get('location').longitude], { icon:  icon});
			marker.id = this.model.get('id');
			marker.clusterImage = this.model.get('image');

			// Pre-Load image
			$.ajax({
				url: this.model.get('image'),
				type: 'GET',
				crossDomain: true
			}).done(function (data) {
				self.cluster.addLayer(marker);
			});
		}
	});

	///////////////////////////////////////////////////////////

	Insta.MapDetailView = Backbone.View.extend({

		template: '<a href="{url}" target="_blank" title="View on Instagram"><img src="{image}"/></a><p>{caption}</a></p>',

		initialize: function(options) {
			this.model = options.model;
			this.render();
		},

		render: function() {
			// console.log(this.model.toJSON());
			this.model.bindPopup(L.Util.template(this.template, this.model.toJSON()), { className: 'leaflet-popup-instagram', offset: new L.Point(40, -440), autoPanPadding: [200, -400], closeOnClick: true, keepInView: true}).openPopup();
		}
	});

})();
