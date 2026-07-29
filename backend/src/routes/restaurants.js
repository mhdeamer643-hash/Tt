const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/restaurants?area_id=1&q=بيتزا
router.get("/", (req, res) => {
  const { area_id, q } = req.query;

  let sql = "SELECT id, name_ar, category_ar, rating, delivery_time_label, image_url FROM restaurants WHERE is_active = 1";
  const params = [];

  if (area_id) {
    sql += " AND area_id = ?";
    params.push(area_id);
  }
  if (q) {
    sql += " AND (name_ar LIKE ? OR category_ar LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }
  sql += " ORDER BY rating DESC";

  const restaurants = db.prepare(sql).all(...params);
  res.json(restaurants);
});

// GET /api/restaurants/:id
router.get("/:id", (req, res) => {
  const restaurant = db
    .prepare("SELECT * FROM restaurants WHERE id = ?")
    .get(req.params.id);

  if (!restaurant) return res.status(404).json({ error: "مطعم غير موجود" });

  const categories = db
    .prepare("SELECT id, name_ar FROM menu_categories WHERE restaurant_id = ? ORDER BY sort_order")
    .all(req.params.id);

  const dishesStmt = db.prepare(
    "SELECT id, name_ar, description_ar, price, image_url FROM dishes WHERE category_id = ? AND is_available = 1"
  );

  const menu = categories.map((cat) => ({
    ...cat,
    dishes: dishesStmt.all(cat.id),
  }));

  res.json({ ...restaurant, menu });
});

module.exports = router;

