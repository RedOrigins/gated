const router = require("express").Router();

const School = require("../db/models/School");

// Create a new school
router.post("/", async (req, res) => {
  // Require admin permissions
  if (!req.session.admin) return res.sendStatus(401); // Unauthorized

  const newSchool = new School({
    name: req.body.name
  })
  await newSchool.save();
  res.sendStatus(201); // Created
})

router.get("/select", async (req, res) => {
  try {
    // Name of school being searched
    const name = req.query.term;

    if (!name) throw new Error("No query term provided to school select route.");

    // Find all schools with names that contain the query term
    const schools = await School.find({
      name: {
        $regex: name,
        $options: "i" // Case insensitivity flag
      }
    })

    // Return school documents in select2 data format
    res.json({
      results: schools.map(school => {
        return {
          id: school._id,
          text: school.name
        }
      })
    })

  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
  }
})

module.exports = router;