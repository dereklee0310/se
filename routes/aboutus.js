const { config } = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { sql, pool } = require("../modules/db");

router.get("/", (req, res) => {
  res.render("aboutus");
});

module.exports = router;
