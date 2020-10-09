const express = require("express");
const bodyParser = require("body-parser");
var User = require("../model/user");
const router = express.Router();
const passport = require("passport");
const authenticate = require("../auth");
router.use(bodyParser.json());

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});
router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err });
        var err = new Error(`User ${req.body.username} already exists!`);
        err.status = 403;
        next(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  console.log(req.user._id);
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    token,
    success: true,
    status: "You are Successfully loggend in!",
  });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});
router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});
module.exports = router;
