var express = require('express');
var app = express();
var http = require('http').Server(app);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var coockieParser = require('cookie-parser');
var session = require('express-session');
var pg = require('pg');

var env = process.env.NODE_ENV || 'dev';

require('./conf/' + env);

var dbConfig = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
};

var dbPool = new pg.Pool(dbConfig);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

dbPool.query('SELECT NOW() as "theTime"', function(err, result) {
  console.log('db connection success', result.rows[0].theTime);
});

http.listen((process.env.PORT), function () {
    console.log('http listening on *:', process.env.PORT);
});

dbPool.on('error', function(e, client) {
  console.log('DB error occured', e);
});
