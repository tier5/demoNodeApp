var express   = require('express');
var router    = express.Router();
var passport  = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var PassportSetup = require('../config/passport-setup');

//IMPORTING CUSTOM MADE MIDDLEWARE
var authentication = require('../middleware/authentication');
var User    = require('../models/user');

router.get('/register', authentication.ensureNotAuthenticated, function(req,res){
  res.render('register');
});

router.get('/login', authentication.ensureNotAuthenticated ,function(req,res){
  res.render('login');
});

//register an user
router.post('/register', function(req,res){
  var name      = req.body.name;
  var email     = req.body.email;
  var username  = req.body.username;
  var password  = req.body.password;
  var password2 = req.body.password2;
  var socialInfo= [{}];

  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  //CHECKING VALIDATION ERRORS AT THE BEGINING
  if(errors){
    res.render('register',{
      errors:errors
    });
  }else {

    //IF THIS USER NAME OR EMAIL EXISTS DONT ALLOW REGISTER
    //FIRST WE GET THE USER WITH THE USER NAME
    User.getUserByUsername(username, function(err, user) {
      if(err) throw err;

      //IF NO USER IS FOUND PROCEED TO CHECKING WIT THE EMAIL
      if(!user) {
        User.getUserByEmail(email, function(err, user) {
          if(err) throw err;

          //IF NO USER IS FOUND WITH THIS EMAIL THEN THIS USER IS FREE TO BE CREATED
          if(!user) {

              //CREATING A NEW USER WITH OBTAINED CREDENTIALS
              var newUser = new User({
                name : name,
                email: email,
                username : username,
                password : password,
                socialInfo : {}
              });
              console.dir('user to be created : ',newUser);
              User.createUser(newUser , function(err , user){
                if(err) throw err;
                console.log('new registered user ', user);
              });
              req.flash('success_msg', 'You are now registered and can login!');
              res.redirect('/');
          }else {
              return done(null, false, {message: 'Email already exists!'});
          }

        });
      }else {
        return done(null, false, {message: 'User already exists!'});
      }
    });

  }
  console.log(name);
});

//INITIAL ROUTE TO GOOGLE LOGIN
router.get('/login/googleAuth', passport.authenticate('google',{
  scope: ['profile']
}));

//INITIAL ROUTE TO FACEBOOK LOGIN
router.get('/login/facebookAuth', passport.authenticate('facebook'));

//INITIAL ROUTE TO GITHUB LOGIN
router.get('/login/githubAuth', passport.authenticate('github',{
  scope: ['profile']
}));

//INITIAL ROUTE TO TWITTER LOGIN
router.get('/login/twitterAuth', passport.authenticate('twitter',{
  scope: ['profile']
}));

//INITIAL ROUTE TO INSTAGRAM LOGIN
router.get('/login/instagramAuth', passport.authenticate('instagram'));

//INITIAL ROUTE TO LINKEDIN LOGIN
router.get('/login/linkedinAuth', passport.authenticate('linkedin',{
  scope: ['r_basicprofile','r_emailaddress', 'rw_company_admin', 'w_share']
}));

//CALLBACK URL FOR GOOGLE TO COMMUNICATE WITH O-AUTH2 PROTOCOL
router.get('/google/login/callback', passport.authenticate('google'), (req, res) => {
  console.log(req.user);
  res.redirect('/');
});

//CALLBACK URL FOR FACEBOOK TO COMMUNICATE WITH O-AUTH2 PROTOCOL
router.get('/facebook/login/callback', passport.authenticate('facebook') , (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

//CALLBACK URL FOR FACEBOOK TO COMMUNICATE WITH O-AUTH2 PROTOCOL
router.get('/twitter/login/callback', passport.authenticate('twitter') , (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

//CALLBACK URL FOR INSTAGRAM TO COMMUNICATE WITH O-AUTH2 PROTOCOL
router.get('/instagram/login/callback', passport.authenticate('instagram') , (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

//CALLBACK URL FOR GITHUB TO COMMUNICATE WITH O-AUTH2 PROTOCOL
router.get('/github/login/callback', passport.authenticate('github') , (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

//CALLBACK URL FOR LINKEDIN TO COMMUNICATE WITH O-AUTH2 PROTOCOL
router.get('/linkedin/login/callback', passport.authenticate('linkedin') , (req, res) => {
  console.log(req.user);
  res.redirect('/');
});


//POST REQUEST FOR LOGIN COMES HERE
//PASSPORT HANDLES OUR LOGIN FUNCTIONALITY AS PER WE DEFINED THE HANDLER
router.post('/login', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash: true }),
function(req, res){
  console.log('sucessfully logged in!');
  res.redirect('/');
});

router.get('/logout', authentication.ensureAuthenticated , function(req, res){
  console.log('logout attempt');
  req.logout();
  req.flash('success_msg', 'You are logged out!');
  res.redirect('/users/login');
});

module.exports= router;
