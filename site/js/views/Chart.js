App = App || {
        Models: {},
        Views: {},
        Router: {},
        Collections: {}
    };

var expensesLineChart = null;
App.Views.Chart = Backbone.View.extend({
    tagName: 'div',
    className: 'card waves-effect waves-block waves-light',
    initialize: function () {
        this.model.on('change', this.createLineGraph(this.model), this);
    },
    template: _.template($('#graph-template').html()),
    render: function (width,height) {
        var attributes = this.model.toJSON();
        attributes['width'] = width;
        attributes['height'] = height;
        console.log(attributes);
        this.$el.html(this.template(attributes));
        return this.$el.html();
    },
    statsTemplateWrapper: function(content) {
        var statsTemplate = _.template($('#stats-template').html());
        appView.$el.find('#content').html('');
        appView.$el.find('#content').append(statsTemplate({content: content}));
    },
    createLineGraph: function (model) {
        var canvasId = model.get('canvasId');
        if (expensesLineChart) {
            expensesLineChart.destroy();
        }
        if ($('#' + canvasId).length) {
            lineCtx = $('#' + canvasId).get(0).getContext('2d');
            var i, lineCtx, data, day, expensesPerDay, date;
            expensesPerDay = {
                "Monday": 0,
                "Tuesday": 0,
                "Wednesday": 0,
                "Thursday": 0,
                "Friday": 0,
                "Saturday": 0,
                "Sunday": 0
            };
            entriesList.transactions.each(function (model) {
                if (model.get('type') == EXPENSE) {
                    date = model.get('date');
                    if (date) {
                        day = moment(date, "D-MMMM-YYYY").format('dddd');
                        expensesPerDay[day] += parseInt(model.get('value'));
                    }
                }
            });
            data = {
                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                datasets: [
                    {
                        label: "Expenses",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: []
                    }
                ]
            };
            i = 0;
            for (day in expensesPerDay) {
                data['datasets'][0]['data'][i] = expensesPerDay[day];
                i++;
            }
            expensesLineChart = new Chart(lineCtx).Line(data);
        }
    },
    createIncomePieChart: function (model) {
        var incomeCategories = {}, i = 0, incomeData = {};
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
            }
        });
        var incomeCtx = $('#' + model.get('canvasId')).get(0).getContext("2d");

        $.map(incomeCategories, function (value, key) {
            incomeData[i] = {
                value: value['value'],
                color: value['color'],
                label: key
            };
            i++;
        });

        var incomeChart = new Chart(incomeCtx).Doughnut(incomeData);
        $('.' + model.get('legendClass')).html(incomeChart.generateLegend());

    },
    createExpensePieChart: function (model) {
        var expenseCategories = {}, i = 0, expenseChart, expenseData = [];
        entriesList.transactions.each(function (model) {
            var category = model.get('category');
            var value = model.get('value');
            if (model.get('type') == EXPENSE) {
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
        var expenseCtx = $('#' + model.get('canvasId')).get(0).getContext("2d");
        $.map(expenseCategories, function (value, key) {
            expenseData[i] = {
                value: value['value'],
                color: value['color'],
                label: key
            };
            i++;
        });

        expenseChart = new Chart(expenseCtx).Pie(expenseData);
        $('.' + model.get('legendClass')).html(expenseChart.generateLegend());
    }
});