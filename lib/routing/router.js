/**
 * Created by Steve Kehoe on 9/14/2015.
 */
Router.configure({
    layoutTemplate: "masterLayout",
    loadingTemplate: "loading",
    notFoundTemplate: "notFound",
    waitOn: function() {
        return [Meteor.subscribe('sessions')];
    }
});
Router.route('/', {
    name: 'home'
});

Router.route('/selectTime', {
    name: 'selectTime',
    onBeforeAction: function (pause) {
        var openSessions = Sessions.find({owner: Meteor.userId(), isInProgress: true}).fetch();
        if (openSessions.length > 0) {
            Router.go('timeLeft', {_id: openSessions[0]._id});
            return this.next();
        }
        else{
            this.render('selectTime');
            return this.next();
        }
    }
});

Router.route('/timeLeft/:_id', {
    name: 'timeLeft',
    data: function() { return Sessions.findOne(this.params._id); }
});

Router.route('/sessionComplete/:_id', {
    name: 'sessionComplete',
    data: function() { return Sessions.findOne(this.params._id); }
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}
//Router.onBeforeAction('dataNotFound', {only: 'postPage'});
//Router.onBeforeAction(requireLogin, {except: 'home'});

Router.plugin('ensureSignedIn', {
    except: ['home', 'atSignIn', 'atSignUp', 'atForgotPassword', 'atSignOut']
});
