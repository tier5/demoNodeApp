var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//SCHEMA DEFINATION OF USER
var UserSchema = mongoose.Schema({
  username : {
    type  : String,
    index : true
  },
  password : {
    type : String
  },
  email : {
    type : String
  },
  name : {
    type : String
  },
  socialInfo:[{
    googleId    : String,
    facebookId  : String,
    instagramId : String,
    githubId    : String,
    twitterId   : String,
    linkedinId  : String,
  }]
});

//EXPORTING THIS MONGOOSE MODULE AS A MODEL FOR OTHER PLACES IN THIS APPLICATION
var User  = module.exports = mongoose.model('User', UserSchema);


//CREATES AN USER FROM 'newUser' OBJECT RECEIVED
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

//FINDS AN USER BY USERNAME
module.exports.getUserByUsername = function(username, callback){
  var query = {username : username};
  User.findOne(query, callback);
}

//FINDS AN USER BY EMAIL
module.exports.getUserByEmail = function(email, callback){
  var query = {email : email};
  User.findOne(query, callback);
}

//FINDS AN USER BY ID
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

//COMPARE PPASSWORD OF AN EXISTING USER WITH A GIVEN PASSWORD
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  })
}

//GETS USER LOGGED IN WITH GOOGLE
module.exports.getOneExistingGoogleUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {googleId: id}}};
  User.findOne(query, callback);
}

//GETS USER LOGGED IN WITH FACEBOOK
module.exports.getOneExistingFacebookUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {facebookId: id}}};
  User.findOne(query, callback);
}

//GETS USER LOGGED IN WITH TWITTER
module.exports.getOneExistingTwitterUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {twitterId: id}}};
  User.findOne(query, callback);
}

//GETS USER LOGGED IN WITH INSTAGRAM
module.exports.getOneExistingInstagramUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {instagramId: id}}};
  User.findOne(query, callback);
}

//GETS USER LOGGED IN WITH GITHUB
module.exports.getOneExistingGithubUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {githubId: id}}};
  User.findOne(query, callback);
}

//GETS USER LOGGED IN WITH LINKEDIN
module.exports.getOneExistingLinkedinUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {linkedinId: id}}};
  User.findOne(query, callback);
}
