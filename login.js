
if (Meteor.isClient) {
  function clearLoginMsg () {
    $('[name=login-message]').text("");
  }

  Template.login.events({
    'submit #login-form': function (event) {
      event.preventDefault();
      clearLoginMsg();
      var username = $('[name=username]').val();
      var password = $('[name=password]').val();

      var thisUser = TempUsers.findOne({username: username});

      if (!thisUser) 
        $('[name=login-message]').text("Username is not found!");
      else {
        if (thisUser.active) {
          Meteor.loginWithPassword(username, password, function(err){
            if (!err) {
              // The user has been logged in.
              console.log('login success!');
              // Router.go('tournaments');
            }
            else
              // The user might not have been found, or their passwword
              // could be incorrect. Inform the user that their
              // login attempt has failed. 
              $('[name=login-message]').text(err);
              
            });
          } else 
              $('[name=login-message]').text("This username has not been activated by admin!");
      }
      // prevent reloading the page.
      // return false;
    }
  });
}
