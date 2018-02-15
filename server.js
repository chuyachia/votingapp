'use strict';

const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session')

const app = express(),
    routes = require(process.cwd()+'/app/routes/index.js');

require(process.cwd()+'/app/config/passport.js')(passport);

mongoose.connect('mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB,
                { useMongoClient: true});

var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('connected to db')
});
app.set('view engine', 'pug')
app.use('/', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
	secret: 'votingAppSecret',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app,passport)


var listener = app.listen('3000', function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
