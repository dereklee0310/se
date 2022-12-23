const { config } = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { sql, pool } = require("../modules/db");
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;

router.get('/', (req, res) => {
  res.render('history');
});

module.exports = router;