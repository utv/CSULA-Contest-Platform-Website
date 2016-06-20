
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
    },
    tournamentBlank: function () {
      return Session.get('tournamentBlank');
    },
    tournamentExisted: function () {
      return Session.get('tournamentExisted');
    }
  });

  Template.tournaments.events({
    'submit .js-new-tournament': function(event) {
      event.preventDefault();

      var $tournamentText = $(event.target).find('[type=text]');
      var $tournamentName = $tournamentText.val().trim();
      var $game = Template.instance().$('select[id=game-picker]').val();
      // $game = "id,name"  need to split!
      var gameArr = $game.split(",");
      var gameid = new Meteor.Collection.ObjectID(gameArr[0]);
      var gameName = gameArr[1];

      if (! $tournamentName) {
        Session.set('tournamentExisted', false);
        Session.set('tournamentBlank', true);
        return;
      }

      Meteor.call("addTournament", $tournamentName, gameid, gameName, function(error, result) {
        if (error) {
          console.log('Error adding new tournament!');
        } else {
          if (result) {
            Session.set('tournamentBlank', false);
            Session.set('tournamentExisted', false);
            $tournamentText.val('');
          } else {
            // already existed
          Session.set('tournamentExisted', true);
          Session.set('tournamentBlank', false);
          }
        }
      });
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
      // Router.go('login_warning');
      return;
    }
    Session.set('tournamentExisted', false);
    Session.set('tournamentBlank', false);
    this.next();
  },
  waitOn:function(){
    return [Meteor.subscribe('games'), Meteor.subscribe('tournaments')];
  },
  action : function () {
    this.render();
  }
});

