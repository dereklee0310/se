const express = require("express");
const router = express.Router();
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;


// the routing here will be home/...

router.get("/", (req, res) => {
//   if (req.session.status === 'logout') {
//     res.render('index', {msg: 'justLogout', user: null})
//     return
//   }
  if (req.query.logout === 'true')
    res.render('index', {msg: 'logout'})
  else if (req.query.login === 'true')
    res.render('index', {msg: 'login', user: req.user})
  else if (req.query.change_info === 'true')
    res.render('index', {msg: 'change_info', user: req.user})
  else if (req.query.change_password === 'true')
    res.render('index', {msg: 'change_password', user: req.user})
  else if (typeof req.user !== 'undefined')
    res.render('index', {user: req.user});
  else if (req.query.sent === 'true')
    res.render('index', {msg: 'sent'})
  else
    res.render('index', {login: 'false'})
});

// todo handle ensureAuthenticated error here
router.get('/history', ensureAuthenticated, (req, res) => {
  res.render('history');
});

module.exports = router;
