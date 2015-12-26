
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
      Tournaments.update(this._id, {
        $set: {status: 'stop'}
      });
    },
    'click #start': function (event) {
      event.preventDefault();
      Tournaments.update(this._id, {
        $set: {status: 'running'}
      });
    },
    'click #archived': function (event) {
      event.preventDefault();
      Tournaments.update(this._id, {
        $set: {archived: 'yes'}
      });
    }
  });

}

