App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

// BASIC ENTRY MODEL
App.Models.Entry = Backbone.Model.extend({
    defaults: {
        type: "",
        name: "standard entry",
        value: "0",
        category: "default category",
        date: '',
        id: ''
    }
});