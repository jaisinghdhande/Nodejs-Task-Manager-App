require("../db/mongodb");
const Task = require("../models/task");

// Task.deleteOne({ _id: "663683dc28d2f7b998ae064e" })
//   .then((res) => {
//     console.log(res);
//     return Task.countDocuments({ completed: true });
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch();

const findAndDelete = async (id) => {
  const response = await Task.deleteOne({ _id: id });
  console.log(response);
  const count = await Task.countDocuments({ completed: true });
  console.log(count);
};

findAndDelete("663736b2eb610423809e8b9c");
