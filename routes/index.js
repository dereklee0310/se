const express = require("express");
const router = express.Router();
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;


// the routing here will be home/...

router.get("/", (req, res) => {
  if (req.session.status === 'logout') {
    res.render('index', {msg: 'justLogout'})
    return
  }

  if (typeof req.user !== 'undefined')
    res.render('index', {login: 'true', username: req.user.last_name + req.user.first_name, user: req.user});
  else if (req.query.logout === 'true')
    res.render('index', {logout: 'true'})
  else if (req.query.signupSuccess === 'true')
    res.render('index', {msg: 'signupSuccess'})
  else
    res.render('index', {login: 'false'})
});

// todo handle ensureAuthenticated error here
router.get('/history', ensureAuthenticated, (req, res) => {
  res.render('history');
});

router.post("/contact", (req, res) => {
  res.render("aboutus"); //todo
});

module.exports = router;
