/*
* Creates meteor user for testing.
*
*/

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Before creating new users, Number of users = " + Meteor.users.find().count());  
    var tictactoe = "Tic-Tac-Toe";
    var hex = "Hex";
    var ttt_tour = "ttt_for_users";
    var hex_tour = "hexx_5000";
    
    var theTour = hex_tour;
    var theGameName = hex;
    var theGameid = Games.findOne({name: theGameName})._id._str;
    var randomPlayerPath = "/Users/Amata/.ggp-server/compiled/myRandomPlayer-Thu Dec 03 2015 16:33:15 GMT-0800 (PST)";

    // var theUsers = getUsers(1, 5000);
    // createTournament(theTour, theGameName, theGameid, theUsers);
    // createPlayers(theTour, randomPlayerPath, theUsers);
    // console.log("number of players in " + theTour + " is " + 
    //   Players.find({tournament: theTour, status: "compiled"}).count());
  });
  
  function getUsers(from, to) {
    var users = [];
    for (var i = from; i <= to; i++) {
      users.push({"username": "user" + i});
    }
    return users;
  }

  function createUser (newUser) {
    if (!Meteor.users.findOne({username: newUser})) {
      Accounts.createUser({
        username: newUser,
        password: 'passwd'
      });  
      // console.log(newUser + " created!");
    } else {
      //console.log(newUser + " already exists");
    }
  }

  function createUsers (from, to) {
    var users = [];
    for (var i = from; i <= to; i++) {
      users.push({"username": "user" + i});
      createUser("user" + i);
    }

    return users;
  }

  function createPlayers (tour, classPath, theUsers) {
    var users = [];
    var eachUser = '';
    var createDate = new Date();
    var tourid = Tournaments.findOne({name: tour})._id;

    for (var i = 0; i < theUsers.length; i++) {
      Players.insert({
        username: theUsers[i].username,
        tournament_id: tourid,
        tournament: tour,
        pathToZip: '',
        pathToClasses: classPath,
        status: "compiled",
        createdAt: createDate
        // owner: formData.owner,
        // name: "Recognizing name",
        // tournament: formData.tournament,
      });

    };
  }

  function createTournament (theTour, theGameName, theGameid, theUsers) {
    if (Tournaments.findOne({name:theTour})) 
      return;

    var genSalt = Random.id();
    var password = '';
    var genHash = CryptoJS.SHA256(genSalt + password).toString();

    Tournaments.insert({
      name: theTour,
      game: theGameName,
      gameid: theGameid,
      salt: genSalt,
      hash: genHash,
      status: 'stop',
      users: theUsers,
      createdAt: new Date(),
      archived: 'no'
    });
  }
  
}