if (Meteor.isServer) {
  
  Meteor.methods({
    addTournament: function (tournamentName, theGameid, theGameName) {
      // Make sure the user is logged in before inserting a task
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }

      var genSalt = Random.id();
      var password = '';
      var genHash = CryptoJS.SHA256(genSalt + password).toString();

      var tourUsingThisName = Tournaments.find({name: tournamentName}, {limit: 1}).count();
      if (tourUsingThisName == 0) {
        Tournaments.insert({
          name: tournamentName,
          game: theGameName,
          gameid: theGameid,
          salt: genSalt,
          hash: genHash,
          status: 'stop',
          createdAt: new Date(),
          archived: 'no'
        });

        return true;
      } else return false;

    },

    saveTournamentPassword: function (tourId, password) {
      var genSalt = Random.id();
      var genHash = CryptoJS.SHA256(genSalt + password).toString();
      var tournament = Tournaments.findOne(tourId);
      
      if (Tournaments.update(tourId, {$set: {salt: genSalt, hash: genHash}}) === 1) {
        return true;
      }
      return false;
    },

    addUserToTournament: function (tourId, username, password) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var tournament = Tournaments.findOne(tourId);
    var userPassword = CryptoJS.SHA256(tournament.salt + password).toString();
    if (userPassword === tournament.hash) {
      
      Players.upsert({ tournament_id: tourId, username: username }, 
        {
          username: username,
          tournament_id: tourId,
          tournament: tournament.name,
          pathToZip: "",
          pathToClasses: "",
          status: "busy",
          srcStatus: "",
          rating: 0.000,
          mu: 0.000,
          sigma: 0.000,
          numMatch: 0,
          win: 0,
          lose: 0,
          draw: 0,
          createdAt: new Date().getTime()
        });

      return tourId._str;
    }
    return false;
  }
  });
}