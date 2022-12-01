/*
 * @Author: Derek Lee dereklee0310@gmail.com
 * @Date: 2022-11-25 12:19:36
 * @LastEditors: Derek Lee dereklee0310@gmail.com
 * @LastEditTime: 2022-11-30 14:16:50
 * @FilePath: /se_test/app.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Derek Lee dereklee0310@gmail.com, All Rights Reserved. 
 */

const path = require('path');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// start the server
const app_port = 3000 // port for nodejs server
app.listen(app_port, () => {
  console.log(`Nodejs app listening on port ${app_port}`);
});

// create connection object
const db_port = 3306;
var con = mysql.createConnection({
  host: "localhost",  
  port: db_port, // default port for mysql server
  user: "root", // mysql user name
  password: "group10", // mysql password
  database: "se" // database name
});

// call connect method
con.connect(function(err) {
  if (err)
    return console.error('error: ' + err.message);
  console.log(`Connected to the MySQL server on port ${db_port}`);
});

// home page (submit)
app.get('/', (req, res) => {
  // res.render('test')
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  // res.render('test')
  // res.render('backup')
  res.render('login')
})

// submit page for testing
app.post('/form', (req, res) => {
  console.log(req.body);
  // res.sendFile(__dirname + '/index.html');
  res.render('test')
})


app.get('/records', (req, res) => {
  if(con.state === 'disconnected'){
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log('Server is disconnected from database')
  }
  con.query( 'select * from upload_records' , 
    function(err, rows) {
      //callback function
      console.log(rows)
      // console.log(err)
      // 釋放連線
      // connection.release();

      res.json(rows)
  });
  // res.sendFile(__dirname + '/tmp.html');
})

app.post('/create', (req, res) => {
  if(con.state === 'disconnected'){
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log('Server is disconnected from database');
  }
  con.query('insert into upload_records' + ` values('${req.body.name}', '${req.body.age}', '${req.body.gender}', '${req.body.location}', '${req.body.time}')`,
  function(err, results){
    if (err){ 
      throw err;
    }
    console.log(results)
    res.json(results)
  })
  // res.sendFile(__dirname + '/tmp.html');
})

app.get('/search', (req, res) => {
  if(con.state === 'disconnected'){
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log('Server is disconnected from database');
  }
  con.query(`select * from upload_records where Name = '${req.query.person}'`,
  function(err, results){
    if (err){ 
      throw err;
    }
    // console.log(results)
    res.json(results)
  });
  res.sendFile(__dirname + '/tmp.html');
})

app.post('/delete', (req, res) => {
  if(con.state === 'disconnected'){
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log('Server is disconnected from database');
  }
  con.query(`delete from upload_records where Name = '${req.body.person}'`,
  function(err, results){
    if (err){ 
      throw err;
    }
    // console.log(results)
    res.json(results)
  });
  // res.sendFile(__dirname + '/tmp.html');
})

app.get('/pug', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
})