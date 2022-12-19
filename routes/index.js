const express = require("express");
const router = express.Router();
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;


// the routing here will be home/...

router.get("/", (req, res) => {
  // todo use isauthenticated here
  if (req.query.login === 'false')
    res.render('index', {login: 'false'})
  else
    res.render("index");
});

// todo handle ensureAuthenticated error here
router.get("/history", ensureAuthenticated, (req, res) => {
  console.log('jifaf')
  res.render("history");
});

router.get("/aboutus", (req, res) => {
  res.render("aboutus");
});

module.exports = router;
