
if (Meteor.isClient) {

  Template.leader_board.helpers({
    isThereMatchPlayed: function () {
      if (this.players !== undefined) 
        return true;
      return false;
    },

    ranks: function () {
      return this.players.map(function (doc, rank) {
        doc.rank = rank + 1;
        doc.rating = doc.rating.toFixed(2);
        return doc;
      });
    },

  });
}

Router.route('leader_board', {
  path: '/leader_board/:_tourid',
  name: 'leader_board',
  layoutTemplate: 'appBody',
  template: 'leader_board',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    
    if (Meteor.user().username !== 'admin') {
      // check if a current user already joined this tournament.
      var tourID = new Meteor.Collection.ObjectID(this.params._tourid);
      var player = Players.findOne({tournament_id: tourID, username: Meteor.user().username});
      if (player === undefined) {
        Router.go('/join/' + this.params._tourid); 
      }
    }

    this.next();
  },
  waitOn:function(){
    return [
      Meteor.subscribe('tournament', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('matches', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('players'),
      Meteor.subscribe('games')
    ];
    
  },
  action : function () {
    this.render();
  },
  data: function () {
    return {
      tournament: Tournaments.findOne(new Meteor.Collection.ObjectID(this.params._tourid)),
      players: Players.find({tournament_id: new Meteor.Collection.ObjectID(this.params._tourid)}, {sort: {rating: -1}})
    };
  }

});