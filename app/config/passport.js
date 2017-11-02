'use strict';

const GitHubStrategy = require('passport-github').Strategy,
      configAuth = require(process.cwd()+'/app/config/auth.js');

var Users = require(process.cwd()+"/app/models/users.js");

module.exports = function(passport){
      passport.serializeUser(function (user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
      Users.findById(id, function (err, user) {
        done(err, user);
      });
    });
  
	passport.use(new GitHubStrategy({
      clientID: configAuth.githubAuth.clientID,
      clientSecret: configAuth.githubAuth.clientSecret,
      callbackURL: configAuth.githubAuth.callbackURL
	  },function (token, refreshToken, profile, done) {
        process.nextTick(function (){
        Users.findOne({'github.id': profile.id},function(err,user){
          if (err) {return done(err);}
          if (user) {
            return done(null,user)
          } else {
          var newUser = new Users();
              newUser.github.id = profile.id;
              newUser.github.username = profile.username;
              newUser.github.displayName = profile.displayName;
              newUser.polls = [];

              newUser.save(function(err){if (err) throw err;
                                        return done(null, newUser);})
          }        
        })
      })      
    } 
  )
 );  
}