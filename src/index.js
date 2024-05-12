const express = require("express");
require("./db/mongodb");
const userRouter = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRouter");
const Task=require('./models/task');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(taskRoutes);

app.listen(PORT, () => {
  console.log("Listening to port: " + PORT);
});

// const main=async ()=>{
// const task=await Task.findById('663feea80c47ebe2d105f77b');
// await task.populate('owner')
// console.log(task.owner);
// }

// main();