const db = require("./db");

const insertCity = db.prepare("INSERT INTO cities (name_ar, sort_order) VALUES (?, ?)");
const insertArea = db.prepare("INSERT INTO areas (city_id, name_ar) VALUES (?, ?)");

const insertRestaurant = db.prepare(`
INSERT INTO restaurants (area_id, name_ar, category_ar, rating, delivery_time_label)
VALUES (?, ?, ?, ?, ?)
`);

const insertCategory = db.prepare(`
INSERT INTO menu_categories (restaurant_id, name_ar, sort_order) VALUES (?, ?, ?)
`);

const insertDish = db.prepare(`
INSERT INTO dishes (category_id, name_ar, description_ar, price) VALUES (?, ?, ?, ?)
`);

const run = db.transaction(() => {
  db.exec(`
    DELETE FROM order_status_history; DELETE FROM order_items; DELETE FROM orders;
    DELETE FROM dishes; DELETE FROM menu_categories; DELETE FROM restaurants;
    DELETE FROM areas; DELETE FROM cities;
  `);

  const cities = ["دمشق", "حمص", "اللاذقية", "طرطوس"];
  const cityIds = {};
  cities.forEach((name, i) => {
      const info = insertCity.run(name, i);
      cityIds[name] = info.lastInsertRowid;
  });

  const damascusAreas = ["القصاع", "المزة", "المالكي", "أبو رمانة"];
  const areaIds = [];

  damascusAreas.forEach((name) => {
      const info = insertArea.run(cityIds["دمشق"], name);
      areaIds.push({ name, id: info.lastInsertRowid });
  });

  const homsAreas = ["الحمراء", "الوعر", "الإنشاءات"];
  homsAreas.forEach((name) => {
      insertArea.run(cityIds["حمص"], name);
  });

  insertArea.run(cityIds["اللاذقية"], "المركز");
  insertArea.run(cityIds["طرطوس"], "المركز");

  const mazzeAreaId = areaIds.find(a => a.name === "المزة").id;

  const r1 = insertRestaurant.run(mazzeAreaId, "مطعم الديار", "مشاوي", 4.7, "25-35 دقيقة");
  const c1a = insertCategory.run(r1.lastInsertRowid, "المقبلات", 1);
  const c1b = insertCategory.run(r1.lastInsertRowid, "المشاوي", 2);

  insertDish.run(c1a, "حمص بالطحينة", "حمص، طحينة، زيت زيتون", 18);
  insertDish.run(c1a, "متبل باذنجان", "باذنجان مشوي، طحينة، رمان", 20);
  insertDish.run(c1a, "فتوش", "خضار طازجة، خبز محمص", 22);

  insertDish.run(c1b, "مشاوي مشكلة", "كباب، شيش طاووق، كفتة", 65);
  insertDish.run(c1b, "فروج مشوي", "نصف فروج مشوي على الفحم", 45);

  const r2 = insertRestaurant.run(mazzeAreaId, "بيتزا فيليتشيتا", "إيطالي", 4.5, "20-30 دقيقة");
  const c2a = insertCategory.run(r2.lastInsertRowid, "بيتزا", 1);

  insertDish.run(c2a, "بيتزا مارغريتا", "صلصة طماطم، جبنة موزاريلا، ريحان", 38);
  insertDish.run(c2a, "بيتزا خضار", "فلفل، مشروم، زيتون، ذرة", 42);

  const r3 = insertRestaurant.run(mazzeAreaId, "حلويات الشام", "حلويات شرقية", 4.9, "15-25 دقيقة");
  const c3a = insertCategory.run(r3.lastInsertRowid, "حلويات", 1);

  insertDish.run(c3a, "كنافة نابلسية", "قطعة كنافة طازجة", 25);
  insertDish.run(c3a, "بقلاوة", "علبة بقلاوة متنوعة", 30);
});

run();
console.log("تم تعبئة قاعدة البيانات ببيانات تجريبية");
