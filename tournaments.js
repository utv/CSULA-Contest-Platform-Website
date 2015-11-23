
if (Meteor.isClient) {
  
  Template.tournaments.helpers({
    games: function () {
      return Games.find({}, {sort: { name: 1}});
    },
    tournaments: function () {
      return Tournaments.find({}, {sort: {name: 1}});
    },
    isAdmin: function () {
      return Meteor.user().username === 'admin';
    }
  });

  Template.appBody.events({
    'click #main-menu .item' : function(event) {
      Template.instance().$('.item').removeClass('active');
      var clickedElement = event.target;
      Template.instance().$(clickedElement).addClass('active');
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
        users: [],
        createdAt: new Date()
      });
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Load organizations
    var orgList = {};
    orgList = JSON.parse(Assets.getText("orgList.json"));
    
    if ( Organizations.find({}).count() == 0) {
      // no games, add some!
      for (var i = 0; i < orgList.length; i++) {
        Organizations.insert({
          name: orgList[i],
          createdAt: new Date()
        });
      }
    }

    /*var gameList = {};
    gameList = JSON.parse(Assets.getText("gameList.json"));
    
    if ( Games.find({}).count() == 0) {
      // no games, add some!
      for (var i = 0; i < gameList.length; i++) {
        Games.insert({
          name: gameList[i],
          createdAt: new Date()
        });
      }
    }*/

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
