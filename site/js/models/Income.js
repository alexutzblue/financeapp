 App = App || {
        Models: {},
        Views: {},
        Router: {},
        Collections: {}
      };

  App.Models.Income = App.Models.Entry.extend({
    defaults: {
      type: 'income',
      name: "standard income",
      value: "0",
      category: "default category",
      date: ''
    }
  });