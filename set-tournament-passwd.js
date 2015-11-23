
if (Meteor.isClient) {
  
  Template.set_tournament_passwd.events({
    'click .button' : function(event) {
      event.preventDefault();
      var clickedElement = event.target;
      var password = $('input[name=password]').val();
      var repassword = $('input[name=repassword]').val();
      var MIN_LEN_PASS = 6;

      if (password !== repassword ) { 
        $('[id=response]').text("These passwords don't match");
      }
      if (password === repassword && password.length < MIN_LEN_PASS) {
        $('[id=response]').text("Password is too short, at least 8 characters.");
      }
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
          
          $('[id=response]').text("Password has been set!");
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

Router.route('set_tournament_passwd', {
  path: '/set_tournament_passwd/:_id',
  layoutTemplate: 'appBody',
  template: 'set_tournament_passwd',
  onBeforeAction: function () {
    Session.set('passwordSaved', false);
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    this.next();
  },
  waitOn:function(){
    return [ Meteor.subscribe('tournaments') ];
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});