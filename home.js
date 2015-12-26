if (Meteor.isClient) {
  Template.appBody.events({
    'click #main-menu .item' : function(event) {
      Template.instance().$('.item').removeClass('active');
      var clickedElement = event.target;
      Template.instance().$(clickedElement).addClass('active');
    }
  });
}

Router.route('/', function () {
  this.layout('appBody');
  if (!Meteor.user()) {
    // Router.go('login');
    return;
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
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