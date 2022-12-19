const { config } = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require("passport");
const strategy = require("passport-local");

const bodyParser = require('body-parser');
const session = require('express-session')

const {sql, pool} = require('../modules/db');

const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated())
//     return next()
//   res.redirect('/account/login/?loginNeeded=true')
// }

passport.use(new strategy({
    usernameField: 'account',
    passwordField: 'password',
    // passReqtoCallback: true
  },
  function(account, password, done) {
    pool.query(
      `select password from users where account = '${account}'`,
      function (err, results) {
        if (err)
          return done(err);
        if (Object.keys(results).length === 0) {
          return done(null, false)
        }
  
        if (bcrypt.compareSync(password, results[0].password)) //todo change this into async
          return done(null, results[0])
        else
          return done(null, false)
      }
    );
  }
))

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

router.use(session({
  secret: 'roottoor',
  resave: 'false',
  saveUninitialized: 'false'
}))

router.use(bodyParser.urlencoded({ extended: true }));
router.use(passport.initialize())
router.use(passport.session())

// these router are under the path /account/...
router.get("/", (req, res) => {
  res.redirect("/account/login");
});

router.get("/login", (req, res) => {
  // console.log(req.session.status)
  if (req.query.loginFailed === 'true')
  // if(req.session.status === 'loginFailed')
    res.render('login', {msg: 'loginFailed'});
  else if (req.query.loginNeeded === 'true')
    res.render('login', {msg: 'loginNeeded'})
  else
    res.render('login')
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/account/login?loginFailed=true'
  // failureRedirect: '/account/login'
}))

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

router.get("/password", ensureAuthenticated, (req, res) => {
  res.render("password");
});

router.get("/signup", (req, res) => {
  res.render("signup"); //todo
});

router.get("/info", ensureAuthenticated, (req, res) => {
  res.render("info"); //todo
});

router.get('/logout', ensureAuthenticated, function(req, res, next) {
  req.logOut(function(err) {
    if(err)
      return next(err);
    res.redirect('/') //todo test this
  })
})

module.exports = router;
