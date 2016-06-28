
if (Meteor.isClient) {
  Template.show_tournament.helpers({
    gameDescription: function() {
      return Games.findOne(new Meteor.Collection.ObjectID(this.tournament.gameid._str)).description;
    }
  });
  
}

Router.route('show_tournament', {
  path: '/show_tournament/:_tourid/:gameid',
  name: 'show_tournament',
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
      var tourID = new Meteor.Collection.ObjectID(this.params._tourid);
      var player = Players.findOne({tournament_id: tourID, username: Meteor.user().username});
      if (player === undefined) Router.go('/join/' + this.params._tourid);
      else this.next();
    }
  },
  waitOn:function(){
    return [ 
      Meteor.subscribe('tournament', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('matches', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('players'),
      Meteor.subscribe('game', new Meteor.Collection.ObjectID(this.params.gameid))
    ];
    
  },
  action: function() {
    this.render();
  },
  
  data: function () {
    return {
      tournament: Tournaments.findOne(new Meteor.Collection.ObjectID(this.params._tourid))
    };
  }
});