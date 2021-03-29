const router = require("express").Router();

const User = require("../db/models/User");
const Result = require("../db/models/Result");
const bcrypt = require("bcrypt");

// Create new user
router.post("/", async (req, res) => {
  try {
    // Requires admin or staff of school
    if (
      !req.session.admin &&
      (req.session.group != "staff" || req.session.school != req.body.school)
    ) {
      return res.sendStatus(401); // Unauthorized
    }

    // Hash password with 10 iterations
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      school: req.body.school,
      name: req.body.name,
      group: req.body.group,
      password: hashedPassword,
    });

    await newUser.save();
    res.sendStatus(201); // Created
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
  }
});

// Get results for user
router.get("/:id", async (req, res) => {
  try {
    // Check site admin or school staff, Unauthorized
    if (!req.session.admin && req.session.group != "staff")
      return res.sendStatus(401);
    // Find user document
    const user = await User.findById(req.params.id, { password: 0 });
    // Check staff member is in same school (or is site admin), Forbidden
    if (!req.session.admin && user.school != req.session.school)
      return res.sendStatus(403);
    // Find task results for user
    const results = await Result.find({ user: user._id }, { user: 0 }).populate(
      "task",
      "name"
    );
    res.render("userPage", { user, results });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
  }
});

// Assign a new task to a user
router.post("/:id", async (req, res) => {
  try {
    // If not admin or staff member
    if (!req.session.admin && req.session.group != "staff") {
      return res.sendStatus(401); // Unauthorized
    }

    const newResult = new Result({
      task: req.body.task,
      user: req.params.id,
    });

    await newResult.save();
    res.sendStatus(201); // Created
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
  }
});

module.exports = router;
