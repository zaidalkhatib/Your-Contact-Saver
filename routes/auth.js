const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const auth = require("../middleware/auth");
const {body, validationResult} = require("express-validator");
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).send("error");
  }
});
router.post(
  "/",
  [
    body("email", "please include a valid email").isEmail(),
    body("password", "please eneter a password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({errors: errors.array()});
    }
    try {
      const {email, password} = req.body;
      var user = await User.findOne({email});
      var userPass = user.password;

      if (!user) {
        res.status(404).json({msg: "user is not in the data base"});
      }
      const isMatch = await bcrypt.compare(password, userPass);
      if (!isMatch) {
        res.status(400).json({msg: "password doesn't match"});
      }
      const payload = {
        user: {id: user.id},
      };
      var secretOrPrivateKey = "whatever";
      jwt.sign(payload, secretOrPrivateKey, (err, token) => {
        if (err) {
          res.status(400).json({msg: "error creating token"});
        } else {
          res.send({token: token});
        }
      });
    } catch (error) {
      console.log(error);
      res.status(401);
    }
  }
);

module.exports = router;
