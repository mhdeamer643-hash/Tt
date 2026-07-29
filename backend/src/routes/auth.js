const express = require("express");
const db = require("../db");
const { signToken } = require("../utils/jwt");
const { sendOtpSms } = require("../services/sms");
require("dotenv").config();

const router = express.Router();

const OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS || "300", 10);
const DEV_EXPOSE_OTP = process.env.DEV_EXPOSE_OTP === "true";

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\s+/g, "").trim();
}

router.post("/request-otp", async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!phone || phone.length < 8) {
    return res.status(400).json({ error: "رقم الهاتف غير صحيح" });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000).toISOString();

  db.prepare(
    "INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)"
  ).run(phone, code, expiresAt);

  await sendOtpSms(phone, code);

  const response = { ok: true, message: "تم إرسال رمز التحقق", ttl_seconds: OTP_TTL_SECONDS };
  if (DEV_EXPOSE_OTP) response.dev_otp_code = code;

  res.json(response);
});

router.post("/verify-otp", (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const code = String(req.body.code || "").trim();

  if (!phone || !code) {
    return res.status(400).json({ error: "الرقم والرمز مطلوبان" });
  }

  const record = db
    .prepare(
      `SELECT * FROM otp_codes
       WHERE phone = ? AND code = ? AND verified = 0
       ORDER BY id DESC LIMIT 1`
    )
    .get(phone, code);

  if (!record) {
    return res.status(400).json({ error: "رمز التحقق غير صحيح" });
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ error: "انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد" });
  }

  db.prepare("UPDATE otp_codes SET verified = 1 WHERE id = ?").run(record.id);

  let user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  if (!user) {
    const info = db
      .prepare("INSERT INTO users (phone, name) VALUES (?, ?)")
      .run(phone, req.body.name || null);
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
  }

  const token = signToken({ userId: user.id });

  res.json({ ok: true, token, user: { id: user.id, phone: user.phone, name: user.name } });
});

module.exports = router;