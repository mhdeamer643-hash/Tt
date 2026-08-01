const express = require("express");
const db = require("../db");

const router = express.Router();

function checkPassword(req, res, next) {
  const pass = req.headers["x-admin-password"];
  if (!pass || pass !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "كلمة السر غير صحيحة" });
  }
  next();
}

router.use(checkPassword);

router.get("/cities", (req, res) => {
  const cities = db.prepare("SELECT * FROM cities ORDER BY sort_order").all();
  res.json(cities);
});

router.post("/cities", (req, res) => {
  const info = db.prepare("INSERT INTO cities (name_ar, sort_order) VALUES (?, ?)").run(req.body.name_ar, req.body.sort_order || 0);
  res.json({ id: info.lastInsertRowid });
});

router.delete("/cities/:id", (req, res) => {
  db.prepare("DELETE FROM cities WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.get("/areas", (req, res) => {
  const areas = db.prepare(`
    SELECT areas.*, cities.name_ar as city_name FROM areas
    JOIN cities ON cities.id = areas.city_id
    ORDER BY areas.city_id, areas.id
  `).all();
  res.json(areas);
});

router.post("/areas", (req, res) => {
  const info = db.prepare("INSERT INTO areas (city_id, name_ar, is_deliverable) VALUES (?, ?, ?)").run(req.body.city_id, req.body.name_ar, req.body.is_deliverable ?? 1);
  res.json({ id: info.lastInsertRowid });
});

router.delete("/areas/:id", (req, res) => {
  db.prepare("DELETE FROM areas WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.get("/restaurants", (req, res) => {
  const restaurants = db.prepare(`
    SELECT restaurants.*, areas.name_ar as area_name FROM restaurants
    JOIN areas ON areas.id = restaurants.area_id
    ORDER BY restaurants.id DESC
  `).all();
  res.json(restaurants);
});

router.post("/restaurants", (req, res) => {
  const { area_id, name_ar, category_ar, rating, delivery_time_label } = req.body;
  const info = db.prepare(`
    INSERT INTO restaurants (area_id, name_ar, category_ar, rating, delivery_time_label)
    VALUES (?, ?, ?, ?, ?)
  `).run(area_id, name_ar, category_ar, rating || 4.5, delivery_time_label || "20-30 دقيقة");
  res.json({ id: info.lastInsertRowid });
});

router.delete("/restaurants/:id", (req, res) => {
  db.prepare("DELETE FROM restaurants WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.get("/restaurants/:id/menu", (req, res) => {
  const categories = db.prepare("SELECT * FROM menu_categories WHERE restaurant_id = ? ORDER BY sort_order").all(req.params.id);
  const dishesStmt = db.prepare("SELECT * FROM dishes WHERE category_id = ?");
  const menu = categories.map((cat) => ({ ...cat, dishes: dishesStmt.all(cat.id) }));
  res.json(menu);
});

router.post("/categories", (req, res) => {
  const info = db.prepare("INSERT INTO menu_categories (restaurant_id, name_ar, sort_order) VALUES (?, ?, ?)").run(req.body.restaurant_id, req.body.name_ar, req.body.sort_order || 0);
  res.json({ id: info.lastInsertRowid });
});

router.delete("/categories/:id", (req, res) => {
  db.prepare("DELETE FROM menu_categories WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.post("/dishes", (req, res) => {
  const { category_id, name_ar, description_ar, price } = req.body;
  const info = db.prepare(`
    INSERT INTO dishes (category_id, name_ar, description_ar, price) VALUES (?, ?, ?, ?)
  `).run(category_id, name_ar, description_ar || "", price);
  res.json({ id: info.lastInsertRowid });
});

router.delete("/dishes/:id", (req, res) => {
  db.prepare("DELETE FROM dishes WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.get("/orders", (req, res) => {
  const orders = db.prepare(`
    SELECT orders.*, restaurants.name_ar as restaurant_name FROM orders
    JOIN restaurants ON restaurants.id = orders.restaurant_id
    ORDER BY orders.id DESC LIMIT 100
  `).all();
  res.json(orders);
});

router.patch("/orders/:id/status", (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);
  db.prepare("INSERT INTO order_status_history (order_id, status) VALUES (?, ?)").run(req.params.id, status);
  res.json({ ok: true });
});

module.exports = router;

