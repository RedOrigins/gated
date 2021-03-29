// Importing dependancies
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const User = require("./db/models/User");
const School = require("./db/models/School");
const Task = require("./db/models/Task");
const Result = require("./db/models/Result");

// Load environment variables
require("dotenv").config();

// Connect to database
require("./db/connect")(mongoose);

// Create express app
const app = express();

// Set view engine
app.set("view engine", "ejs");

// Built-in body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Initialise session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 1000 * 60 * 20, // 20 Minutes
    },
  })
);

// Initialise methodOverride middleware
// To use custom methods, use /path?_method=DELETE
app.use(methodOverride("_method"));

// Initialise static directories
app.use(express.static(path.join(__dirname, "public")));

// Initialise routers
app.use("/", require("./routes/root.route"));
app.use("/admin", require("./routes/admin.route"));
app.use("/schools", require("./routes/schools.route"));
app.use("/users", require("./routes/users.route"));
app.use("/tasks", require("./routes/task.route"));

// ! Temporary for testing
app.get("/session", (req, res) => {
  res.send(req.session);
});
app.get("/allusers", async (req, res) => {
  const result = await User.find();
  res.json(result);
});
app.get("/allschools", async (req, res) => {
  const result = await School.find();
  res.json(result);
});
app.get("/alltasks", async (req, res) => {
  const result = await Task.find();
  res.json(result);
});
app.get("/allresults", async (req, res) => {
  const result = await Result.find();
  res.json(result);
});
// const addTasks = require("./db/addTasks");
// app.get("/addtasks", async (req, res) => {
//   await addTasks();
//   res.end();
// })

// Set app to listen on PORT given in .env
app.listen(
  process.env.PORT,
  console.log(`App running on port ${process.env.PORT}`)
);
