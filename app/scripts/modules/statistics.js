/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.StatisticsModel = Backbone.Model.extend({
		defaults: {
			total_candidates: 0,
			total_added: 0,
			last_update: 0
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

		updateAdded: function(ev) {
			var current = this.statisticsModel.get('total_added');
			this.statisticsModel.set('total_added', current + 1);
		},

		updateCandidates: function(ev) {
			var current = this.statisticsModel.get('total_candidates');
			this.statisticsModel.set('total_candidates', current + ev.length);
		},

		render: function() {
			this.$el.html(this.template(this.statisticsModel.toJSON()));
			return this;
		}
	});

})();
