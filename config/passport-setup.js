const pasport           = require('passport');
const GoogleStrategy    = require('passport-google-oauth20');
const FacebookStrategy  = require('passport-facebook');
const TwitterStrategy   = require('passport-twitter');
const InstagramStrategy = require('passport-instagram');
const LocalStrategy     = require('passport-local').Strategy;

require('dotenv').config();

require('dotenv').config();
var User    = require('../models/user');

pasport.serializeUser((user, done) => {
    done(null, user.id);
});

pasport.deserializeUser((id, done) => {
    User.getUserById(id, function(err, user){
        if(err) throw err;
        done(err, user);
    });
});



var googleOpts = {
  clientID : process.env.GOOGLE_CLIENT_ID,
  clientSecret : process.env.GOOGLE_CLIENT_SECRET,
  callbackURL : process.env.GOOGLE_CALLBACK_URL
},
googleCallback = function(accessToken, refreshToken, profile, done){
  //check if user already exists
  User.getOneExistingGoogleUser(profile.id, (err, user) => {
      if(err) throw err;
      if(user){
          console.log('pre existing google user ', user);
          done(null, user);
      }
      else
      {
          // create a new user
          var newUser = new User({
            name : profile.displayname,
            username : profile.displayname,
            email : '',
            password : '',
            socialInfo : [{
                googleId : profile.id
            }]
          });
          //console.log('going to create a new user ', newUser);
          User.createUser(newUser , function(err , new_user){
            if(err) throw err;
            console.log('new user created from google info',new_user);
            done(null , new_user);
          });
      }
  });
};

var instagramOpts = {
    clientID      : process.env.INSTAGRAM_CLIENT_ID,
    clientSecret  : process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL   : process.env.INSTAGRAM_CALLBACK_URL
  },
  instagramCallback = function(accessToken, refreshToken, profile, done){
    User.getOneExistingInstagramUser(profile.id, (err, user) => {
        if(err) throw err;
        if(user){
            console.log('pre existing instagram user ', user);
            done(null, user);
        }
        else
        {
            // create a new user
            var newUser = new User({
              name : profile.displayname,
              username : profile.displayname,
              email : '',
              password : '',
              socialInfo : [{
                  instagramId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user){
              if(err) throw err;
              console.log('new user created from instagram info',new_user);
              done(null , new_user);
            });
        }
    });
  };

var facebookOpts = {
    clientID      : process.env.FACEBOOK_CLIENT_ID,
    clientSecret  : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL   : process.env.FACEBOOK_CALLBACK_URL
  },
  facebookCallback = function(accessToken, refreshToken, profile, done){
    User.getOneExistingFacebookUser(profile.id, (err, user) => {
        if(err) throw err;
        if(user){
            console.log('pre existing facebook user ', user);
            done(null, user);
        }
        else
        {
            // create a new user
            var newUser = new User({
              name : profile.displayname,
              username : profile.displayname,
              email : '',
              password : '',
              socialInfo : [{
                  facebookId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user){
              if(err) throw err;
              console.log('new user created from facebook info',new_user);
              done(null , new_user);
            });
        }
    });
  };

var twitterOpts = {
    consumerKey      : process.env.TWITTER_CONSUMER_KEY,
    consumerSecret  : process.env.TWITTER_CONSUMER_SECRET,
    callbackURL   : process.env.TWITTER_CALLBACK_URL
  },
  twitterCallback = function(token, tokenSecret, profile, done){
    User.getOneExistingTwitterUser(profile.id, (err, user) => {
        if(err) throw err;
        if(user){
            console.log('pre existing twitter user ', user);
            done(null, user);
        }
        else
        {
            // create a new user
            console.log('tw profile',profile);
            var newUser = new User({
              name : profile.displayname,
              username : profile.displayname,
              email : '',
              password : '',
              socialInfo : [{
                  twitterId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user){
              if(err) throw err;
              console.log('new user created from twitter info',new_user);
              done(null , new_user);
            });
        }
    });
  };

pasport.use(new LocalStrategy(
  function(username, password, done) {
  console.log('begining Strategy username', username, 'password ', password);
  //console.log('trial' , User.findOne({username : username}));
  User.getUserByUsername(username, function(err, user){
  	if(err) throw err;
  	if(!user){
    console.log('------Strategy user :', user);
  		return done(null, false, {message: 'Unknown Username'});
  	}

  	User.comparePassword(password, user.password, function(err, isMatch){
  		if(err) throw err;
  		if(isMatch){
      console.log('------ continue Strategy user : ', user);
  			return done(null, user);
  		} else {
  			return done(null, false, {message: 'Invalid password'});
  		}
  	});
  });
}));

pasport.use(new GoogleStrategy(googleOpts,googleCallback));
pasport.use(new FacebookStrategy(facebookOpts,facebookCallback));
pasport.use(new TwitterStrategy(twitterOpts,twitterCallback));
pasport.use(new InstagramStrategy(instagramOpts,instagramCallback));
