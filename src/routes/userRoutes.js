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

router.get("/users", auth, async (req, res) => {
  res.send(req.myuser);
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

router.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const availableOps = ["name", "email", "password", "age"];
  const opsFromRequest = Object.keys(req.body);
  console.log(opsFromRequest);
  const isValid = opsFromRequest.every((e) => {
    return availableOps.includes(e);
  });
  if (!isValid) {
    return res.status(400).send("Bad data!");
  }
  try {
    const user = await User.findById(req.params.id);
    opsFromRequest.forEach((ops) => {
      return (user[ops] = req.body[ops]);
    });
    await user.save();
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!user) {
      return res.status(400).send("Cant update!");
    }
    res.status(201).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).send("Cant update! User not found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
