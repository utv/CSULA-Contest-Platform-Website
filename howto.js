Router.route('/howto', {
  layoutTemplate: 'appBody',
  template: 'howto',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      // Router.go('login');
      return;
    }
    
    this.next();
  },
  action : function () {
    this.render();
  }
});