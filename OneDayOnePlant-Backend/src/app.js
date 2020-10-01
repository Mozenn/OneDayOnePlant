const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cronJobUtils = require("./utils/cronJobUtils");

const app = express();

const logger = require("./utils/logger");
const routes = require("./routes/router");

let res;
try {
  res = require("dotenv").config({
    path: `./.env.${process.env.NODE_ENV}`,
  });
} catch (err) {
  logger.error(error);
  throw err;
}

// ---- morgan setup

// create a write stream (in append mode)
var httpLogStream = fs.createWriteStream(
  path.join(__dirname, "..", "outputs", "http.log"),
  { flags: "a" }
);

// setup the logger
app.use(morgan("combined", { stream: httpLogStream }));

app.set("view engine", "ejs");
app.set("views", path.join("src", "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// launch cron jobs
cronJobUtils.startCronJobs();

app.use(routes);

app.use((error, req, res, next) => {
  logger.error("Error", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

module.exports = app;
