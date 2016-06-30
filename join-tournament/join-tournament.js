if (Meteor.isClient) {
  
  Template.join_tournament.events({
    'submit .join_form': function (event) {
      event.preventDefault();
      var password = $('input[name=password]').val();
      Meteor.call("addUserToTournament", this._id, Meteor.user().username, password, 
        function(error, result) {
          if (error) { 
            console.log('Error adding new player!'); 
          }else {
            if (result) {
              Router.go('show_tournament', {_tourid: result});
              return;
            } else {
              Session.set('tournamentPasswordNotCorrect', true);
              return;
            }
          }
      });
    }
  });

  Template.join_tournament.helpers({
    isTournamentPasswordNotCorrect: function () {
      return Session.get('tournamentPasswordNotCorrect');
    }
  });
}

Router.route('join_tournament', {
  path: '/join/:_tourid',
  layoutTemplate: 'appBody',
  template: 'join_tournament',
  onBeforeAction: function () {
    Session.set('tournamentPasswordNotCorrect', false);
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    if (Meteor.user().username === 'admin') Router.go('/tournaments/'); 
    
    var tourID = new Meteor.Collection.ObjectID(this.params._tourid);
    var player = Players.findOne({tournament_id: tourID, username: Meteor.user().username});
    
    if (player === undefined) {
      this.next();
      //return;
    }
    else Router.go('/show_tournament/' + this.params._tourid);
  },
  waitOn:function(){
    return [ Meteor.subscribe('tournament', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('match', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('players'),
      Meteor.subscribe('games') ];
  },
  data: function () {
    return Tournaments.findOne(new Meteor.Collection.ObjectID(this.params._tourid));
  }
});