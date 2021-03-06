const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

const authRout = require("./routes/Auth");
const userRout = require("./routes/User");

const app = express();

mongoose.connect(process.env.DB_URL, () => {
  console.log("connect to database ");
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth/", authRout);
app.use("/api/users/", userRout);

app.listen(process.env.PORT || 8080, () => {
  console.log(`running on port ${process.env.PORT}`);
});
