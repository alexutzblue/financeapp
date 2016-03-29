
      App = App || {
        Models: {},
        Views: {},
        Router: {},
        Collections: {}
      };

      //APP VIEW
      App.Views.AppView = Backbone.View.extend({
        initialize: function(){
          entriesList = new App.Views.EntriesList({el: '#transactions'});
          console.log(entriesList.getBudget());
          categories = new App.Collections.Categories();
          categories.fetch();
        },
        events:{
          "click #showIncomeModal": "showModal",
          "click #showExpenseModal": "showModal",
          "click #addIncome": "addEntry",
          "click #addExpense": "addEntry"
        },
        showModal: function(event){
          var modal = _.template($('#modal-template').html());
          if(event.currentTarget.id == 'showIncomeModal'){
            var incomeCategories = categories.where({type: '1'});
            this.$el.append(modal({type:'income',categories: incomeCategories}));
          }else{
            var expensesCategories = categories.where({type: '2'});
            this.$el.append(modal({type:'expense',categories:expensesCategories}));
          }
          var modal = UIkit.modal("#modal");
          modal.show();
          $('#modal').on({
          'hide.uk.modal': function(){
            this.remove();
          }
        });
        },
        addEntry: function(event){
          var name = $('#modal input#name').val();
          var value = $('#modal input#value').val();
          var category = $('#modal select#category').val();
          var date = $('#modal input#date').val();
          if(event.currentTarget.id == 'addIncome') {
            var model = new App.Models.Income({className:'income',name: name,value: value, category: category, type: '1', date: date});
            entriesList.incomesCollection.add(model);
          }else if(event.currentTarget.id == 'addExpense') {
            var model = new App.Models.Expense({clasName:'expense',name: name,value: value, category: category,type: '2', date: date});
            entriesList.expensesCollection.add(model);
          }
          model.save();
        }
      });

      
     var appView = new App.Views.AppView({el: "#app"});