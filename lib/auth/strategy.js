/*
 * Module dependencies
 */
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , utils = require('lib/utils')
  , log = require('debug')('democracyos:auth:strategy')
  ;

/**
 * Expose AuthStrategy
 */

module.exports = AuthStrategy;

/**
 * Register Auth Strategies for app
 */

function AuthStrategy (app) {

  /**
   * Citizen model
   */

  var Citizen = mongoose.model('Citizen');

  /**
   * Passport Serialization of logged
   * Citizen to Session from request
   */

  passport.serializeUser(function(citizen, done) {
    done(null, citizen._id);
  });

  /**
   * Passport Deserialization of logged
   * Citizen by Session into request
   */

  passport.deserializeUser(function(citizenId, done) {
    Citizen
    .findById(citizenId)
    .exec(function(err, citizen) {
      done(null, citizen);
    });
  });

  /**
   * Register Local Strategy
   */

  passport.use(new LocalStrategy(Citizen.authenticate()));

  passport.use(new FacebookStrategy({
      clientID: config["facebook_passport_clientID"],
      clientSecret: config["facebook_passport_clientSecret"],
      callbackURL: config["facebook_passport_callbackURL"],
      profileFields: ['name', 'emails'],
      scope: ['email']
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
        Citizen
            .findByProvider(profile, 
                    function (err, user) {
                      if (err) return;
                      if (!user) {
            
                        var citizen = new Citizen({profiles: {facebook: profile}});
                        citizen.firstName = profile.name.givenName; 
                        citizen.lastName = profile.name.familyName;
            
                        if (profile.emails[0].value)
                          citizen.email = profile.emails[0].value;
                      
                        citizen.save();
                        log('new citizen [%s] from Local signup [%s]', citizen.id, profile.email);
                            done(null, citizen);
                          } else {
                            done(null, user);
                        }
                    });
    }
  ));
}
