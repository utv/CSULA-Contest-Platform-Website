function initSession () {
  Session.set('passwordSaved', false);
  Session.set('passwordNotMatched', false);
  Session.set('passwordTooShort', false);
}

if (Meteor.isClient) {
  
  Template.set_tournament_passwd.events({
    'submit .passwd_form' : function(event) {
      event.preventDefault();
      initSession();
      
      var clickedElement = event.target;
      var password = $('input[name=password]').val();
      var repassword = $('input[name=repassword]').val();
      var MIN_LEN_PASS = 3;

      if (password !== repassword ) { 
        Session.set('passwordNotMatched', true);
        return;
      }
      if (password === repassword && password.length < MIN_LEN_PASS) {
        Session.set('passwordTooShort', true);
        return;
      }
      if (password === repassword ) {
        Meteor.call('saveTournamentPassword', this._id, $('input[name=repassword]').val(), function(err,response) {
          if(err) {
            console.log('serverDataResponse', "Error:" + err.reason);
            return;
          }
          
          Session.set('passwordSaved', true);
        });
      } 
    }
  });

  Template.set_tournament_passwd.helpers({
    isPasswordSaved: function () {
      return Session.get('passwordSaved');
    },

    isPasswordsNotMatched: function () {
      return Session.get('passwordNotMatched');
    },

    isPasswordTooShort: function () {
      return Session.get('passwordTooShort');
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({

    saveTournamentPassword: function (tourId, password) {
      // body...
      var genSalt = Random.id();
      var genHash = CryptoJS.SHA256(genSalt + password).toString();
      return Tournaments.update(tourId, {$set: {salt: genSalt, hash: genHash}});
    }
  });
}

Router.route('set_tournament_passwd', {
  path: '/set_tournament_passwd/:_id',
  layoutTemplate: 'appBody',
  template: 'set_tournament_passwd',
  onBeforeAction: function () {
    initSession();
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