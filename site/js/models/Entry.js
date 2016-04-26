App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

// BASIC ENTRY MODEL
App.Models.Entry = Backbone.Model.extend({
    defaults: {
        className: "",
        type: "",
        name: "standard entry",
        value: "0",
        category: "default category",
        category_id: 0,
        categoryColor: '',
        date: ''
    }
});