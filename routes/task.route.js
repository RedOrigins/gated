const router = require("express").Router();

const Task = require("../db/models/Task");
const Result = require("../db/models/Result");

router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.render("circuitEditor", { task });
});

router.post("/:id", async (req, res) => {
  try {
    if (!req.session.user) return res.sendStatus(401);

    await Result.updateOne(
      { task: req.params.id, user: req.session.user },
      { state: req.body.state }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
