App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

App.Collections.Expenses = Backbone.Collection.extend({
    url: '/api/expenses',
    model: App.Models.Expense
});