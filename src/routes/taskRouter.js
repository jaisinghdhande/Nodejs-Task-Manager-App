const express = require("express");
const Task = require("../models/task");

const router = new express.Router();

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting Task");
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const response = await Task.find();
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error getting Task");
  }
});

router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await Task.findById(id);
    if (!response) {
      return res.status(404).send("Task Not Found!");
    }
    res.status(201).send(response);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error fetching task");
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
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
