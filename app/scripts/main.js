/*global AbbInside, $*/


window.AbbInside = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	init: function () {
		'use strict';
		console.log('Hello from Backbone!');
	}
};

$(document).ready(function () {
	'use strict';

	AbbInside.init();

	var self = this;


	//
	// Socket.io
	 var socket = io.connect();

	socket.on('initialAdd', function(data){
		jQuery.each(data.initialAdd, function() {
			self.add(this);
		})
	});

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

	this.add = function(instagram) {
		if(instagram.type == 'image' && instagram.location) {

			console.log(instagram);
			AbbInside.Collections.instagrams.add(instagram);
		}
	};


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

			// Roughly the center of the United States
			var latlng = new google.maps.LatLng(35.5, -100);

			// Google Maps Options
			var myOptions = {
			   zoom: 5,
			   center: latlng,
			   mapTypeControl: false,
			   navigationControlOptions: {
				   style: google.maps.NavigationControlStyle.ANDROID
			   },
			   mapTypeId: google.maps.MapTypeId.ROADMAP,
			   streetViewControl: false,
			   styles: [{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape.natural",stylers:[{hue:"#0000ff"},{lightness:-84},{visibility:"off"}]},{featureType:"water",stylers:[{visibility:"on"},{saturation:-61},{lightness:-63}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"road",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape",stylers:[{visibility:"off"}]},{featureType:"administrative",stylers:[{visibility:"off"}]},{},{}]

		   };

			// Force the height of the map to fit the window
			this.$el.height($(window).height() - $("header").height());

			// Add the Google Map to the page
			var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

			// Bind an event to add tweets from the collection

			this.collection.bind('add', function(model) {
				// console.log('New Model added');
				// console.log(model);

				// Stores the tweet's location
				var position = new google.maps.LatLng( model.get('location').latitude, model.get('location').longitude);

				// Creates the marker
				// Uncomment the 'icon' property to enable sexy markers. Get the icon Github repo:
				// https://github.com/nhunzaker/twittermap/tree/master/images
				var marker = new google.maps.Marker({
					position: position,
					map: map,
					title: model.get('attributes.caption'),
					description: model.get('attributes.caption')
				});

				// console.log(marker);
		   });
		}
	}); //-- End of Map view

	//
	// Initialize

	AbbInside.Collections.instagrams = new Instagrams({
	   model: Instagram
	});

	// Create the Map view, binding it to the tweets collection
	AbbInside.Views.twitter_map = new Map({
		collection: AbbInside.Collections.instagrams
	});

 });
