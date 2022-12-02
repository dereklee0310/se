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

const path = require("path");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

require("dotenv").config();

const account = require('./routes/account');
const home = require('./routes/index');

app.use('/account', account);
app.use('/home', home)

// start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Nodejs app listening on port ${process.env.APP_PORT}`);
});

// create connection to db
var con = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.DB_PORT, // default port for mysql server
  user: process.env.DB_USER, // mysql user name
  password: process.env.DB_PWD, // mysql password
  database: process.env.DB, // database name
});

// call connect method
con.connect(function (err) {
  if (err) return console.error("error: " + err.message);
  console.log(`Connected to the MySQL server on port ${process.env.DB_PORT}`);
});


/* the code here is for error handling, not implemented yet*/
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// redirect to login page
app.get("/", (req, res) => {
  res.redirect("/account");
});

//! original test for database operation!
app.get("/form", (req, res) => {
  // console.log(req.body);
  // res.sendFile(__dirname + '/index.html');
  res.render("test");
});

app.post("/change_pwd", (req, res) => {
  //! need to access database
  //! should use a popout instead of new page
  res.render("recover_success");
});

app.get("/records", (req, res) => {
  if (con.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  con.query("select * from upload_records", function (err, rows) {
    //callback function
    console.log(rows);
    // console.log(err)
    // 釋放連線
    // connection.release();

    res.json(rows);
  });
  // res.sendFile(__dirname + '/tmp.html');
});

app.post("/create", (req, res) => {
  if (con.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  con.query(
    "insert into upload_records" +
      ` values('${req.body.name}', '${req.body.age}', '${req.body.gender}', '${req.body.location}', '${req.body.time}')`,
    function (err, results) {
      if (err) {
        throw err;
      }
      console.log(results);
      res.json(results);
    }
  );
  // res.sendFile(__dirname + '/tmp.html');
});

app.get("/search", (req, res) => {
  if (con.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  con.query(
    `select * from upload_records where Name = '${req.query.person}'`,
    function (err, results) {
      if (err) {
        throw err;
      }
      // console.log(results)
      res.json(results);
    }
  );
  res.sendFile(__dirname + "/tmp.html");
});

app.post("/delete", (req, res) => {
  if (con.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  con.query(
    `delete from upload_records where Name = '${req.body.person}'`,
    function (err, results) {
      if (err) {
        throw err;
      }
      // console.log(results)
      res.json(results);
    }
  );
  // res.sendFile(__dirname + '/tmp.html');
});

module.exports = app;
