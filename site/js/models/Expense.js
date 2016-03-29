App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

App.Models.Expense = App.Models.Entry.extend({
    defaults: {
        type: 'expense',
        name: "standard expense",
        value: "0",
        category: "default category",
        date: ''
    }
});