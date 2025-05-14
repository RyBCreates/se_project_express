const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { loginUser, createUser } = require("./controllers/users");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

app.post("/signup", createUser);
app.post("/signin", loginUser);

app.use("/", mainRouter);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.listen(PORT, () => {
  console.log(`Hello, from Port: ${PORT}`);
});

module.exports = app;
