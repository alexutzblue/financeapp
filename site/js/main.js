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
        "stats": "showStats",
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
                entriesList.$el.find('tbody').html('');
                entriesList.$el.find('#table-title').html('Last 10 transactions');
                entriesList.transactions.some(function (model) {
                    i++;
                    var view = new App.Views.Entry({model: model});
                    entriesList.$el.find('#transactions-wrapper tbody').append(view.render().el);
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
        entriesList.$el.find('tbody').html('');
        entriesList.$el.find('#table-title').html('Incomes');
        entriesList.transactions.each(function (model) {
            if (model.get('type') == INCOME) {
                var view = new App.Views.Entry({model: model});
                entriesList.$el.find('#transactions-wrapper tbody').append(view.render().el);
            }
        });
    },
    getExpenses: function () {
        entriesList.$el.find('tbody').html('');
        entriesList.$el.find('#table-title').html('Expenses');
        entriesList.transactions.each(function (model) {
            if (model.get('type') == EXPENSE) {
                var view = new App.Views.Entry({model: model});
                entriesList.$el.find('#transactions-wrapper tbody').append(view.render().el);
            }
        });
    },
    showCategory: function (category) {
        entriesList.$el.find('tbody').html('');
        entriesList.$el.find('#table-title').html('Category: ' + category);
        entriesList.transactions.each(function (model) {
            if (model.get('category') == category) {
                var view = new App.Views.Entry({model: model});
                entriesList.$el.find('#transactions-wrapper tbody').append(view.render().el);
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
    showStats: function () {
        appView.$el.html('');
        appView.$el.append('<div class="card"><div class="card-title"></div><div class="card-content"></div></div>');
        var incomeCategories = {}, expenseCategories = {}, i = 0;
        entriesList.transactions.each(function (model) {
            var category = model.get('category');
            var value = model.get('value');
            if (model.get('type') == INCOME) {
                if (!incomeCategories.hasOwnProperty(category)) {
                    incomeCategories[category] = {};
                    incomeCategories[category]['value'] = 0;
                    incomeCategories[category]['color'] = model.get('categoryColor');
                    incomeCategories[category]['value'] += parseInt(value);
                } else {
                    incomeCategories[category]['value'] += parseInt(value);
                }
            } else if (model.get('type') == EXPENSE) {
                if (!expenseCategories.hasOwnProperty(category)) {
                    expenseCategories[category] = {};
                    expenseCategories[category]['value'] = 0;
                    expenseCategories[category]['color'] = model.get('categoryColor');
                    expenseCategories[category]['value'] += parseInt(value);
                } else {
                    expenseCategories[category]['value'] += parseInt(value);
                }
            }
        });
        var incomesChart = new App.Views.Chart({model: charts['incomes']});
        var expensesChart = new App.Views.Chart({model: charts['expenses']});
        appView.$el.find('.card:first > .card-content').append(incomesChart.render());
        appView.$el.find('.card:first > .card-content').append(expensesChart.render());
        var incomeCtx = $('#' + incomesChart.model.get('canvasId')).get(0).getContext("2d");
        var expenseCtx = $('#' + expensesChart.model.get('canvasId')).get(0).getContext("2d");
        var incomeData = {}, expenseData = {};

        $.map(incomeCategories, function (value, key) {
            incomeData[i] = {
                value: value['value'],
                color: value['color'],
                label: key
            };

            i++;
        });
        $.map(expenseCategories, function (value, key) {
            expenseData[i] = {
                value: value['value'],
                color: value['color'],
                label: key
            };
            i++;
        });

        var incomeChart = new Chart(incomeCtx).Doughnut(incomeData);
        $('.' + incomesChart.model.get('legendClass')).html(incomeChart.generateLegend());
        var expenseChart = new Chart(expenseCtx).Pie(expenseData);
    }
}));

Backbone.history.start();