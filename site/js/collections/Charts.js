App = App || {
        Models: {},
        Views: {},
        Router: {},
        Collections: {}
    };

var charts = [] ;
charts['expenseGraph'] = new App.Models.Chart({backgroundColor: 'red lighten-2', title: "Expenses per day", canvasId: 'expensesPerDay'});
charts['expenses'] = new App.Models.Chart({backgroundColor: 'blue lighten-2', title: "Expenses per category", canvasId: 'expensesPerCategory', legendClass: 'expenses-legend'});
charts['incomes'] = new App.Models.Chart({backgroundColor: 'green lighten-2', title: "Incomes per category", canvasId: 'incomesPerCategory', legendClass: 'incomes-legend'});

App.Collections.Charts =  Backbone.Collection.extend({
    model: App.Models.Chart,
});

