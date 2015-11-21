
if (Meteor.isClient) {

  Template.show_tournament.onRendered(function() {
    this.$('.ui.tabular.menu .item').tab();
  });

  Template.show_tournament.helpers({
    specificFormData: function() {
      return { 
                tournament: this.name,
                owner: Meteor.userId(),
                username: Meteor.user().username
              }
    },

    // playersByTourId: function () {
    //   var myPlayers = Tournaments.findOne(this._id).players;
    //   return _.sortBy(myPlayers, function(player){ return -player.score; });
    // },

    isLastPlayerFail: function () {
      return Players.findOne(
                { 
                  username: Meteor.user().username, 
                  tournament: this.name,
                },
                { sort: {createdAt: -1} }).status === "fail";
    },

    ranks: function () {
      var theRanks = Matches.findOne({tournament_id: this._id}, {sort: {createdAt: -1}}).ranks;
      return _.sortBy(theRanks, function(rank) { return -rank.rating; });
    },

    latest_matches: function () {
      return Matches.find({tournament_id: this._id}, {sort: {createdAt: -1}});
    }
  });
}

