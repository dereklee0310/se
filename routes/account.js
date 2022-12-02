const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/account/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/recover", (req, res) => {
  res.render("recover");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/verify", (req, res) => {
  console.log(req.body);
  res.redirect("/home")
});

module.exports = router;
