
if (Meteor.isClient) {
  Session.set('number_of_match', 10);

  Template.matches.events({
    'click #load': function(event) {
      event.preventDefault();
      Session.set('number_of_match', Session.get('number_of_match') + 10);
    }
  });

  Template.matches.helpers({
    isThereMatchPlayed: function () {
      if (Session.get('isShowMyMatch')) {
        var playerCreatedAt = Players.findOne({tournament_id: this.tournament._id, username: Meteor.user().username}).createdAt;
        var my_match = Matches.findOne(
          { 
            tournament_id: this.tournament._id, 
            result: { "$elemMatch" : { "username" : Meteor.user().username} },
            createdAt: {$gt: playerCreatedAt}
          });
        if (my_match !== undefined) return true;
        return false;
      }

      var match = Matches.findOne({tournament_id: this.tournament._id});
      if (match !== undefined) return true;
      return false;
    },

    isShowMyMatch: function() {
      return  Session.get('isShowMyMatch');
    },

    latest_matches: function () {
      return Matches.find({ tournament_id: this.tournament._id }, { sort: {_id: -1}, limit: Session.get('number_of_match') });
    },

    my_latest_matches: function () {
      var playerCreatedAt = 
        Players.findOne({tournament_id: this.tournament._id, username: Meteor.user().username}).createdAt;
      
      return Matches.find(
        { 
          tournament_id: this.tournament._id, 
          result: { "$elemMatch" : { "username" : Meteor.user().username} },
          createdAt: {$gt: playerCreatedAt}
        }, 
        { sort: {_id: -1}, limit: Session.get('number_of_match') });
    },

    toDate: function (time) {
      return new Date(time);
    }

  });
}

Router.route('matches', {
  path: '/matches/:_tourid',
  layoutTemplate: 'appBody',
  template: 'matches',
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

    Session.set('number_of_match', 10);
    Session.set('isShowMyMatch', this.params.query.q === 'my_match');
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
      tournament: Tournaments.findOne(new Meteor.Collection.ObjectID(this.params._tourid))
    };
  }
});