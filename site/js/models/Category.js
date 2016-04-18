App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
  };

App.Models.Category = Backbone.Model.extend({
	defaults: {
		name: 'default category',
		type: 0,
        color: ''
	}
});