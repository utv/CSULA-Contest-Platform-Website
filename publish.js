if (Meteor.isServer) {
  Meteor.publish('players', function(){
    return Players.find();
  });

  Meteor.publish('matches', function(){
    return Matches.find();
  });

  Meteor.publish('tournaments', function(){
    return Tournaments.find();
  });

  Meteor.publish('games', function(){
    return Games.find();
  });
}