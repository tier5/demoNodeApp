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

var request           = require('request');
var cheerio           = require('cheerio');
var cookies           = require('cookies');
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

/***********************SCRAPING DATA*********************************
    SETTING THE COOKIES OF A LOGED IN USER GIVES THE DOM ELEMENT OF THE LOGGED IN USER IN LINKEDIN
    BUT IN AN ENCRYPTED FORMAT

    STEP : GO TO THE APPLICATIONS SECTION IN THE CONSOLE FROM GOOGLE CHROME
    SEE THE COOKIES PARAMETERS PRESENT
    RUN : document.cookie IN THE CONSOLE AND GET THE COOKIES STRING
**********************************************************************/

let cookieData = '_ga=GA1.2.1021718127.1518800899; lang="v=2&lang=en-us"; visit="v=1&M"; bcookie="v=2&af8992d1-cd01-414d-8eaf-488dd72d6c2d"; _lipt=CwEAAAFhn53Q34en96VZdJmk3zdGvmwz78KuFamTNuhDWP6fhoYAYRKpTIIV_c09YN-RpSAcjvtN3VwF8Wm3K2nKTkuHWTAKDt2SVZqH_WV7QjcUNyKQmdxm3btWyqbeUAqNMsn6dmc86p8jxqsMQjgqbuACc5yMcKKSO-xvQNqbothy_Jmpqi-LrvfMr0fhg6Ks8NdRyaaoq1O2Iuywb-hw0AjTA70-ewXFdG5C29ptfbwCkHoInY4vxnfOUCgV2qHLOhW1NT1hxQ; JSESSIONID="ajax:4481313406036343443"; leo_auth_token="GST:9j0XytBkzBFDmQBLpBkXoyYNq6SGoQ-ADIKXY7vlOGSaC9Wdcj4wXl:1518801584:950a2ed1beb7ee4aa16568c1dc5c8210ff1349f8"; liap=true; sl="v=1&d_Ci-"; RT=s=1518803167521&r=https%3A%2F%2Fwww.linkedin.com%2Fuas%2Flogin%3FformSignIn%3Dtrue%26session_redirect%3D%252Fvoyager%252FloginRedirect.html%26one_time_redirect%3Dhttps%253A%252F%252Fwww.linkedin.com%252Fm%252Flogin%252F; _gat=1; lidc="b=VGST02:g=695:u=1:i=1518803171:t=1518889571:s=AQHlScPiQ-HMC7r9FWv4y0BUbFmmznH8"';

request('https://www.linkedin.com/mynetwork/', {headers: {Cookie: cookieData}}, function(err, res, body) {
    if(!err && res.statusCode == 200){

        //fetcing the html of the logged in user with the same cache
        //console.log(body);

        // cheerio module creates a jquery dom element from the fetched body
        // then we can manipulate the DOM
        // as well as we can fetch data from the DOM
        let $ = cheerio.load(body);
        console.log($);
        //let x = $('.mn-pymk-list__header').html();
        //var cookie = cookieParser.parseCookie(res.headers.cookie);
        //console.log(x);
    }
});
