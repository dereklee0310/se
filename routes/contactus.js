const { config } = require('dotenv');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { sql, pool } = require('../modules/db');
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;

router.post('/', (req, res) => {
  // res.render("upload");
  console.log(req.body)
  res.redirect('/home/?sent=true#contactus')
});

module.exports = router;