if (Meteor.isClient) {
  Template.appBody.events({
    'click #main-menu .item' : function(event) {
      Template.instance().$('.item').removeClass('active');
      var clickedElement = event.target;
      Template.instance().$(clickedElement).addClass('active');
    }
  });
}


Router.route('home', {
  path: '/',
  layoutTemplate: 'appBody',
  template: 'tournaments',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
  },
  action : function () {
    this.render();
  }
});  
  


// Router.route('/', function () {
//   // this.layout('appBody');
//   if (!Meteor.user()) {
//     // Router.go('login');
//     return;
//   }

//   Router.go('/tournaments');
//   return;
// });

if (Meteor.isServer) {
  Meteor.startup(function () {
    Matches._ensureIndex({ "tournament_id": -1});
    Matches._ensureIndex({ "tournament_id": -1, "createdAt": -1});
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