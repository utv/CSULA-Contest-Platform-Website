// var errorMsg = {
//   usernameAtLeastThree : "Username must have at least 3 characters",
//   usernameAdminNotAllowed : "Username 'admin' is not allowed",
//   passwordNotMatch: "These passwords don't match"
// };

if (Meteor.isClient) {

  Template.register.helpers({
    
    organizations: function () {
      return Organizations.find({}, {sort: {name: 1}});
    }
  });

  function clientValidate (user) {
    // Client side validation; Pass = true
    // first, last, email, username, password, repassword
    
    if (user.username === "admin")
      $('[id=username_error]').text("Username 'admin' is not allowed");
    if (user.username.length < 3)
      $('[id=username_error]').text("Username must have at least 3 characters");
    if (user.password !== user.profile.repassword)
      $('[id=repassword_error]').text("These passwords don't match");

    if ($('[id=username_error]').text().length === 0 && $('[id=repassword_error]').text().length === 0) 
      return true;
    return false;
  }

  function usernameAvailable(usernameInput) {
    return Meteor.users.findOne({username: usernameInput});
  }

  function createUser (user) {
    Accounts.createUser(user, function (error) {
      if (error) {
        // var usernameAtLeastThree = "Username must have at least 3 characters";
        // var usernameAdminNotAllowed = "Username 'admin' is not allowed";

        if (error.reason === errorMsg.usernameAtLeastThree) {
          $('[id=username_error]').text(errorMsg.usernameAtLeastThree);
        }
        if (error.reason === errorMsg.usernameAdminNotAllowed) {
          $('[id=username_error]').text(errorMsg.usernameAdminNotAllowed);
        }
        return;
      }
    });
  }

  function clearInputForm () {
    $('input[type=text]').val("");
    $('input[type=email]').val("");
    $('input[type=password]').val("");
  }

  function clearErrorMsg () {
    $('b').text("");
  }

  Template.register.events({
    'submit .register-form' : function (event) {
      event.preventDefault();

      clearErrorMsg();
      var first = $('[name=firstname]').val();
      var last = $('[name=lastname]').val();
      var email = $('[name=email]').val();
      var org = $('select[id=org-picker]').val();
      var username = $('[name=username]').val();
      var password = $('[name=password]').val();
      var repassword = $('[name=repassword]').val();

      var user = {
        username: username,
        email: email,
        password: password,
        profile: {
          repassword: repassword,
          oranization: org,
          active: false,
          role: "user"
        }
      };

      if (clientValidate(user) && !usernameAvailable(user.username)) {
        console.log('Pass test');
        Accounts.createUser(user, function (error) {
          clearInputForm();
          clearErrorMsg();
          if (!error) {
            var tempUser = {
              username: user.username,
              active: false
            };
            TempUsers.insert(tempUser);
            clearInputForm();
            $('[id=register_message]').text("Register completed, waiting for an account activation by admin.");
            return;
          }
          else 
            $('[id=register_message]').text("Failed to register, please try again.");
        });

        if (Meteor.user()) {
          console.log(Meteor.user());
        } else console.log('Register Failed');
        
      } 
    }

  });
}

if (Meteor.isServer) {
  // not used for now!
  // Accounts.validateNewUser(function (user) {
  //   if (user.username && user.username.length < 3) 
  //     throw new Meteor.Error(403, errorMsg.usernameAtLeastThree);
    
  //   if (user.username === "admin") 
  //     throw new Meteor.Error(403, errorMsg.usernameAdminNotAllowed);
    
  //   return true;
  // });

};
