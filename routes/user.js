const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const {body, validationResult} = require("express-validator");
router.get("/", (req, res) => {
  res.send("user page");
});
router.post(
  "/",
  [
    body("email").isEmail(),
    body("password").not().isEmpty(),
    body("name").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({errors: errors.array()});
    }
    try {
      let user = await User.findOne({email: req.body.email}, (err, user) => {
        if (user) {
          res.status(400).json({msg: "user already exists"});
          console.log("user already exist ");
        }
      });
      user = await new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      user.save((err, user1) => {
        if (err) {
          console.log("error posing user");
          throw err;
        }
      });
      const payload = {
        user: {
          id: user.id,
        },
      };
      var secretOrPrivateKey = "whatever";

      jwt.sign(payload, secretOrPrivateKey, function (err, token) {
        if (err) {
          res.status(400).json({msg: "token err"});
        } else {
          res.json({token: token});
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  }
);
module.exports = router;
