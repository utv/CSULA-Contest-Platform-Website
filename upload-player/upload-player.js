
if (Meteor.isClient) {

  Template.upload_player.helpers({
    specificFormData: function() {
      return { 
                tourid: this.tournament._id._str,
                tourName: this.tournament.name,
                owner: Meteor.userId(),
                username: Meteor.user().username
              }
    },
    isLastPlayerFail: function () {
      return this.player.srcStatus === "fail";
    },
    isUploaded: function () {
      return this.player.srcStatus === "uploaded";
    },
    isCompiled: function () {
      return this.player.srcStatus === "compiled";
    },
    isNoSource: function () {
      return this.player.srcStatus === "";
    }
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
        // add user to tournament
        var tourid = new Meteor.Collection.ObjectID(formData.tourid);
        var tourName = formData.tourName;
        var username = formData.username;
        var fileName = fileInfo.name;

        if (formData !== null) {
          Players.upsert({ tournament_id: tourid, username: username }, 
          {
            username: username,
            tournament_id: tourid,
            tournament: tourName,
            pathToZip: fileName,
            pathToClasses: "",
            status: "busy",
            srcStatus: "uploaded",
            rating: 0.000,
            mu: 0.000,
            sigma: 0.000,
            numMatch: 0,
            win: 0,
            lose: 0,
            draw: 0,
            createdAt: new Date().getTime()
          });
        }

      }
    });
  });
}

Router.route('upload_player', {
  path: '/upload_player/:_tourid',
  layoutTemplate: 'appBody',
  template: 'upload_player',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      return;
    }
    if (Meteor.user().username === 'admin') {
      Router.go('/tournaments/');
    }
    // else {
    //   // check if a current user already joined this tournament.
    //   var tourID = new Meteor.Collection.ObjectID(this.params._tourid);
    //   var player = Players.findOne({tournament_id: tourID, username: Meteor.user().username});
    //   if (player === undefined) {
    //     Router.go('/join/' + this.params._tourid); 
    //   }

    //   this.next();
    // }

    this.next();
  },
  waitOn:function(){
    return [ 
      Meteor.subscribe('tournament', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('matches', new Meteor.Collection.ObjectID(this.params._tourid)),
      Meteor.subscribe('players')
    ];
  },
  action : function () {
    this.render();
  },
  data: function () {
    return {
      tournament: Tournaments.findOne(new Meteor.Collection.ObjectID(this.params._tourid)),
      player: Players.findOne({
        tournament_id: new Meteor.Collection.ObjectID(this.params._tourid), 
        username: Meteor.user().username})
    };
  }
});