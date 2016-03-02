if (Meteor.isClient) {
  
  Template.join_tournament.events({
    'submit .join_form': function (event) {
      event.preventDefault();
      var password = $('input[name=password]').val();
      var tournament = Tournaments.findOne(this._id);
      var userPassword = CryptoJS.SHA256(tournament.salt + password).toString();
      
      if (userPassword === tournament.hash) {
        Meteor.call("addUserToTournament", this._id, Meteor.user().username);
        Router.go('show_tournament', {_id: this._id});
        return;
      } 
      else {
        Session.set('tournamentPasswordNotCorrect', true);
        return;
      }
    }
  });

  Template.join_tournament.helpers({
    isTournamentPasswordNotCorrect: function () {
      return Session.get('tournamentPasswordNotCorrect');
    }
  });
}

Meteor.methods({
  addUserToTournament: function (tourId, username) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tournaments.update(
      { _id: tourId }, 
      { $push: {users: {username: username}} }
    );
  }
});

Router.route('join_tournament', {
  path: '/join/:_id',
  layoutTemplate: 'appBody',
  template: 'join_tournament',
  onBeforeAction: function () {
    Session.set('tournamentPasswordNotCorrect', false);
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }

    if (Meteor.user().username === 'admin') {
      Router.go('/tournaments/'); 
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