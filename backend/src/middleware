const { verifyToken } = require("../utils/jwt");
const db = require("../db");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "غير مصرح، يرجى تسجيل الدخول" });
  }

  try {
    const payload = verifyToken(token);
    const user = db.prepare("SELECT id, phone, name FROM users WHERE id = ?").get(payload.userId);
    if (!user) {
      return res.status(401).json({ error: "المستخدم غير موجود" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "جلسة غير صالحة، يرجى تسجيل الدخول من جديد" });
  }
}

module.exports = { requireAuth };