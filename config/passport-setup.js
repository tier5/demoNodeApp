const pasport           = require('passport');
const GoogleStrategy    = require('passport-google-oauth20');
const FacebookStrategy  = require('passport-facebook');
const TwitterStrategy   = require('passport-twitter');
const InstagramStrategy = require('passport-instagram');
const GithubStrategy    = require('passport-github').Strategy;
const LocalStrategy     = require('passport-local').Strategy;
const LinkedinStrategy  = require('passport-linkedin-oauth2').Strategy;

require('dotenv').config();

//requiring user from user model
var User    = require('../models/user');


//SERIALIZE AND DESERIALIZE USER ARE PASSPORT FUNCTIONALITIES THAT DEALS WITH
//THE CURRENT LOGGED IN USER OBJECT AND PASSES TO BROWSER COOKIE
//WE HAVE TO IMPLICITLY DEFINE THESE FUNCTIONS IN OUR PROGRAM

pasport.serializeUser((user, done) => {
  console.log('init serialize user');
    done(null, user.id);
});

pasport.deserializeUser((id, done) => {
  console.log('init de-serialize user');
    User.getUserById(id, function(err, user){
        if(err) throw err;
        console.log('completed de-serialize user');
        done(err, user);
    });
});

//USED FOR LOCAL LOGIN WITH GOOGLE AFTER LINKEDIN HITS OUR CALLBACK URL
//AND PASSPORT-LIBRARY BEGINS TO HANDLE DATA
//WE ALSO SAVE DATA TO OUR DATABASE HERE
var googleOpts = {
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK_URL
  },
  googleCallback = function(accessToken, refreshToken, profile, done) {
    //check if user already exists
    User.getOneExistingGoogleUser(profile.id, (err, user) => {
        if(err) throw err;

        if(user) {
            console.log('pre existing google user ', user);
            done(null, user);
        } else {
            // create a new user
            console.log('going to create a new user from google' , profile);
            var newUser = new User({
              name : profile.displayName,
              username : profile.displayName,
              email : '',
              password : '',
              socialInfo : [{
                  googleId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user) {
              if(err) throw err;
              console.log('new user created from google info',new_user);
              done(null , new_user);
            });
        }
    });
};

//USED FOR LOCAL LOGIN WITH INSTAGRAM AFTER LINKEDIN HITS OUR CALLBACK URL
//AND PASSPORT-LIBRARY BEGINS TO HANDLE DATA
//WE ALSO SAVE DATA TO OUR DATABASE HERE
var instagramOpts = {
    clientID      : process.env.INSTAGRAM_CLIENT_ID,
    clientSecret  : process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL   : process.env.INSTAGRAM_CALLBACK_URL
  },
  instagramCallback = function(accessToken, refreshToken, profile, done) {
    User.getOneExistingInstagramUser(profile.id, (err, user) => {
        if(err) throw err;

        if(user) {
            console.log('pre existing instagram user ', user);
            done(null, user);
        }else {
          console.log('going to create a new user from instagram' , profile);
            // create a new user
            var newUser = new User({
              name : profile.displayName,
              username : profile.username,
              email : '',
              password : '',
              socialInfo : [{
                  instagramId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user) {
              if(err) throw err;
              console.log('new user created from instagram info',new_user);
              done(null , new_user);
            });
        }
    });
  };

//USED FOR LOCAL LOGIN WITH FACEBOOK AFTER LINKEDIN HITS OUR CALLBACK URL
//AND PASSPORT-LIBRARY BEGINS TO HANDLE DATA
//WE ALSO SAVE DATA TO OUR DATABASE HERE
var facebookOpts = {
    clientID      : process.env.FACEBOOK_CLIENT_ID,
    clientSecret  : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL   : process.env.FACEBOOK_CALLBACK_URL
  },
  facebookCallback = function(accessToken, refreshToken, profile, done) {
    User.getOneExistingFacebookUser(profile.id, (err, user) => {
        if(err) throw err;

        if(user) {
            console.log('pre existing facebook user ', user);
            done(null, user);
        }else {
            // create a new user
            console.log('going to create a new user from facebook' , profile);
            var newUser = new User({
              name : profile.displayName,
              username : profile.displayName,
              email : '',
              password : '',
              socialInfo : [{
                  facebookId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user) {
              if(err) throw err;
              console.log('new user created from facebook info',new_user);
              done(null , new_user);
            });
        }
    });
  };

//USED FOR LOCAL LOGIN WITH GITHUB AFTER LINKEDIN HITS OUR CALLBACK URL
//AND PASSPORT-LIBRARY BEGINS TO HANDLE DATA
//WE ALSO SAVE DATA TO OUR DATABASE HERE
var githubOpts = {
    clientID      : process.env.GITHUB_CLIENT_ID,
    clientSecret  : process.env.GITHUB_CLIENT_SECRET,
    callbackURL   : process.env.GITHUB_CALLBACK_URL
  },
  githubCallback = function(accessToken, refreshToken, profile, done){
    //console.log('in callback func' , profile);
    User.getOneExistingGithubUser(profile.id, (err, user) => {
      //console.log('profile info obtained from github : ', profile);
        if(err) {
          console.log('this error');
          throw err;
        }

        if(user){
            console.log('pre existing github user ', user);
            done(null, user);
        }else {
            // create a new user
            console.log('going to create a new user from github' , profile);
            var newUser = new User({
              name : profile.displayName,
              username : profile.username,
              email : '',
              password : '',
              socialInfo : [{
                  githubId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user){
              if(err) throw err;
              console.log('new user created from github info',new_user);
              done(null , new_user);
            });
        }
    });
};

//USED FOR LOCAL LOGIN WITH TWITTER AFTER LINKEDIN HITS OUR CALLBACK URL
//AND PASSPORT-LIBRARY BEGINS TO HANDLE DATA
//WE ALSO SAVE DATA TO OUR DATABASE HERE
var twitterOpts = {
    consumerKey     : process.env.TWITTER_CONSUMER_KEY,
    consumerSecret  : process.env.TWITTER_CONSUMER_SECRET,
    callbackURL     : process.env.TWITTER_CALLBACK_URL
  },
  twitterCallback = function(token, tokenSecret, profile, done){
    User.getOneExistingTwitterUser(profile.id, (err, user) => {
        if(err) throw err;

        if(user) {
            console.log('pre existing twitter user ', user);
            done(null, user);
        }else {
            // create a new user
            console.log('going to create a new user from twiter' , profile);
            console.log('tw profile',profile);
            var newUser = new User({
              name : profile.displayName,
              username : profile.username,
              email : '',
              password : '',
              socialInfo : [{
                  twitterId : profile.id
              }]
            });
            //console.log('going to create a new user ', newUser);
            User.createUser(newUser , function(err , new_user) {
              if(err) throw err;
              console.log('new user created from twitter info',new_user);
              done(null , new_user);
            });
        }
    });
  };

//USED FOR LOCAL LOGIN WITH LINKEDIN AFTER LINKEDIN HITS OUR CALLBACK URL
//AND PASSPORT-LIBRARY BEGINS TO HANDLE DATA
//WE ALSO SAVE DATA TO OUR DATABASE HERE
var linkedinOpts  = {
      clientID      : process.env.LINKEDIN_CLIENT_ID,
      clientSecret  : process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL   : process.env.LINKEDIN_CALLBACK_URL,
      scope         : ['r_basicprofile','r_emailaddress', 'rw_company_admin', 'w_share'],
    },
    linkedinCallback = function(accessToken, refreshToken, profile, done){
      User.getOneExistingLinkedinUser(profile.id, (err, user) => {
          if(err) throw err;

          if(user){
              console.log('pre existing linkedin user ', user);
              done(null, user);
          }else {
              // create a new user
              console.log('going to create a new user from linkedin' , profile);
              console.log('Li profile',profile);
              var newUser = new User({
                name : profile.displayName,
                username : profile.username,
                email : '',
                password : '',
                socialInfo : [{
                    linkedId : profile.id
                }]
              });
              //console.log('going to create a new user ', newUser);
              User.createUser(newUser , function(err , new_user) {
                if(err) throw err;
                console.log('new user created from linkedin info',new_user);
                done(null , new_user);
              });
          }
      });
    }

//USED FOR LOCAL LOGIN WITH OUT ANY SOCIAL MEDIA
pasport.use(new LocalStrategy(
  function(username, password, done) {
  console.log('begining Strategy username', username, 'password ', password);
    User.getUserByUsername(username, function(err, user){
    	if(err) throw err;

      if(!user) {
          console.log('------Strategy user :', user);
    		  return done(null, false, {message: 'Unknown Username'});
  	  }else {
          User.comparePassword(password, user.password, function(err, isMatch){
        		if(err) throw err;

        		if(isMatch) {
            console.log('------ continue Strategy user : ', user);
        			return done(null, user);
        		}else {
        			return done(null, false, {message: 'Invalid password'});
        		}
        	});
      }
  });
}));

//SET OF ALL PASSPORT STRATEGIES
pasport.use(new GoogleStrategy(googleOpts,googleCallback));
pasport.use(new FacebookStrategy(facebookOpts,facebookCallback));
pasport.use(new TwitterStrategy(twitterOpts,twitterCallback));
pasport.use(new InstagramStrategy(instagramOpts,instagramCallback));
pasport.use(new GithubStrategy(githubOpts,githubCallback));
pasport.use(new LinkedinStrategy(linkedinOpts,linkedinCallback));
