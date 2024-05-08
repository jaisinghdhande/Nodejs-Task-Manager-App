const mongoose = require("mongoose");

const dbConnectionUrl = "mongodb://127.0.0.1:27017/task-manager-db";

mongoose
  .connect(dbConnectionUrl)
  .then((result) => {
    console.log("Connected to Db!");
  })
  .catch((err) => {
    console.log("Error Connecting Db!");
  });
