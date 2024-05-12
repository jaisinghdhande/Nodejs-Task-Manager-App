const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting Task");
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findUserByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.status(200).send({ user: user, token: token });
  } catch (e) {
    res.status(500).send("Unable to Login!");
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(201).send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to logout!");
  }
});

router.post("/users/logOutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(201).send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to logout!");
  }
});

router.get("/users", auth, async (req, res) => {
  console.log(req.user);
  res.send(req.user);
  // try {
  //   const response = await User.find();
  //   res.status(200).send(response);
  // } catch (e) {
  //   console.log(e);
  //   res.status(500).send("Error getting Task");
  // }
});

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await User.findById(id);
    if (!response) {
      return res.status(404).send("User Not Found!");
    }
    res.status(201).send(response);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting Task");
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const availableOps = ["name", "email", "password", "age"];
  const opsFromRequest = Object.keys(req.body);
  const isValid = opsFromRequest.every((e) => {
    return availableOps.includes(e);
  });
  if (!isValid) {
    return res.status(400).send("Bad data!");
  }
  try {
    opsFromRequest.forEach((ops) => {
      return (req.user[ops] = req.body[ops]);
    });
    await req.user.save();

    res.status(201).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(400).send("Cant update! User not found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
