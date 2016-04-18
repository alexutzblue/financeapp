App = App || {
    Models: {},
    Views: {},
    Router: {},
    Collections: {}
};

//APP VIEW
App.Views.AppView = Backbone.View.extend({
    initialize: function () {
        entriesList = new App.Views.EntriesList({el: '#transactions'});
        categories = new App.Collections.Categories();
        categories.fetch();
        this.budget = $('h2#budget span');
    },
    events: {
        "click #showIncomeModal": "showModal",
        "click #showExpenseModal": "showModal",
        "click #showCategoryModal" : "showModal",
        "click #addIncome": "addEntry",
        "click #addExpense": "addEntry",
        "click #addCategory": "addNewCategory"
    },
    showModal: function (event) {
        var modal;
        if(event.currentTarget.id == "showCategoryModal") {
            modal = _.template($('#category-modal').html());
            this.$el.append(modal());
            $('#category-modal').openModal({
               complete: function(){
                   $('#category-modal').remove();
               }
            });
            $('select#category-type, select#color').material_select();
        }else {
            modal = _.template($('#modal-template').html());
            if (event.currentTarget.id == 'showIncomeModal') {
                var incomeCategories = categories.where({type: 1});
                this.$el.append(modal({type: 'income', categories: incomeCategories}));
            } else {
                var expensesCategories = categories.where({type: 2});
                this.$el.append(modal({type: 'expense', categories: expensesCategories}));
            }
            $('#modal').openModal({
                complete: function () {
                    $('#modal').remove();
                }
            });
            $('select#category').material_select();
            $('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 15,
                container: 'main',
                format: 'dd-mm-yyyy'
            });
        }
    },
    addEntry: function (event) {
        var name = $('#modal input#name').val();
        var value = $('#modal input#value').val();
        var category = $('#modal select#category').val();
        var date = $('#modal input#date').val();
        if (event.currentTarget.id == 'addIncome') {
            var model = new App.Models.Entry({className: 'income', name: name, value: value, category: category, type: 1, date: date});
        } else if (event.currentTarget.id == 'addExpense') {
            var model = new App.Models.Entry({clasName: 'expense', name: name, value: value, category: category, type: 2, date: date});
        }
        entriesList.transactions.add(model);
        this.budget.html(entriesList.getBudget());
        model.save();
    },
    addNewCategory: function(){
        var name,type,color,categoryModel;
        name = $('#category-modal input#category').val();
        type = $('#category-modal select#category-type').val();
        color = $('#category-modal select#color').val();
        console.log(type);
        categoryModel = new App.Models.Category({name: name, type: type, color: color});
        categories.add(categoryModel);
        categoryModel.save();
        categories.fetch();
    }
});
