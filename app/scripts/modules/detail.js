// app.Views.detail = DetailView;

var DetailView = Backbone.View.extend({

	tagName: 'section',
	className: 'detail',

	render: function(instagramId) {
		// console.log(instagramId);
		// this.$el.html(this.model.get('caption').text);
		// this.$el.toggleClass('selected', this.model.get('selected'));
	 //    return this; // allows to chain othr method calls on render()
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


// routes: {
// 	'detail/:id': 'showDetail'
// },

// showDetail: function(id) {
// 	console.log('Route: Detail');
// 	window.App.Views.detail.render(id);
// },
