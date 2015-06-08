/*global Backbone */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.StatisticsModel = Backbone.Model.extend({
		defaults: {
			totalCandidates: 0,
			totalAdded: 0,
			lastUpdate: 0
		}
	});

	Insta.StatisticsView = Backbone.View.extend({

		el: '#statistics-markup',

		template: _.template($('#statistics-template').html()),

		initialize: function(options) {
			_.bindAll(this, 'updateAdded');
			_.bindAll(this, 'updateCandidates');

			this.vent = options.vent;
			this.vent.on('socket:add', this.updateCandidates);

			this.collection = options.collection;
			this.listenTo(this.collection, 'add', this.updateAdded);

			this.statisticsModel = new Insta.StatisticsModel();
			this.listenTo(this.statisticsModel, 'change', this.render);

			this.render();
		},

		updateAdded: function() {
			var current = this.statisticsModel.get('total_added');
			this.statisticsModel.set('totalAdded', current + 1);
		},

		updateCandidates: function(ev) {
			var current = this.statisticsModel.get('totalCandidates');
			this.statisticsModel.set('totalCandidates', current + ev.length);
		},

		render: function() {
			this.$el.html(this.template(this.statisticsModel.toJSON()));
			return this;
		}
	});

})();
