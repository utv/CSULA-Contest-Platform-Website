if (Meteor.isServer) {
  Meteor.publish('tournaments', function(limit){
    return Tournaments.find({}, {limit: limit || 1000});
    // return Tournaments.find();
  });

  Meteor.publish('players', function(){
    return Players.find();
  });

  Meteor.publish('matches', function(tourid){
    if (tourid === undefined || tourid === null)
      return Matches.find({}, {sort: {createdAt: -1}});
    return Matches.find({tournament_id: tourid}, {sort: {createdAt: -1}});
  });

  Meteor.publish('games', function(){
    return Games.find();
  });
}