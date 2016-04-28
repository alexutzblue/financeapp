var App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

// BASIC ENTRY VIEW
App.Views.Entry = Backbone.View.extend({
    tagName: "tr",
    className: "",
    events: {
        'click #delete': "remove",
        'click #edit': "showEditModal"
    },
    template: _.template($('#entry-template').html()),
    initialize: function () {
        this.model.on('hide', this.remove, this);
        this.model.on("change", this.render, this);
        $('#delete-modal #yesBtn').on("click",function(){
            $(this).data('clicked',true);
        });
    },
    render: function (event) {
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
        return this;
    },
    remove: function () {
        var _this = this;
        $('#delete-modal').openModal({
            complete: function(){
                if($('#delete-modal #yesBtn').data('clicked')) {
                    _this.model.destroy();
                    Materialize.toast("Entry has been deleted!",2000);
                    _this.$el.remove();
                    expenseChartView = new App.Views.Chart({model:charts['expenseGraph']});
                    expenseChartView.model.trigger('change');
                }
                $('#delete-modal #yesBtn').data('clicked',false);
            }
        });
    },
    showEditModal: function (event) {
        var modal = _.template($('#modal-template').html());
        var categories = new App.Collections.Categories();
        categories.fetch({async: false});
        if (this.model.get('type') == '1') {
            var categoriesList = categories.where({type: 1});
        } else {
            var categoriesList = categories.where({type: 2});
        }
        appView.$el.append(modal({type: 'edit', categories: categoriesList}));
        $('input#name').val(this.model.get('name'));
        $('input#value').val(this.model.get('value'));
        $('select#category').val(this.model.get('category_id'));
        $('input#date').val(this.model.get('date'));
        $('#modal').openModal({
            complete: function(){
                $('#modal').remove();
            }
        });
        $('select#category').material_select();
        $('.datepicker').pickadate({
            selectMonths: true,
            selectYears: 15,
            container: 'main'
        });
        $('#editEntry').click({model: this.model}, this.updateEntry);
    },
    updateEntry: function (event) {
        var name = $('input#name').val();
        var value = $('input#value').val();
        var category_id = $('select#category').val();
        var category_name = $('select#category option:selected').text();
        category_name = category_name.trim().replace(/(\r\n|\n|\r)/gm,"");
        var category = categories.where({name: category_name});
        var color = _.where(colors,{id: category[0].get('color_id')});
        var date = $('input#date').val();
        console.log(event.data.model.preValidate({name: name, value: value}));
        event.data.model.set({name: name, value: value, category_id: category_id, categoryColor: color[0]['color_name'], category: category_name, date: date},{wait:true});
        event.data.model.save();
        expenseChartView = new App.Views.Chart({model:charts['expenseGraph']});
        expenseChartView.model.trigger('change');
    }
});
