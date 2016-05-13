var App = App || {
        Models: {},
        Views: {},
        Collections: {},
        Templates: {}
    };

App.Views.Login = Backbone.View.extend({
    className: "",
    events: {
        "click #submit": "submit"
    },
    template: _.template($('#login-template').html()),
    initialize: function(){
        $('body').html(this.render().$el);
    },
    render: function() {
        var html = this.template();
        this.$el.html(html);
        return this;
    },
    submit: function(e){
        e.preventDefault();
        var data = [];
        data['email'] = $('#email').val();
        data['password'] = $('#password').val();
        $.ajax({
            url: "login",
            type: "post",
            data: { email: data['email'], password: data['password']},
            success: function(result){
                console.log(result);
            }
        });
    }
});

var login = new App.Views.Login();