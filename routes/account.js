const { config } = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require("passport");
const strategy = require("passport-local");

const {sql, pool} = require('../modules/db');

passport.use(new strategy(
  // 當請 passport 用此驗證機制驗證時，處理驗證邏輯的 code...
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqtoCallback: true
  },
  function(username, password, done) {
    pool.query(
      `select password from users where account = '${username}'`,
      function (err, results) {
        if (err)
          throw err;
        if (Object.keys(results).length === 0) {
          res.render('login', {msg: 'failed'})
          return
        }
  
        if (bcrypt.compareSync(password, results[0].password)) //todo change this into async
          res.redirect('/');
        else
          res.redirect('login?loginFailed=true')
      }
    );
  }
))

// these router are under the path /account/...
router.get("/", (req, res) => {
  res.redirect("/account/login");
});

router.get("/login", (req, res) => {
  if (req.query.loginFailed === 'true')
    res.render('login', {msg: 'failed'});
  else
    res.render('login')
});

router.post("/login", (req, res) => {
  pool.query(
    `select password from users where account = '${req.body.account}'`,
    function (err, results) {
      if (err)
        throw err;
      if (Object.keys(results).length === 0) {
        res.render('login', {msg: 'failed'})
        return
      }

      if (bcrypt.compareSync(req.body.password, results[0].password)) //todo change this into async
        res.redirect('/');
      else
        res.redirect('login?loginFailed=true')
    }
  );
});

router.get("/signup", (req, res) => {
  res.send("for signup");
});

router.post("/signup", (req, res) => {
  hash_val = bcrypt.hashSync(req.body.password, 10); //todo change this into async
  pool.query(
    "insert into users" +
      ` values(default, '${req.body.account}', '${hash_val}', '${req.body.first_name}', '${req.body.last_name}', curdate(), default)`,
    function (err, results) {
      if (err) {
        throw err;
      }
      // console.log(results);
      // console.log(bcrypt.compareSync(req.body.password, hash_val));
      res.json(results);
    }
  );
});

router.get("/recover", (req, res) => {
  res.render("recover"); //todo
});

router.get("/password", (req, res) => {
  res.render("password");
});

router.get("/register", (req, res) => {
  res.render("register"); //todo
});

router.get("/personal_info", (req, res) => {
  res.render("personal_info"); //todo
});

module.exports = router;
