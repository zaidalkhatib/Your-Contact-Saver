const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const Contacts = require("../model/Contacts");
const User = require("../model/User");
const auth = require("../middleware/auth");
const e = require("express");
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contacts.find({user: req.user.id});

    res.json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error.message});
  }
});

router.post(
  "/",
  auth,
  [
    body("name", "please enter a name").notEmpty(),
    body("email", "please enter a valid email").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {name, email, type, phone, date} = req.body;
    try {
      let newContact = new Contacts({
        name,
        email,
        phone,
        type,
        date,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.log("err");
      res.status(400).json({err: error.message});
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  const {name, email} = req.body;
  try {
    let contact = await Contacts.findByIdAndDelete(req.params.id);
    if (contact) {
      res.send("deleted");
    } else {
      res.send("user doesn't exist ");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  const {email, name, type, phone} = req.body;
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (email) contactFields.type = type;
  if (email) contactFields.phone = phone;
  try {
    let contact = await Contacts.findOneAndUpdate(
      req.params.id,
      {$set: contactFields},
      {new: true}
    );
    if (!contact) {
      res.send(contact);
    }
  } catch (error) {
    res.status(404).json({msg: eror});
  }
});

module.exports = router;
