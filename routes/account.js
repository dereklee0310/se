const { config } = require('dotenv');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const {sql, pool} = require('../modules/db');
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;
const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'parkinson.se.test@gmail.com',
    pass: 'scrzlvgdmnomvgtu'
  }
});

router.get('/', (req, res) => {
  res.redirect('/account/login');
});

router.get('/login', (req, res) => {
  if (req.query.failed === 'true')
    res.render('login', {msg: 'failed'});
  else if (req.query.required === 'true')
    res.render('login', {msg: 'required'});
  else if (req.query.signupSuccess === 'true')
      res.render('login', {msg: 'signupSuccess'});
  else if (req.query.recover === 'true')
      res.render('login', {msg: 'recover'})
  else
    res.render('login');
}); 

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home/?login=true',
  failureRedirect: '/account/login?failed=true'
}))

router.get('/signup', (req, res) => {
  if (req.query.failed === 'true')
    res.render('signup', {msg: 'failed', user: req.user})
  else
    res.render('signup', {user: req.user});
});

router.post('/signup', (req, res) => {
  pool.query(
    `select user_id from user where email = "${req.body.email}"`,
    function (err, results) {
      if (err)
        throw err
      if (Object.keys(results).length !== 0) {
        res.redirect('/account/signup?failed=true')
        return
      }
      hash_val = bcrypt.hashSync(req.body.password, 10); //todo change this into async
      pool.query(
        'insert into user' +
        ` values(NULL, "${req.body.name}", "${req.body.email}", "${hash_val}", "${req.body.pid}", "${req.body.gender}", "${req.body.birth}", default)`,
        function (err, results) {
          if (err)
            throw err;
          res.redirect('/account/login?signupSuccess=true')
        }
      );
    }
  );
});

router.get('/recover', (req, res) => {
  if (req.query.recoverFailed === 'true')
    res.render('recover', {msg: 'recoverFailed'})
  else
    res.render('recover');
});

router.post('/recover', (req, res) => {
  pool.query(`select * from user where email = '${req.body.email}'`, function (err, results) {
    if (err)
      throw err
    if (Object.keys(results).length === 0) {
      res.redirect('/account/recover?recoverFailed=true')
      return
    }
    var password = Math.random().toString(36).slice(-8);
    hash_val = bcrypt.hashSync(password, 10); //todo change this into async
    pool.query(`update user set password = "${hash_val}" where user_id = "${results[0].user_id}"`, function (err, results) {  // only double quote work here
      if(err)
        throw err
      var mailOptions = {
        from: 'parkinson.se.test@gmail.com',
        to: `${req.body.email}`,
        subject: '帕金森氏症雲端檢測服務平台密碼重設',
        text: `您的密碼已被重設為: ${password}，請在登入後盡快修改!`
      };
      transporter.sendMail(mailOptions, function(err, info) {
        if (err)
          throw err
      })
      res.redirect('/account/login?recover=true')
    })
  })
});

router.get('/password', ensureAuthenticated, (req, res) => {
  res.render('password', {user: req.user});
});

router.post('/password', ensureAuthenticated, (req, res) => {
  hash_val = bcrypt.hashSync(req.body.new_password, 10); //todo change this into async
  pool.query(`update user set password = "${hash_val}" where email = "${req.user.email}"`, function (err, results) {
    res.redirect('/home/?change_password=true')
  })
});

router.get('/info', ensureAuthenticated, (req, res) => {
  res.render('info', {user: req.user});
//   res.render('info', {gender: gender}); //todo
//    res.render('info', {user: req.user, gender: req.user.gender})
});

router.get('/logout', ensureAuthenticated, function(req, res, next) {
  req.logOut(function(err) {
    if(err)
      return next(err);
    req.user = null;
    req.session.destroy()
    res.redirect('/home/?logout=true')
  })
})

router.get('/change_info', ensureAuthenticated, (req, res) => {
  res.render('change_info', {user: req.user});
});

router.post('/change_info', ensureAuthenticated, (req, res) => {
//   console.log(req.body)
//   console.log(req)
  pool.query(`update user set name = "${req.body.name}", pid = "${req.body.pid}", gender = "${req.body.gender}", birth = "${req.body.birth}" where email = "${req.user.email}"`, function (err, results) {
      if(err)
        throw err
    })
   res.redirect('/home/?change_info=true');
});

module.exports = router;
