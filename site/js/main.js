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
        appView = new App.Views.AppView({el: "main"});
    },
    index: function () {
        entriesList.transactions.fetch({
            success: function(colllection,response,options) {
                entriesList.$el.html('');
                entriesList.transactions.each(function (model) {
                    var view = new App.Views.Entry({model: model});
                    entriesList.$el.append(view.render().el);
                });
                $('.tooltipped').tooltip({delay:50});
            }
        });

    },
    getIncomes: function () {
        entriesList.$el.html('');
        entriesList.transactions.each(function (model) {
            if (model.get('type') == 1) {
                var view = new App.Views.Entry({model: model});
                entriesList.$el.append(view.render().el);
            }
        });
    },
    getExpenses: function () {
        entriesList.$el.html('');
        entriesList.transactions.each(function (model) {
            if (model.get('type') == 2) {
                var view = new App.Views.Entry({model: model});
                entriesList.$el.append(view.render().el);
            }
        });
    },
    showCategory: function(category) {
        entriesList.$el.html('');
        entriesList.transactions.each(function(model) {
            if(model.get('category') == category) {
                var view = new App.Views.Entry({model: model});
                entriesList.$el.append(view.render().el);
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
        entriesList.$el.html('');
        var data = [];
        var incomeCategories = {}, expenseCategories = {}, i = 0, j = 0;
        entriesList.transactions.each(function (model) {
            var category = model.get('category');
            var value = model.get('value');
            if (model.get('type') == INCOME) {
                if (!incomeCategories.hasOwnProperty(category)) {
                    incomeCategories[category] = 0;
                    incomeCategories[category] += parseInt(value);
                } else {
                    incomeCategories[category] += parseInt(value);
                }
            } else if (model.get('type') == EXPENSE) {
                if (!expenseCategories.hasOwnProperty(category)) {
                    expenseCategories[category] = 0;
                    expenseCategories[category] += parseInt(value);
                } else {
                    expenseCategories[category] += parseInt(value);
                }
            }
        });
        entriesList.$el.append('<label for="incomeChart">Incomes<br/><canvas id="incomeChart" wdith="400" height="400"></canvas></label>');
        entriesList.$el.append('<label for="expenseChart">Expenses<br/><canvas id="expenseChart" wdith="400" height="400"></canvas></label>');
        entriesList.$el.append('<canvas id="radar" width="400" height="400"></canvas>');
        var incomeCtx = $('#incomeChart').get(0).getContext("2d");
        var expenseCtx = $('#expenseChart').get(0).getContext("2d");
        var radarCtx = $('#radar').get(0).getContext("2d");
        var incomeData = {}, expenseData = {};
        var pallette = ['blue', 'green', 'red', 'purple', 'pink', 'orange'];
        var colorPallette = pallette[Math.floor(Math.random() * 5) + 1];
        var incomeData
        $.map(incomeCategories, function (value, key) {
            incomeData[i] = {
                value: value,
                color: getRandomColor(colorPallette),
                label: key
            };

            i++;
        });
        colorPallette = pallette[Math.floor(Math.random() * 5) + 1];
        $.map(expenseCategories, function (value, key) {
            expenseData[i] = {
                value: value,
                color: getRandomColor(colorPallette),
                label: key
            };
            i++;
        });
        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novomber", "December"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81, 56, 55, 40,25,23,51,52,65]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        var incomeChart = new Chart(incomeCtx).Doughnut(incomeData);
        var expenseChart = new Chart(expenseCtx).Pie(expenseData);
        var radarChart = new Chart(radarCtx).Line(data);
    }
}));

Backbone.history.start();

function getRandomColor(pallette) {
    return randomColor({
        luminosity: 'bright'
    });
}
