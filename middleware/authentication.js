var express       = require('express');
require('dotenv').config();


	var ensureAuthenticated = function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		} else {
			req.flash('error_msg','You are not logged in');
			res.redirect('/users/login');
		}
	}

	var ensureNotAuthenticated = function(req, res, next){
		if(!req.isAuthenticated()){
			return next();
		} else {
			req.flash('error_msg','You are already logged in');
			res.redirect('/users/register');
		}
	}

	module.exports = {
		ensureAuthenticated : ensureAuthenticated ,
		ensureNotAuthenticated : ensureNotAuthenticated
	}
