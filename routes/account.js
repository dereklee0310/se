const express = require("express");
const router = express.Router();

// these router are under the path /account/...
router.get("/", (req, res) => {
  res.redirect("/account/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/recover", (req, res) => {
  res.render("recover");
});

router.get("/password", (req, res) => {
  res.render("password");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/verify", (req, res) => {
  console.log(req.body);
  res.redirect("/home")
});

module.exports = router;
