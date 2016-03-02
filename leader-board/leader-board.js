
if (Meteor.isClient) {

  Template.leader_board.helpers({
    isThereMatchPlayed: function () {
      if (this.thisLeaderBoard.ranks !== undefined) 
        return true;
      return false;
    },

    ranks: function () {
      // Rankings is already sorted by the server
      _.map(this.thisLeaderBoard.ranks, function(rank) { rank.rating = rank.rating.toFixed(2); return rank; });
      return this.thisLeaderBoard.ranks;      

    }
  });
}

Router.route('leader_board', {
  path: '/leader_board/:_id/:_leaderBoardId',
  name: 'leader_board',
  layoutTemplate: 'appBody',
  template: 'leader_board',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    
    this.next();
  },
  waitOn:function(){
    return Meteor.subscribe('leaderBoardLargeUsersById', this.params._id, this.params._leaderBoardId);
    
  },
  action : function () {
    this.render();
  },
  data: function () {
    if (this.params._leaderBoardId === 'nomatch')
      return {
        thisTournament: Tournaments.findOne(this.params._id)
      };

    // Large number of users
    return {
      thisLeaderBoard: LeaderBoards.findOne(new Meteor.Collection.ObjectID(this.params._leaderBoardId)),
      thisTournament: Tournaments.findOne(this.params._id)
    };
  }

});