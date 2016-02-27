
if (Meteor.isClient) {

  Template.leader_board.helpers({
    isThereMatchPlayed: function () {
      var match = Matches.findOne({tournament_id: this._id}, {sort: {createdAt: -1}});
      if (match !== undefined) 
        return true;
      return false;
    },
    
    ranks: function () {
      // Rankings is already sorted by the server
      var theMatch = Matches.findOne(this.lastMatchId);
      _.map(theMatch.ranks, function(rank) { rank.rating = rank.rating.toFixed(2); return rank; });
      return theMatch.ranks;
    }
  });
}

Router.route('leader_board', {
  path: '/leader_board/:_id',
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
    return Meteor.subscribe('RanksByTourid', this.params._id);
  },
  action : function () {
    this.render();
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});