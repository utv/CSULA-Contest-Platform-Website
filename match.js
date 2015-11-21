
if (Meteor.isClient) {

  Template.matchReplay.onRendered(function () {  
    console.log(this.data);
    Session.set('index', 0);
    Session.set('replayLen', this.data.replay.length);
  });

  Template.matchReplay.events({
    'click #next': function(event) {
      if (Session.get('index') < Session.get('replayLen') - 1) {
        Session.set('index', Session.get('index') + 1);
      }
      
    },
    'click #prev': function(event) {
      if (Session.get('index') > 0) {
        Session.set('index', Session.get('index') - 1);
      }
    }
    
  });

  Template.matchReplay.helpers({

    replayState: function() {
      return this.replay[Session.get('index')];
    }

  });
}

