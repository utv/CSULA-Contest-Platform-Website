
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
    }
  });

  Template.tournaments.events({
    'submit .js-new-tournament': function(event) {
      event.preventDefault();

      var $tournamentText = $(event.target).find('[type=text]');
      var $tournamentName = $tournamentText.val().trim();
      var $game = Template.instance().$('select[id=game-picker]');
      if (! $tournamentName) {
        Session.set('tournamentBlank', true);
        return;
      }
      
      Meteor.call("addTournament", $tournamentName, $game.val());
      Session.set('tournamentBlank', false);
      $tournamentText.val('');
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

Meteor.methods({
  addTournament: function (tournamentName, game) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var genSalt = Random.id();
    var password = '';
    var genHash = CryptoJS.SHA256(genSalt + password).toString();

    Tournaments.insert({
      name: tournamentName,
      game: game,
      salt: genSalt,
      hash: genHash,
      status: 'stop',
      users: [],
      createdAt: new Date(),
      archived: 'no'
    });
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
    this.next();
  },
  waitOn:function(){
    return [Meteor.subscribe('games'), Meteor.subscribe('tournaments')];
  },
  action : function () {
    this.render();
  }
});
