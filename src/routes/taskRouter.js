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
//if limit is undefined, mongoose is gona ignore it and provide the complete result
router.get("/tasks", auth, async (req, res) => {

  const match = {};
  const sortObject = {};

  if (req.query.sort) {
    const sortParam = req.query.sort.split(":")[0];
    const order = req.query.sort.split(":")[1];
    sortObject[sortParam] = order === "desc" ? -1 : 1;
  }

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  try {
    const response = await Task.find({ owner: req.user._id, ...match })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sortObject);
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
  const allowedOps = ["description", "completed"];
  const requestOps = Object.keys(req.body);

  const isValid = requestOps.every((ops) => {
    return allowedOps.includes(ops);
  });

  if (!isValid) {
    return res.status(500).send("Not A Valid Operation!");
  }

  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
      return res.status(404).send("Task not found!");
    }

    requestOps.forEach((ops) => {
      return (task[ops] = req.body[ops]);
    });

    await task.save();

    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(400).send("Cant update! task not found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
