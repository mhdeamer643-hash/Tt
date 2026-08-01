require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const citiesRoutes = require("./routes/cities");
const restaurantsRoutes = require("./routes/restaurants");
const ordersRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "rahati-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ error: "المسار غير موجود" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "خطأ غير متوقع بالسيرفر" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 رحتي Backend شغال على http://localhost:${PORT}`);
});