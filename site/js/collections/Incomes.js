 App = App || {
        Models: {},
        Views: {},
        Router: {},
        Collections: {}
      };

  App.Collections.Incomes = Backbone.Collection.extend({
    url: '/api/incomes',
    model: App.Models.Income
  });