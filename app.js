/*
 * @Author: Derek Lee dereklee0310@gmail.com
 * @Date: 2022-11-25 12:19:36
 * @LastEditors: Derek Lee dereklee0310@gmail.com
 * @LastEditTime: 2022-11-27 18:23:06
 * @FilePath: /se_test/app.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Derek Lee dereklee0310@gmail.com, All Rights Reserved. 
 */
const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const { json } = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "localhost",  
  // port: 8889,
  user: "root",
  password: "1234",
  database: "test"
});

con.connect(function(err) {
  console.log('enter')
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});


// app.use("/", (req, res, next)=>{
//   next();
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/form', (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + '/index.html');
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
  });
  res.sendFile(__dirname + '/tmp.html');
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