var App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

// BASIC ENTRY VIEW
App.Views.Entry = Backbone.View.extend({
    tagName: "li",
    className: "collection-item",
    events: {
        'click #delete': "remove",
        'click #edit': "showEditModal"
    },
    template: _.template($('#entry-template').html()),
    initialize: function () {
        this.model.on('hide', this.remove, this);
        this.model.on("change", this.render, this);
    },
    render: function (event) {
        var attributes = this.model.toJSON();
        //this.el = this.template(attributes);
        this.$el.html(this.template(attributes));
        if (event) {
            this.model.save();
        }
        return this;
    },
    remove: function () {
        var entryView = this;
        $('#delete-modal').openModal();
        if( 1 == 0) {
            entryView.model.destroy();
            entryView.$el.remove();
            return entryView;
        }
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
        $('input[name="name"]').val(this.model.get('name'));
        $('input[name="value"]').val(this.model.get('value'));
        $('select[name="category"]').val(this.model.get('category'));
        $('input[name="date"]').val(this.model.get('date'));
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
        var name = $('input[name="name"]').val();
        var value = $('input[name="value"]').val();
        var category = $('select[name="category"]').val();
        var date = $('input[name="date"]').val();
        event.data.model.set({name: name, value: value, category: category, date: date});
    }
});
