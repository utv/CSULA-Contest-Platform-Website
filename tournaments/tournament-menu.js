if (Meteor.isClient) {

  Template.tournament_menu.helpers({
    // noMatch: function() {
    //   return this.leaderBoardId === 'nomatch';
    // }
  });
}


  Router.route('tournament_menu', {
  path: '/tournament_menu/:_tourid',
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
      var tourID = new Meteor.Collection.ObjectID(this.params._tourid);
      var player = Players.findOne({tournament_tourid: tourID, username: Meteor.user().username});
      if (player === undefined) {
        Router.go('/join/' + this.params._tourid); 
      }

      this.next();
    }
  },
  waitOn:function(){
    return [ 
      Meteor.subscribe('players'),
      Meteor.subscribe('tournament', new Meteor.Collection.ObjectID(this.params._tourid))
    ];
    
  },
  action : function () {
    this.render();
  },
  
  data: function () {
    return {
      tournament: Tournaments.findOne(new Meteor.Collection.ObjectID(this.params._tourid))
    };
  }
});
