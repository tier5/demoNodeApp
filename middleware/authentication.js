var express       = require('express');
require('dotenv').config();

	//IF AUTHENTCATED THEN ONLY THE USERS ARE ALLOWED TO GO TO THE NEXT URL IN STACK
	//ELSE THEY ARE REDIRECTED TO LOGIN PAGE
	var ensureAuthenticated = function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		} else {
			req.flash('error_msg','You are not logged in');
			res.redirect('/users/login');
		}
	}

	//IF NOT-AUTHENTCATED THEN ONLY THE USERS ARE ALLOWED TO GO TO THE NEXT URL IN STACK
	//ELSE THEY ARE REDIRECTED TO HOME AS A LOGGEDIN USER
	var ensureNotAuthenticated = function(req, res, next){
		if(!req.isAuthenticated()){
			return next();
		} else {
			req.flash('error_msg','You are already logged in');
			res.redirect('/');
		}
	}

	//EXPORTING BOTH OF THE ABOVE FUNCTIONS AS MIDDLEWARE
	module.exports = {
		ensureAuthenticated : ensureAuthenticated ,
		ensureNotAuthenticated : ensureNotAuthenticated
	}
