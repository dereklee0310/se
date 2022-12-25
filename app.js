const path = require("path");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const passport = require("passport");
const strategy = require("passport-local");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { sql, pool } = require("./modules/db");
const app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const axios = require("axios");

const ensureAuthenticated = require("./modules/authen").ensureAuthenticated;

passport.use(
  new strategy(
    {
      usernameField: "account",
      passwordField: "password",
      // passReqtoCallback: true
    },
    function (account, password, done) {
      pool.query(
        `select * from user where email = '${account}'`,
        function (err, results) {
          if (err) return done(err);
          if (Object.keys(results).length === 0) return done(null, false);
          if (bcrypt.compareSync(password, results[0].password))
            //todo change this into async
            return done(null, results[0]);
          else return done(null, false);
        }
      );
    }
  )
);

app.use(
  session({
    secret: "roottoor",
    resave: "false",
    saveUninitialized: "false",
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.user_id);
});
passport.deserializeUser(function (id, done) {
  pool.query(
    `select * from user where user_id = '${id}'`,
    function (err, results) {
      if (err) return done(err);
      done(null, results[0]);
    }
  );
});

require("dotenv").config();

const account = require("./routes/account");
const home = require("./routes/index");
const upload = require("./routes/upload");
const history = require("./routes/history");
app.use("/account", account);
app.use("/home", home);
app.use("/upload", upload);
app.use("/history", history);
// start the server
// app.listen(process.env.APP_PORT, () => {
//   console.log(`Nodejs app listening on port ${process.env.APP_PORT}`);
// });

app.listen(50125, () => {
  console.log(`Nodejs app listening on port 50125`);
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

app.get("/test", (req, res) => {
  axios({
    method: "get",
    url: "http://140.123.105.112:50124/",
    // data: { "name": fileName }
  }).then(function (result) {
    // var data = result.data;
    // console.log(result.data);

    // res.redirect(url.format({
    //     pathname:"/upload/completed",
    //     query: {
    //         "left": String(data[0].left),
    //         "right": String(data[0].right)
    //     }
    // }));
    console.log(result);
  });
});

module.exports = app;
