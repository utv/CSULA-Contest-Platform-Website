if (Meteor.isClient) {
  Template.join_tournament.rendered = function () {
    $('h2').hide(); // hide error massage
  }
    
  Template.join_tournament.events({
    'click .button': function (event) {
      event.preventDefault();
      var password = $('input[name=password]').val();
      var tournament = Tournaments.findOne(this._id);
      var userPassword = CryptoJS.SHA256(tournament.salt + password).toString();
      
      if (userPassword === tournament.hash) {
        Tournaments.update(
          { _id: this._id }, 
          { $push: {users: {username: Meteor.user().username}} }
        );

        Router.go('/tournament/' + this._id);
      } 
      else $('h2').show();
    }
  });
}

Router.route('join_tournament', {
  path: '/join/:_id',
  layoutTemplate: 'appBody',
  template: 'join_tournament',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    this.next();
  },
  waitOn:function(){
    return [ Meteor.subscribe('tournaments') ];
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});