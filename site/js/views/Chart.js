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
    initialize: function(){
        this.model.on('change',this.createLineGraph(this.model),this);
    },
    template: _.template($('#graph-template').html()),
    render: function () {
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
        return this.$el.html();
    },
    createLineGraph: function (model) {
        var canvasId = model.get('canvasId');
        if(expensesLineChart) {
            expensesLineChart.destroy();
        }
        if($('#' + canvasId).length) {
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
    }
});