const path = require("path");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { sql, pool } = require("./modules/db");
const passport = require("passport");
const strategy = require("passport-local");
const app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

require("dotenv").config();

const account = require("./routes/account");
const home = require("./routes/index");
const upload = require("./routes/upload");
const aboutus = require("./routes/aboutus");

app.use("/account", account);
app.use("/home", home);
app.use("/upload", upload);
app.use("/aboutus", aboutus);

// start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Nodejs app listening on port ${process.env.APP_PORT}`);
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

// redirect to home page
app.get("/", (req, res) => {
  res.redirect("/home");
});

//! original test for database operation!
app.get("/form", (req, res) => {
  // console.log(req.body);
  // res.sendFile(__dirname + '/index.html');
  res.render("test");
});

// app.get('/upload', (req, res) => {
//   res.render('upload')
// })

app.get("/records", (req, res) => {
  if (pool.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  pool.query("select * from upload_records", function (err, rows) {
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
  if (pool.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  pool.query(
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
  if (pool.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  pool.query(
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
  if (pool.state === "disconnected") {
    // return respond(null, { status: 'fail', message: 'server down'});
    console.log("Server is disconnected from database");
  }
  pool.query(
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
