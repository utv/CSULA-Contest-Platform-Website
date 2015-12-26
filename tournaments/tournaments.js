
if (Meteor.isClient) {
  
  Template.tournaments.helpers({
    games: function () {
      return Games.find({}, {sort: { name: 1}});
    },
    tournaments: function () {
      return Tournaments.find({archived:"no"}, {sort: {createdAt: -1}});
    },
    isAdmin: function () {
      return Meteor.user().username === 'admin';
    }
  });

  Template.tournaments.events({
    'submit .js-new-tournament': function(event) {
      event.preventDefault();

      var $tournamentName = $(event.target).find('[type=text]');
      var $game = Template.instance().$('select[id=game-picker]');
      if (! $tournamentName.val())
        return;
      
      console.log($tournamentName.val() + ", " + $game.val());
      Tournaments.insert({
        name: $tournamentName.val(),
        game: $game.val(),
        salt: '',
        hash: '',
        status: 'stop',
        users: [],
        createdAt: new Date(),
        archived: 'no'
      });

      $tournamentName.val('');
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

Router.route('/tournaments', {
  layoutTemplate: 'appBody',
  template: 'tournaments',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    this.next();
  },
  waitOn:function(){
    return [Meteor.subscribe('games'), Meteor.subscribe('tournaments')];
  },
  action : function () {
    this.render();
  }
});
