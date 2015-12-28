
if (Meteor.isClient) {
  
  Template.a_tournament.helpers({
    isAdmin: function () {
      return Meteor.user().username === 'admin';
    },
    isRunning: function (status) {
      return status === 'running';
    }
  });

  Template.a_tournament.events({
    'click #stop': function (event) {
      event.preventDefault();
      Meteor.call("stopTournament", this._id);
    },
    'click #start': function (event) {
      event.preventDefault();
      Meteor.call("startTournament", this._id);
    },
    'click #archived': function (event) {
      event.preventDefault();
      Meteor.call("archiveTournament", this._id);
    }
  });

}

Meteor.methods({
  startTournament: function (tourId) {
    console.log("startTournament id = " + tourId);
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tournaments.update(tourId, {
      $set: {status: 'running'}
    });
  },
  stopTournament: function (tourId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Tournaments.update(tourId, {
      $set: {status: 'stop'}
    });
  },
  archiveTournament: function (tourId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tournaments.update(tourId, {
      $set: {archived: 'yes'}
    });
  }
});
