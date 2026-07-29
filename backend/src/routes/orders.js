const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const DELIVERY_FEE = 10;

router.use(requireAuth);

router.post("/", (req, res) => {
  const { restaurant_id, items, address_note, lat, lng, contact_name, contact_phone } = req.body;

  if (!restaurant_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "الطلب يجب أن يحتوي على مطعم وعنصر واحد على الأقل" });
  }
  if (!lat || !lng) {
    return res.status(400).json({ error: "يجب تحديد موقع التوصيل (GPS)" });
  }

  const dishStmt = db.prepare("SELECT id, name_ar, price FROM dishes WHERE id = ?");
  let subtotal = 0;
  const resolvedItems = [];

  for (const item of items) {
    const dish = dishStmt.get(item.dish_id);
    if (!dish) return res.status(400).json({ error: `الطبق رقم ${item.dish_id} غير موجود` });
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    subtotal += dish.price * qty;
    resolvedItems.push({ dish_id: dish.id, name_ar: dish.name_ar, price: dish.price, quantity: qty, notes: item.notes || null });
  }

  const total = subtotal + DELIVERY_FEE;

  const insertOrder = db.prepare(`
    INSERT INTO orders
      (user_id, restaurant_id, status, address_note, lat, lng, contact_name, contact_phone, subtotal, delivery_fee, total)
    VALUES (?, ?, 'processing', ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, dish_id, name_ar, price, quantity, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO order_status_history (order_id, status) VALUES (?, 'processing')
  `);

  const orderId = db.transaction(() => {
    const info = insertOrder.run(
      req.user.id, restaurant_id, address_note || null, lat, lng,
      contact_name || req.user.name, contact_phone || req.user.phone,
      subtotal, DELIVERY_FEE, total
    );
    const id = info.lastInsertRowid;
    for (const it of resolvedItems) {
      insertItem.run(id, it.dish_id, it.name_ar, it.price, it.quantity, it.notes);
    }
    insertHistory.run(id);
    return id;
  })();

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  res.status(201).json(order);
});

router.get("/", (req, res) => {
  const orders = db
    .prepare(`
      SELECT o.*, r.name_ar AS restaurant_name
      FROM orders o JOIN restaurants r ON r.id = o.restaurant_id
      WHERE o.user_id = ?
      ORDER BY o.id DESC
    `)
    .all(req.user.id);
  res.json(orders);
});

router.get("/:id", (req, res) => {
  const order = db
    .prepare(`
      SELECT o.*, r.name_ar AS restaurant_name
      FROM orders o JOIN restaurants r ON r.id = o.restaurant_id
      WHERE o.id = ? AND o.user_id = ?
    `)
    .get(req.params.id, req.user.id);

  if (!order) return res.status(404).json({ error: "الطلب غير موجود" });

  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
  const history = db
    .prepare("SELECT status, created_at FROM order_status_history WHERE order_id = ? ORDER BY id")
    .all(order.id);

  res.json({ ...order, items, history });
});

router.post("/:id/advance-status", (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: "الطلب غير موجود" });

  const flow = { processing: "delivering", delivering: "delivered" };
  const next = flow[order.status];
  if (!next) return res.status(400).json({ error: "لا يمكن تقديم حالة الطلب أكثر من ذلك" });

  const courier = next === "delivering" ? { courier_name: "أحمد الخطيب", courier_phone: "+963 900 000 000" } : {};

  db.prepare(`
    UPDATE orders SET status = ?, updated_at = datetime('now'),
      courier_name = COALESCE(?, courier_name), courier_phone = COALESCE(?, courier_phone)
    WHERE id = ?
  `).run(next, courier.courier_name || null, courier.courier_phone || null, order.id);

  db.prepare("INSERT INTO order_status_history (order_id, status) VALUES (?, ?)").run(order.id, next);

  const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(order.id);
  res.json(updated);
});

module.exports = router;