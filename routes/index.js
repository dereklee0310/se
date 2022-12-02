const express = require("express");
const router = express.Router();

// the routing here will be home/...

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/history", (req, res) => {
  res.render("history");
});

router.get("/aboutus", (req, res) => {
  res.render("aboutus");
});

module.exports = router;
