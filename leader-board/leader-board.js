
if (Meteor.isClient) {

  Template.leader_board.helpers({
    ranks: function () {
      var theRanks = Matches.findOne({tournament_id: this._id}, {sort: {createdAt: -1}}).ranks;
      return _.sortBy(theRanks, function(rank) { return -rank.rating; });
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
    return [  Meteor.subscribe('tournaments', 10),
              Meteor.subscribe('matches', this.params._id) ];
  },
  action : function () {
    this.render();
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});