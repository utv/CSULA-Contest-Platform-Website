
if (Meteor.isClient) {

  
}

Router.route('show_tournament', {
  path: '/tournament/:_id',
  layoutTemplate: 'appBody',
  template: 'show_tournament',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    
    if (Meteor.user().username === 'admin') 
      this.next();
    else {
      // check if a current user already joined this tournament.
      var tournament = Tournaments.findOne(this.params._id);
      var isJoined = _.some(tournament.users, function(aUser) {
        return aUser.username == Meteor.user().username; 
      });

      if (!isJoined) Router.go('/join/' + this.params._id); 
      else this.next();  
    }
  },
  waitOn:function(){
    return [ Meteor.subscribe('tournaments') ];
  },
  action: function() {
    this.render();
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});