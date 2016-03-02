if (Meteor.isClient) {

  Template.tournament_menu.helpers({
    noMatch: function() {
      return this.leaderBoardId === 'nomatch';
    }
  });
}


  Router.route('tournament_menu', {
  path: '/tournament_menu/:_id',
  layoutTemplate: 'appBody',
  template: 'tournament_menu',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    if (Meteor.user().username === 'admin') {
      Router.go('/tournaments/'); 
    }
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
    return [ Meteor.subscribe('tournamentsByTourid', this.params._id) ];
    
  },
  action : function () {
    this.render();
  },
  
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});
