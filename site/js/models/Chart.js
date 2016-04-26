App = App || {
        Models: {},
        Views: {},
        Router: {},
        Collections: {}
};

App.Models.Chart = Backbone.Model.extend({
    defaults: {
        backgroundColor: "",
        title: "",
        canvasId: "",
        legendClass: ""
    }
});