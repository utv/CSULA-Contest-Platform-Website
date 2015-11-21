
Organizations = new Mongo.Collection("organizations");
Games = new Mongo.Collection("games");
Players = new Mongo.Collection("players");
Tournaments = new Mongo.Collection("tournaments");
Matches = new Mongo.Collection("matches");
TempUsers = new Mongo.Collection("temp_users");

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

  // code to run on server at startup

    function getFileExtension (filename) {
      var a = filename.split(".");
      if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
        return "";
      }
      return a.pop();
    }

    UploadServer.init({
      tmpDir: process.env.HOME + '/.ggp-server/uploads/tmp',
      uploadDir: process.env.HOME + '/.ggp-server/uploads',
      checkCreateDirectories: true, //create the directories for you
      acceptFileTypes: /(^.*(\.|\/)((zip)$)(?![^\.\/]*(\.|\/)))|(^[^\.]+$)/i,
      getFileName: function (fileInfo, formData) {
        // Name of an uploaded zip file = zip file name + upload date
        var extension = fileInfo.name.split('.').pop();
        var base = fileInfo.name.replace(/\.[^/.]+$/, "-") + new Date();
        return base + '.' + extension;
      },
      finished: function(fileInfo, formData) {
        // perform a disk operation
        var createDate = new Date();
        if (formData && formData.tournament != null) {
          Players.insert({
            username: formData.username,
            tournament: formData.tournament,
            pathToZip: fileInfo.name,
            pathToClasses: "",
            status: "uploaded",
            createdAt: createDate
            // owner: formData.owner,
            // name: "Recognizing name",
            // tournament: formData.tournament,
          });
        }
      }

    });

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
