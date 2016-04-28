App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

//ENTRIES LIST VIEW
App.Views.EntriesList = Backbone.View.extend({
    initialize: function () {
        this.budget = 0;
        _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
        this.transactions = new App.Collections.Transactions();
        Backbone.Validation.bind(this, {
            collection: this.transactions,
            valid: function(view, attr, selector){
                console.log('valid');
            },
            invalid: function(view, attr, error, selector){
                console.log(view);
                console.log(attr);
            }
        });
        this.transactions.on("add", this.addOne, this);
        this.transactions.on("destroy", this.getBudget, this);
    },
    events: {
    },
    addOne: function (model) {
        var type = model.get('type');
        var date = model.get('added');
        if (date) {
            model.set('date', date);
        }
        if (type == 1) {
            model.set('className','income');
            var view = new App.Views.Entry({model: model});
        } else if(type == 2){
            model.set('className','expense');
            var view = new App.Views.Entry({model: model});
        }
        appView.$el.find('#transactions-wrapper tbody').append(view.render().el);
    },
    getBudget: function () {
        this.budget = 0;
        var _thisView = this;
        this.transactions.each(function (model) {
            _thisView.budget = _thisView.budget + Number(model.get('value'));
        });
        return this.budget;
    }
});
