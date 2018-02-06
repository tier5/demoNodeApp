var express   = require('express');
var router    = express.Router();
var passport  = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function checkUser(req, res, next) {
  var _ = require('underscore')
      , nonSecurePaths = ['/about', '/contact'];

  if ( _.contains(nonSecurePaths, req.path) ) return next();

  //authenticate user
  next();
}

module.exports = {
    formHandler: function(req, res, next){...}
}
