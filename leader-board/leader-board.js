
if (Meteor.isClient) {

  Template.leader_board.helpers({
    isThereMatchPlayed: function () {
      // var match = Matches.findOne({tournament_id: this._id}, {sort: {createdAt: -1}});
      var match = this.thisMatch;
      if (match !== undefined) 
        return true;
      return false;
    },
    
    ranks: function () {
      // Rankings is already sorted by the server
      _.map(this.thisMatch.ranks, function(rank) { rank.rating = rank.rating.toFixed(2); return rank; });
      return this.thisMatch.ranks;
    }
  });
}

Router.route('leader_board', {
  path: '/leader_board/:_id/:_matchid',
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
    return Meteor.subscribe('RanksByTourid', this.params._id, this.params._matchid);
  },
  action : function () {
    this.render();
  },
  data: function () {
    return {
      thisMatch: Matches.findOne(new Meteor.Collection.ObjectID(this.params._matchid)),
      thisTournament: Tournaments.findOne({_id: this.params._id})
    };
  }

});