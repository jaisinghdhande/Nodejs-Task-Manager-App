const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting Task");
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    const response = await Task.find({ owner: req.user._id });
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting Task");
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    //const response = await Task.findById(id);
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("Task Not Found!");
    }
    res.status(201).send(task);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error fetching task");
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(400).send("Cant update!");
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(400).send("Cant update! task not found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
