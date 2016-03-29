App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

App.Router.AppRouter = Backbone.Router.extend({
    routes: {
        "today": "getTodayTransactions",
        "incomes": "getIncomes",
        "expenses": "getExpenses"
    },
    getIncomes: function () {
        entriesList.$el.html('');
        entriesList.incomesCollection.each(function (model) {
            var view = new App.Views.Income({model: model});
            entriesList.$el.append(view.render().el);
        });
    },
    getExpenses: function () {
        entriesList.$el.html('');
        entriesList.expensesCollection.each(function (model) {
            var view = new App.Views.Expense({model: model});
            entriesList.$el.append(view.render().el);
        });
    },
    getTodayTransactions: function(){
        entriesList.$el.html('');
        var today = moment().format('DD.MM.YYYY');
        entriesList.incomesCollection.each(function(model){
           var date = model.get('date');
           console.log(date);
           if(date == today) {
               var view = new App.Views.Income({model:model});
               entriesList.$el.append(view.render().el);
           }
        });
        entriesList.expensesCollection.each(function(model){
           var date = model.get('date');
           if(date == today) {
               var view = new App.Views.Expense({model:model});
               entriesList.$el.append(view.render().el);
           }
        });
        
    }
});
