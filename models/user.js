var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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
  }]
});

var User  = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
  var query = {username : username};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  })
}

module.exports.getOneExistingGoogleUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {googleId: id}}};
  User.findOne(query, callback);
}

module.exports.getOneExistingFacebookUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {facebookId: id}}};
  User.findOne(query, callback);
}

module.exports.getOneExistingTwitterUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {twitterId: id}}};
  User.findOne(query, callback);
}

module.exports.getOneExistingInstagramUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {instagramId: id}}};
  User.findOne(query, callback);
}

module.exports.getOneExistingGithubUser = function(id , callback){
  var query = {socialInfo: {$elemMatch : {githubId: id}}};
  User.findOne(query, callback);
}
