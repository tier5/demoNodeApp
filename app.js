var express       = require('express');
require('dotenv').config();
var path          = require('path');
var cookieParser  = require('cookie-parser');
//var cookieSession = require('cookie-session');
var bodyParser    = require('body-parser');
var exphbs        = require('express-handlebars');
var expressValidator  = require('express-validator');
var flash             = require('connect-flash');
var session           = require('express-session');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var mongo             = require('mongodb');
var mongoose          = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db                = mongoose.connection;
var routes            = require('./routes/index');
var users             = require('./routes/users');
//var env               = require('node-env-file');
//Init App
var app               = express();
console.log('env port = ',process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');


// bodyParser MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cookieSession({
//   maxAge: 24*60*60*100,
//   keys: process.env.SESSION_KEY
// }));

//EXPRESS SESSION
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//PASSPORT INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS VALIDATOR
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    }
  }
}));

//CONNECT FLASH
app.use(flash());

//GLOBAL VARIABLES
app.use(function(req,res,next){
  res.locals.sucess_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//SET PORT
app.use('/',routes);
app.use('/users',users);

app.set('port', process.env.PORT || 3010);
app.listen(app.get('port'), function(){
  console.log('Server started on port : ', app.get('port'));
});
