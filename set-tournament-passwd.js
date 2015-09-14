
if (Meteor.isClient) {

  Template.set_tournament_passwd.helpers({
    isPasswordSaved: function () {
      return Session.get('passwordSaved');
    }
  });


  Template.set_tournament_passwd.events({
    'click .button' : function(event) {
      event.preventDefault();
      var clickedElement = event.target;
      var password = $('input[name=password]').val();
      var repassword = $('input[name=repassword]').val();
      if (password === repassword ) {
        console.log(clickedElement);
        console.log(repassword);
        
        Meteor.call('saveTournamentPassword', this._id, $('input[name=repassword]').val(), function(err,response) {
          if(err) {
            console.log('serverDataResponse', "Error:" + err.reason);
            return;
          }
          
          console.log('password saved!');
          console.log('response = ', response);
          Session.set('passwordSaved', true);
          $('.field').hide();
          $('.button').hide();
        });
        
      }

    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    genHash: function() {
      return 'genHash'
    },

    saveTournamentPassword: function (tourId, password) {
      // body...
      var genSalt = Random.id();
      var genHash = CryptoJS.SHA256(genSalt + password).toString();
      console.log('tourId = ', tourId);
      console.log('salt = ', genSalt);
      console.log('hash = ', genHash);
      
      return Tournaments.update(tourId, {$set: {salt: genSalt, hash: genHash}});
    }
  });
}