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

const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const app = express()
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }));

// start the server
const port = 3000 // port for nodejs server
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

// create connection object
var con = mysql.createConnection({
  host: "localhost",  
  port: 3306, // default port for mysql server
  user: "root", // mysql user name
  password: "1234", // mysql password
  database: "test" // database name
});

// call connect method
con.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
});

// home page (submit)
app.get('/', (req, res) => {
  res.render('test')
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
  con.query( 'select * from Patients' , 
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
  con.query('insert into Patients' + ` values('${req.body.name}', '${req.body.age}', '${req.body.gender}', '${req.body.location}', '${req.body.time}')`,
  function(err, results){
    if (err){ 
      throw err;
    }
    console.log(results)
  })
  res.sendFile(__dirname + '/tmp.html');
})

app.get('/search', (req, res) => {
  if(con.state === 'disconnected'){
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log('Server is disconnected from database');
  }
  console.log(`select * from Patients where Name = '${req.query.person}'`);
  con.query(`select * from Patients where Name = '${req.query.person}'`,
  function(err, results){
    if (err){ 
      throw err;
    }
    console.log(results)
  });
  res.sendFile(__dirname + '/tmp.html');
})

app.post('/delete', (req, res) => {
  if(con.state === 'disconnected'){
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log('Server is disconnected from database');
  }
  con.query(`delete from Patients where Name = '${req.body.person}'`,
  function(err, results){
    if (err){ 
      throw err;
    }
    console.log(results)
  });
  res.sendFile(__dirname + '/tmp.html');
})

app.get('/pug', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
})