'use strict';

require('dotenv').config();
const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session')

const app = express(),
    routes = require(process.cwd()+'/app/routes/index.js');

require(process.cwd()+'/app/config/passport.js')(passport);

mongoose.connect('mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB,
                { useMongoClient: true});

var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('connected to db')
});

app.set('view engine', 'pug')
app.use('/', express.static(process.cwd() + '/public'));
app.use('/', express.static(process.cwd() + '/semantic'));

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


app.listen('8080',function(){
    console.log('Node.js listening on port 8080');
});

