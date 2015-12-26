
if (Meteor.isClient) {

  Template.leader_board.helpers({
    isThereMatchPlayed: function () {
      var match = Matches.findOne({tournament_id: this._id}, {sort: {createdAt: -1}});
      if (match !== undefined) 
        return true;
      return false;
    },
    ranks: function () {
      var theRanks = Matches.findOne({tournament_id: this._id}, {sort: {createdAt: -1}}).ranks;
      var sortedRanks = _.sortBy(theRanks, function(rank) { return rank.rank; });
      //return sortedRanks;
      return _.map(sortedRanks, function(rank) { rank.rating = rank.rating.toFixed(2); 
                                              return rank; });
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
    return [  Meteor.subscribe('tournaments'),
              Meteor.subscribe('matches', this.params._id) ];
  },
  action : function () {
    this.render();
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});