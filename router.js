
Router.route('/', function () {
  this.layout('appBody');
});

Router.route('/login', function () {
  // var organizations = Organizations.find( {}, {sort: {name: 1}} );
  this.layout('appBody');
  this.render('login');
  if (Meteor.user()) Router.go('tournaments');
});

Router.route('/register', function () {
  // var organizations = Organizations.find( {}, {sort: {name: 1}} );
  this.layout('appBody');
  this.render('register');
});

Router.route('/tournaments', function () {
  // var tournament = Tournaments.find( {}, {sort: {name: 1}} );
  this.layout('appBody');

  // this.render('tournaments', {data: tournament});
  if (Meteor.user()) this.render('tournaments');
  else Router.go('/');
});

Router.route('show_tournament', {
  path: '/tournament/:_id',
  layoutTemplate: 'appBody',
  template: 'show_tournament',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }

    // check if a current user already joined this tournament.
    var tournament = Tournaments.findOne(this.params._id);
    var isJoined = _.some(tournament.users, function(aUser) {
      return aUser.username == Meteor.user().username; 
    });
    if (isJoined) this.next();
    else Router.go('/join/' + this.params._id);
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});

Router.route('join_tournament', {
  path: '/join/:_id',
  layoutTemplate: 'appBody',
  template: 'join_tournament',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    this.next();
  },
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});

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
  data: function () {
    return Tournaments.findOne({_id: this.params._id});
  }
});

// Router.route('/uploadPlayer', function () {
//   this.layout('appBody');
//   this.render('uploadPlayer');
// });
