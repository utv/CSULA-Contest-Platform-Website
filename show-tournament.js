
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

    ranks: function () {
      var theRanks = Matches.findOne({tournament_id: this._id}, {sort: {createdAt: -1}}).ranks;
      return _.sortBy(theRanks, function(rank) { return -rank.rating; });
    },

    // joined: function () {

    //   var tournament = Tournaments.findOne(this._id);
    //   var isJoined = _.some(tournament.users, function(aUser) {
    //     return aUser.username == Meteor.user().username; 
    //   });
      
    //   return isJoined;
    // }
  });
}
