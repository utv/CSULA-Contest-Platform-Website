
if (Meteor.isClient) {

  Template.upload_player.helpers({
    specificFormData: function() {
      return { 
                tournament: this.name,
                owner: Meteor.userId(),
                username: Meteor.user().username
              }
    },
    isLastPlayerFail: function () {
      return Players.findOne(
              { 
                username: Meteor.user().username, 
                tournament: this.name,
              },
              { sort: {createdAt: -1} }).status === "fail";
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
  });
}

Router.route('upload_player', {
  path: '/upload_player/:_id',
  layoutTemplate: 'appBody',
  template: 'upload_player',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    if (Meteor.user().username === 'admin') {
      Router.go('/tournaments/'); 
    }
    else {
      // check if a current user already joined this tournament.
      var tournament = Tournaments.findOne(this.params._id);
      var isJoined = _.some(tournament.users, function(aUser) {
        return aUser.username == Meteor.user().username; 
      });

      if (!isJoined) Router.go('/join/' + this.params._id); 
      else this.next();
    }
  },
  waitOn:function(){
    return [  Meteor.subscribe('tournaments'), 
              Meteor.subscribe('players') ];
  },
  action : function () {
    this.render();
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id}, {sort: {createdAt: -1}});
  }
});