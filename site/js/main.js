App = App || {
        Models: {},
        Views: {},
        Collections: {}
    };

var INCOME = 1, EXPENSE = 2;


var router = new (App.Router.AppRouter = Backbone.Router.extend({
    routes: {
        "today": "getTodayTransactions",
        "incomes": "getIncomes",
        "expenses": "getExpenses",
        "stats/incomes": "showIncomesStats",
        "stats/expenses": "showExpensesStats",
        "category/:category": "showCategory",
        "": "index"
    },
    initialize: function () {
        $('body').on("click", "a:not([data-bypass])", function (evt) {
            var href = {prop: $(this).prop("href"), attr: $(this).attr("href")};
            var root = location.protocol + "//" + location.host + Backbone.history.options.root;

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                Backbone.history.navigate(href.attr, true);
            }
        });
        $(".button-collapse").sideNav();
        appView = new App.Views.AppView({el: "main > .container"});
    },
    index: function () {
        entriesList.transactions.fetch({
            success: function () {
                var i = 0;
                if(!entriesList.$el.find('tbody').length) {
                    appView.$el.find('#content').html('');
                    var dashboardTemplate = _.template($('#dashboard-template').html());
                    appView.$el.find('#content').html(dashboardTemplate());
                }
                appView.$el.find('tbody').html('');
                appView.$el.find('#table-title').html('Last 10 transactions');
                entriesList.transactions.some(function (model) {
                    i++;
                    var view = new App.Views.Entry({model: model});
                    appView.$el.find('#transactions-wrapper tbody').append(view.render().el);
                    if (i == 10) return true;
                });
                if (appView.$el.find('canvas#expensesPerDay').attr('id') != 'expensesPerDay') {
                    appView.makeExpensesByDayChart();
                }
                $('.tooltipped').tooltip({delay: 50});
            }
        });
    },
    getIncomes: function () {
        appView.$el.find('tbody').html('');
        appView.$el.find('#table-title').html('Incomes');
        entriesList.transactions.each(function (model) {
            if (model.get('type') == INCOME) {
                var view = new App.Views.Entry({model: model});
                appView.$el.find('#transactions-wrapper tbody').append(view.render().el);
            }
        });
    },
    getExpenses: function () {
        appView.$el.find('tbody').html('');
        appView.$el.find('#table-title').html('Expenses');
        entriesList.transactions.each(function (model) {
            if (model.get('type') == EXPENSE) {
                var view = new App.Views.Entry({model: model});
                appView.$el.find('#transactions-wrapper tbody').append(view.render().el);
            }
        });
    },
    showCategory: function (category) {
        appView.$el.find('tbody').html('');
        appView.$el.find('#table-title').html('Category: ' + category);
        entriesList.transactions.each(function (model) {
            if (model.get('category') == category) {
                var view = new App.Views.Entry({model: model});
                appView.$el.find('#transactions-wrapper tbody').append(view.render().el);
            }
        });
    },
    getTodayTransactions: function () {
        entriesList.$el.html('');
        var today = moment().format('DD.MM.YYYY');
        entriesList.transactions.each(function (model) {
            var date = model.get('date');
            if (date == today) {
                if (model.get('type') == INCOME) {
                    model.set('className', 'income');
                    var view = new App.Views.Entry({model: model});
                    entriesList.$el.append(view.render().el);
                } else if (model.get('type') == EXPENSE) {
                    model.set('className', 'expense');
                    var view = new App.Views.Entry({model: model});
                    entriesList.$el.append(view.render().el);
                }
            }
        });
    },
    showIncomesStats: function () {
        var incomesChart = new App.Views.Chart({model: charts['incomes']});
        var content = incomesChart.render();
        incomesChart.statsTemplateWrapper(content);
        incomesChart.createIncomePieChart(charts['incomes']);
    },
    showExpensesStats: function() {
        var expensesChart = new App.Views.Chart({model: charts['expenses']});
        var content = expensesChart.render();
        expensesChart.statsTemplateWrapper(content);
        expensesChart.createExpensePieChart(charts['expenses']);

    }
}));

Backbone.history.start();