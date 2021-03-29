const router = require("express").Router();

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  if (req.session.admin) {
    res.send("Admin Dashboard");
  } else {
    res.send("Admin Login")
  }
})

router.post("/login", async (req, res) => {

  if (!req.body.password) return res.sendStatus(400);

  if (await bcrypt.compare(req.body.password,
    process.env.SITE_ADMIN_PASSWORD_HASH)) {
    // If password correct
    req.session.admin = true;
  }
  res.redirect("/admin");
})

module.exports = router;