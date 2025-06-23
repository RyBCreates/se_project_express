require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { loginUser, createUser } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateUserSignup,
  validateUserLogin,
} = require("./middlewares/validation");

const app = express();

const { PORT = 3001 } = process.env;

app.use(requestLogger);

app.use(express.json());
app.use(cors());

app.post("/signup", validateUserSignup, createUser);
app.post("/signin", validateUserLogin, loginUser);

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.listen(PORT, () => {
  console.log(`Hello, from Port: ${PORT}`);
});

module.exports = app;
