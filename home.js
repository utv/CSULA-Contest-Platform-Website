Router.route('/', function () {
  this.layout('appBody');
  if (!Meteor.user()) {
    // Router.go('login');
    return;
  }
});