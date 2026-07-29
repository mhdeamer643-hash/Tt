const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  const cities = db
    .prepare("SELECT id, name_ar FROM cities WHERE is_active = 1 ORDER BY sort_order, id")
    .all();
  res.json(cities);
});

router.get("/:id/areas", (req, res) => {
  const areas = db
    .prepare("SELECT id, name_ar, is_deliverable FROM areas WHERE city_id = ? ORDER BY id")
    .all(req.params.id);
  res.json(areas);
});

module.exports = router;