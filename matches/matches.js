
if (Meteor.isClient) {
  Session.set('number_of_match', 10);

  Template.matches.events({
    'click #load': function(event) {
      event.preventDefault();
      Session.set('number_of_match', Session.get('number_of_match') + 10);
    }
  });

  Template.matches.helpers({
    isThereMatchPlayed: function () {
      var match = Matches.findOne({tournament_id: this._id});
      if (match !== undefined) 
        return true;
      return false;
    },
    latest_matches: function () {
      return Matches.find({ tournament_id: this._id }, 
                          { sort: {createdAt: -1}, 
                            limit: Session.get('number_of_match') 
                          });
    }
  });
}

Router.route('matches', {
  path: '/matches/:_id',
  layoutTemplate: 'appBody',
  template: 'matches',
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
    return Tournaments.findOne({_id: this.params._id}, {sort: {createdAt: -1}});
  }
});