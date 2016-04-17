App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

App.Collections.Transactions = Backbone.Collection.extend({
    url: '/api/transactions',
    model: App.Models.Entry
});