const express = require("express");
require("./db/mongodb");
const userRouter = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(taskRoutes);

app.listen(PORT, () => {
  console.log("Listening to port: " + PORT);
});
