const router = require("express").Router();

const User = require("../db/models/User");
const Result = require("../db/models/Result");
const bcrypt = require("bcrypt");

// Dashboard
router.get("/", async (req, res) => {
  if (!req.session.user) {
    // If not logged in
    res.render("login");
  } else if (req.session.group == "student") {
    const results = await Result.find({ user: req.session.user }, { user: 0 });
    res.render("studentDashboard", { results });
  } else {
    const users = await User.find(
      { school: req.session.school, group: "student" },
      { password: 0 }
    );
    res.render("staffDashboard", { users });
  }
});

// Login
router.post("/login", async (req, res) => {
  if (!req.body.school || !req.body.name || !req.body.password)
    return res.sendStatus(400);

  try {
    // Find user document with matching school and name
    const user = await User.findOne({
      school: req.body.school,
      name: req.body.name,
    }).lean();

    // Compare password
    if (await bcrypt.compare(req.body.password, user.password)) {
      // If correct password, set session
      req.session.user = user._id;
      req.session.group = user.group;
      req.session.school = user.school;
      res.sendStatus(200); // Ok
    } else {
      res.sendStatus(401); // Unauthorized
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
