    App = App || {
	        Models: {},
	        Views: {},
	        Router: {},
	        Collections: {}
	      };

  //ENTRIES LIST VIEW
  App.Views.EntriesList = Backbone.View.extend({
    initialize:function(){
      var _thisView = this;
      this.budget = 0;
      this.incomesCollection = new App.Collections.Incomes();
      this.expensesCollection = new App.Collections.Expenses();
      this.incomesCollection.fetch({success: function(collection){
        collection.each(function(model){
          _thisView.budget = _thisView.budget + Number(model.get('value'));
        });
      }});
      this.expensesCollection.fetch({success: function(collection){
        collection.each(function(model){
          _thisView.budget = _thisView.budget - Number(model.get('value'));
        });
        $('#budget span').html(_thisView.budget);
      }});
      this.incomesCollection.on("add", this.addOne,this);
      this.expensesCollection.on("add", this.addOne,this);
    }, 
    events: {

    },
    addOne: function(model){
      var type = model.get('type');
      var date = model.get('added');
      if(date) {
        model.set('date',date);
      }
      if(type == '1') {
        var view = new App.Views.Income({model:model});
      }else {
        var view = new App.Views.Expense({model:model});
      }
      this.$el.append(view.render().el);
    },
    getBudget: function(){
      return this.budget;
    }
  });
