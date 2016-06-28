if (Meteor.isServer) {
  Meteor.publish('tournaments', function(limit){
    if (limit === undefined || limit === null)
      return Tournaments.find();
    return Tournaments.find({}, {limit: limit || 1000});
  });

  Meteor.publish('tournament', function(tourid){
    return Tournaments.find(tourid);
  });

  Meteor.publish('players', function(){    
    return Players.find();
  });

  Meteor.publish('matches', function(tourid){
    return Matches.find({tournament_id: tourid});
  });

  Meteor.publish('match', function(matchid){
    return Matches.find({_id: matchid}, {limit: 20});
  });

  Meteor.publish('games', function(){
    return Games.find();
  });
}