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
    res.render('login', {msg: 'required'})
  else
    res.render('login')
}); 

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/account/login?failed=true'
}))

router.get('/signup', (req, res) => {
  if (req.query.failed === 'true')
    res.render('signup', {msg: 'failed'})
  else
    res.render('signup');
});

router.post('/signup', (req, res) => {
  pool.query(
    `select user_id from user where email = '${req.body.email}'`,
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
        ` values(NULL, '${req.body.first_name}', '${req.body.last_name}', '${req.body.email}', '${hash_val}', '${req.body.pid}', '${req.body.gender}', '${req.body.birth}', default)`,
        function (err, results) {
          if (err)
            throw err;
          res.redirect('/home/?signupSuccess=true')
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
    pool.query(`update user set password = '${hash_val}' where email = '${req.body.email}'`, function (err, results) {
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
  res.render('password');
});

router.post('/password', ensureAuthenticated, (req, res) => {
  hash_val = bcrypt.hashSync(req.body.new_password, 10); //todo change this into async
  pool.query(`update user set password = '${hash_val}' where email = '${req.user.email}'`, function (err, results) {
    res.redirect('/home?changePassword=true')
  })
});

router.get('/info', ensureAuthenticated, (req, res) => {
  user = req.user
  if (user.gender === 'male')
    gender = '男'
  else if (user.gender === 'female')
    gender = '女'
  else
    gender = '第三性別'
  res.render('info', {first_name: user.first_name, last_name: user.last_name, email: user.email, pid: user.pid, gender: gender, birth: user.birth});
  // res.render('info'); //todo
});

router.get('/logout', ensureAuthenticated, function(req, res, next) {
  req.logOut(function(err) {
    if(err)
      return next(err);
    req.session.status = 'logout'
    res.redirect('/home')
  })
})

module.exports = router;
