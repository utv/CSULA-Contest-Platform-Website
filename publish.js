if (Meteor.isServer) {
  Meteor.publish('tournaments', function(limit){
    if (limit === undefined || limit === null)
      return Tournaments.find();
    return Tournaments.find({}, {limit: limit || 1000});
    // return Tournaments.find();
  });

  Meteor.publish('tournamentsByTourid', function(tourid){
    return Tournaments.find(tourid);
    // return Tournaments.find();
  });

  Meteor.publish('players', function(){
    return Players.find();
  });

  Meteor.publish('matches', function(matchid){
    if (matchid === undefined || matchid === null)
      return null;
    return Matches.find(new Meteor.Collection.ObjectID(matchid));
  });

  Meteor.publish('matchesByTourid', function(tourid){
    if (tourid === undefined || tourid === null)
      return Matches.find({}, {sort: {createdAt: -1}});
    return Matches.find({tournament_id: tourid});
  });

  Meteor.publish('RanksByTourid', function(tourid){
    if (tourid === undefined || tourid === null)
      return Matches.find();
    // Replays are not loaded.
    return [
      Matches.find({tournament_id: tourid}, {fields: {replay:0}}),
      Tournaments.find(tourid)
    ];
  });

  Meteor.publish('tournamentAndMatchesByTourid', function(tourid){
    if (tourid === undefined || tourid === null)
      return Matches.find();
    /*
    * {fields: {ranks:0, replay:0}} = do not take these fields
    * because not in used in this page and huge loading time.
    */
    return [
      Matches.find({tournament_id: tourid}, {fields: {ranks:0, replay:0}}),
      Tournaments.find(tourid)
    ];
  });

  Meteor.publish('games', function(){
    return Games.find();
  });
}