/*global Backbone, L */
var Insta = Insta || {};

(function () {
	'use strict';

	Insta.DetailView = Backbone.View.extend({

		tagName: 'article',
		className: 'detail',

		template: '<p><%= caption.text %><hr></p>',



		initialize: function(options) {
			_.bindAll(this, 'render');
			console.log('init detail view');

			this.listenTo(this.model, 'change:selected', this.render);

		},

		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			this.$el.toggleClass('selected', this.model.get('selected'));
			return this;

		}

	});

})();
