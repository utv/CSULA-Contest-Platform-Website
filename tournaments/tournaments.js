
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
      var gameid = gameArr[0];
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

Meteor.methods({
  addTournament: function (tournamentName, theGameid, theGameName) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var genSalt = Random.id();
    var password = '';
    var genHash = CryptoJS.SHA256(genSalt + password).toString();

    var tourUsingThisName = Tournaments.find({name: tournamentName}, {limit: 1}).count();
    if (tourUsingThisName == 0) {
      Tournaments.insert({
        name: tournamentName,
        game: theGameName,
        gameid: theGameid,
        salt: genSalt,
        hash: genHash,
        status: 'stop',
        users: [],
        createdAt: new Date(),
        lastMatchId: 'nomatch',
        leaderBoardId: 'nomatch',
        archived: 'no'
      });

      return true;
    } else return false;

  }
});

Router.route('/tournaments', {
  layoutTemplate: 'appBody',
  template: 'tournaments',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
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
