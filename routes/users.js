var express   = require('express');
var router    = express.Router();
var passport  = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var PassportSetup = require('../config/passport-setup');
var authentication = require('../middleware/authentication');


var User    = require('../models/user');
//Get registration route
router.get('/register', authentication.ensureNotAuthenticated, function(req,res){
  res.render('register');
});

//Get login route
router.get('/login', authentication.ensureNotAuthenticated ,function(req,res){
  res.render('login');
});

//register an user
router.post('/register', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash: true }), function(req,res){
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
  if(errors){
    res.render('register',{
      errors:errors
    });
  }else{
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
  }
  console.log(name);
});


router.get('/login/googleAuth', passport.authenticate('google',{
  scope: ['profile']
}));

router.get('/login/facebookAuth', passport.authenticate('facebook',{
  scope: ['profile']
}));

router.get('/login/twitterAuth', passport.authenticate('twitter',{
  scope: ['profile']
}));

router.get('/login/instagramAuth', passport.authenticate('instagram'));

//callback route for google to redirect to

router.get('/google/login/callback', passport.authenticate('google'), (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

//callback route for facebook to redirect to

router.get('/facebook/login/callback', passport.authenticate('facebook') , (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

//callback route for twitter to redirect to

router.get('/twitter/login/callback', passport.authenticate('twitter') , (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

//callback route for instagram to redirect to

router.get('/instagram/login/callback', passport.authenticate('instagram') , (req, res) => {
  console.log(req.user);
  //res.send('You reached a callback uri user : '+req.user);
  res.redirect('/');
});

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     console.log('begining Strategy username', username, 'password ', password);
//     //console.log('trial' , User.findOne({username : username}));
//    User.getUserByUsername(username, function(err, user){
//    	if(err) throw err;
//    	if(!user){
//       console.log('------Strategy user :', user);
//    		return done(null, false, {message: 'Unknown Username'});
//    	}
//
//    	User.comparePassword(password, user.password, function(err, isMatch){
//    		if(err) throw err;
//    		if(isMatch){
//         console.log('------ continue Strategy user : ', user);
//    			return done(null, user);
//    		} else {
//    			return done(null, false, {message: 'Invalid password'});
//    		}
//    	});
//    });
//   }));

  // passport.serializeUser(function(user, done) {
  //   console.log('serializing : ',user);
  //   done(null, user.id);
  // });
  //
  // passport.deserializeUser(function(id, done){
  //   console.log('de-serializing : ',id);
  //   User.getUserById(id, function(err, user){
  //     done(err, user);
  //   });
  // });

// router.post('/login', function(req, res){
//   console.log('login attempt');
// });

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
// router.post('/login',
// passport.authenticate('local',{successRedirect: '/', failureRedirect:'/users/login',  failureFlash: true}),
// function(req, res){
//   console.log('sucessfully logged in!');
//   res.redirect('/');
// });

module.exports= router;
