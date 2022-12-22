const { config } = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require("passport");
const strategy = require("passport-local");

const bodyParser = require('body-parser');
// const session = require('express-session')
const {sql, pool} = require('../modules/db');
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated())
//     return next()
//   res.redirect('/account/login/?loginNeeded=true')
// }

// passport.use(new strategy({
//     usernameField: 'account',
//     passwordField: 'password',
//     // passReqtoCallback: true
//   },
//   function(account, password, done) {
//     pool.query(
//       `select * from user where email = '${account}'`,
//       function (err, results) {
//         if (err)
//           return done(err);
//         if (Object.keys(results).length === 0) {
//           return done(null, false)
//         }
  
//         if (bcrypt.compareSync(password, results[0].password))//todo change this into async
//           return done(null, results[0])
//         else
//           return done(null, false)
//       }
//     );
//   }
// ))

// passport.serializeUser(function(user, done) {
//   done(null, user.user_id);
// })

// passport.deserializeUser(function(id, done) {
//   pool.query(
//     `select * from user where user_id = '${id}'`,
//     function (err, results) {
//       if (err)
//         return done(err);
//       done(null, results[0]);
//     }
//   );
// })

// router.use(session({
//   secret: 'roottoor',
//   resave: 'false',
//   saveUninitialized: 'false'
// }))

// router.use(bodyParser.urlencoded({ extended: true }));
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
  else if (req.query.login === 'false')
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
  pool.query(
    `select user_id from user where email = '${req.body.email}'`,
    function (err, results) {
      if (err)
        res.send('oooops....')

      if (Object.keys(results).length !== 0) {
        res.redirect('/account/signup?signupFailed=true')
        return
      }
      hash_val = bcrypt.hashSync(req.body.password, 10); //todo change this into async
      pool.query(
        // todo modify this
        "insert into user" +
          ` values(NULL, '${req.body.first_name}', '${req.body.last_name}', '${req.body.email}', '${hash_val}', '${req.body.pid}', '${req.body.gender}', '${req.body.birth}', default)`,
        function (err, results) {
          if (err) {
            throw err;
          }
          // console.log(results);
          // console.log(bcrypt.compareSync(req.body.password, hash_val));
          // res.json(results);
          res.redirect('/home/?login=true')
        }
      );
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
  user = req.user
  if (user.gender === 'male')
    gender = '男'
  else if (user.gender === 'female')
    gender = '女'
  else
    gender = '第三性別'
  res.render("info", {first_name: user.first_name, last_name: user.last_name, email: user.email, pid: user.pid, gender: gender, birth: user.birth});
  // res.render("info"); //todo
});

router.get('/logout', ensureAuthenticated, function(req, res, next) {
  req.logOut(function(err) {
    if(err)
      return next(err);
    res.redirect('/') //todo test this
  })
})

module.exports = router;
