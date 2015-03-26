/*global InstagramRealTimeMap, $, io, google*/


window.InstagramRealTimeMap = {
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

	InstagramRealTimeMap.init();

	var self = this;


	//
	// Socket.io
	 var socket = io.connect();

	socket.on('initialAdd', function(data){
		jQuery.each(data.initialAdd, function() {
			self.add(this);
		});
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
		if(instagram.type === 'image' && instagram.location) {

console.log(instagram);
			console.log(instagram);
			InstagramRealTimeMap.Collections.instagrams.add(instagram);
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
			   styles: [{featureType:'administrative',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'landscape.natural',stylers:[{hue:'#0000ff'},{lightness:-84},{visibility:'off'}]},{featureType:'water',stylers:[{visibility:'on'},{saturation:-61},{lightness:-63}]},{featureType:'poi',stylers:[{visibility:'off'}]},{featureType:'road',stylers:[{visibility:'off'}]},{featureType:'administrative',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'landscape',stylers:[{visibility:'off'}]},{featureType:'administrative',stylers:[{visibility:'off'}]},{},{}]

		   };

			// Add the Google Map to the page
			var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions); // jshint ignore:line

			// Bind an event to add tweets from the collection

			this.collection.bind('add', function(model) {
				// console.log('New Model added');
				// console.log(model);

				// Stores the tweet's location
				var position = new google.maps.LatLng( model.get('location').latitude, model.get('location').longitude); // jshint ignore:line

				// Creates the marker

				var image = {
				    url: model.get('images').thumbnail.url,
				    scaledSize: new google.maps.Size(80, 80),
				    origin: new google.maps.Point(null,null),
				    anchor: new google.maps.Point(0, 0)
				   };

				/* jshint ignore:start */
				var marker = new google.maps.Marker({
					position: position,
					map: map,
					icon: image,
					title: model.get('attributes.caption'),
					description: model.get('attributes.caption')
				});
				/* jshint ignore:end */

				// console.log(marker);
		   });
		}
	}); //-- End of Map view

	//
	// Initialize

	InstagramRealTimeMap.Collections.instagrams = new Instagrams({
	   model: Instagram
	});

	// Create the Map view, binding it to the tweets collection
	InstagramRealTimeMap.Views.twitterMap = new Map({
		collection: InstagramRealTimeMap.Collections.instagrams
	});

 });
