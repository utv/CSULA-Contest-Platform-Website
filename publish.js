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

  Meteor.publish('playersTournament', function(username, tourid){
    return [
      Players.find( {username: username} ),
      Tournaments.find(tourid)
    ];
    
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

  Meteor.publish('leaderBoard', function(tourid, matchid){
    if (tourid === undefined || tourid === null)
      return Matches.find();
    
    // No match played yet
    if (matchid === 'nomatch') {
      return Tournaments.find(tourid);
    }

    // Replays are not loaded.
    return [
      Tournaments.find(tourid),
      // Matches.find( {tournament_id: tourid })
      Matches.find( {tournament_id: tourid }, {fields: {replay:0}}, {sort: {_id: -1}}, {limit: 1})
      // Matches.find( {_id: new Meteor.Collection.ObjectID(matchid)}, {fields: {replay:0}})
      
    ];
  });

  Meteor.publish('leaderBoardLargeUsersById', function(tourid, leaderboard_id){
    if (leaderboard_id === 'nomatch')
      return Tournaments.find(tourid);
    // Replays are not loaded.
    return [
      // Matches.find({tournament_id: tourid}, {fields: {replay:0}}, {limit: 1}, {sort: {_id: -1}}),
      Tournaments.find(tourid),
      LeaderBoards.find(new Meteor.Collection.ObjectID(leaderboard_id))
    ];
  });

  Meteor.publish('leaderBoardLargeUsers', function(tourid, matchid){
    if (tourid === undefined || tourid === null)
      return Matches.find();
    // Replays are not loaded.
    return [
      // Matches.find({tournament_id: tourid}, {fields: {replay:0}}, {limit: 1}, {sort: {_id: -1}}),
      Matches.find( {_id: new Meteor.Collection.ObjectID(matchid)}, {fields: {replay:0}}),
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
      Matches.find(
        {tournament_id: tourid}, {fields: {ranks:0, replay:0}}),
      Tournaments.find(tourid)
    ];
  });

  Meteor.publish('games', function(){
    return Games.find();
  });
}