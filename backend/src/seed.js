const db = require("./db");

const insertCity = db.prepare("INSERT INTO cities (name_ar, sort_order) VALUES (?, ?)");
const insertArea = db.prepare("INSERT INTO areas (city_id, name_ar) VALUES (?, ?)");
const insertRestaurant = db.prepare("INSERT INTO restaurants (area_id, name_ar, category_ar, rating, delivery_time_label) VALUES (?, ?, ?, ?, ?)");
const insertCategory = db.prepare("INSERT INTO menu_categories (restaurant_id, name_ar, sort_order) VALUES (?, ?, ?)");
const insertDish = db.prepare("INSERT INTO dishes (category_id, name_ar, description_ar, price) VALUES (?, ?, ?, ?)");

db.exec("DELETE FROM order_status_history");
db.exec("DELETE FROM order_items");
db.exec("DELETE FROM orders");
db.exec("DELETE FROM dishes");
db.exec("DELETE FROM menu_categories");
db.exec("DELETE FROM restaurants");
db.exec("DELETE FROM areas");
db.exec("DELETE FROM cities");

const cities = ["دمشق", "حمص", "الغسانية", "العقربية"];
const cityIds = {};
for (let i = 0; i < cities.length; i++) {
  const info = insertCity.run(cities[i], i);
  cityIds[cities[i]] = info.lastInsertRowid;
}

const damascusAreas = ["المزة", "أبو رمانة", "باب توما", "ركن الدين"];
const areaIds = [];
for (const name of damascusAreas) {
  const info = insertArea.run(cityIds["دمشق"], name);
  areaIds.push({ name: name, id: info.lastInsertRowid });
}

const homsAreas = ["الوعر", "الإنشاءات", "الزهراء"];
for (const name of homsAreas) {
  insertArea.run(cityIds["حمص"], name);
}
insertArea.run(cityIds["الغسانية"], "المركز");
insertArea.run(cityIds["العقربية"], "المركز");

let mazzeAreaId = null;
for (const a of areaIds) {
  if (a.name === "المزة") mazzeAreaId = a.id;
}

const r1 = insertRestaurant.run(mazzeAreaId, "مطعم الديار", "مشاوي شرقي", 4.7, "25-35 دقيقة").lastInsertRowid;
const c1a = insertCategory.run(r1, "المقبلات", 1).lastInsertRowid;
const c1b = insertCategory.run(r1, "المشاوي", 2).lastInsertRowid;
insertDish.run(c1a, "حمص بالطحينة", "حمص طحينة زيت زيتون", 18);
insertDish.run(c1a, "متبل باذنجان", "باذنجان مشوي طحينة رمان", 20);
insertDish.run(c1a, "فتوش", "خضار طازجة خبز محمص", 22);
insertDish.run(c1b, "مشاوي مشكلة", "كباب شيش طاووق كفتة", 65);
insertDish.run(c1b, "فروج مشوي", "نصف فروج مشوي على الفحم", 45);

const r2 = insertRestaurant.run(mazzeAreaId, "بيتزا فيليتشيتا", "إيطالي بيتزا", 4.5, "20-30 دقيقة").lastInsertRowid;
const c2a = insertCategory.run(r2, "بيتزا", 1).lastInsertRowid;
insertDish.run(c2a, "بيتزا مارغريتا", "صلصة طماطم جبنة موزاريلا ريحان", 38);
insertDish.run(c2a, "بيتزا خضار", "فلفل مشروم زيتون ذرة", 42);

const r3 = insertRestaurant.run(mazzeAreaId, "حلويات الشام", "حلويات شرقية", 4.9, "15-25 دقيقة").lastInsertRowid;
const c3a = insertCategory.run(r3, "حلويات", 1).lastInsertRowid;
insertDish.run(c3a, "كنافة نابلسية", "قطعة كنافة طازجة", 25);
insertDish.run(c3a, "بقلاوة", "علبة بقلاوة متنوعة", 30);

console.log("تم تعبئة قاعدة البيانات بنجاح");

