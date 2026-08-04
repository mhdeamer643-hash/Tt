import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

import { useApp } from "../context/AppContext";

export default function RestaurantScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useApp();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.getRestaurant(id)
      .then((r) => {
        setRestaurant(r);
        setActiveCategory(r.menu[0]?.id || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="screen" style={{ padding: 40 }}><div className="hint">جاري التحميل...</div></div>;
  if (error) return <div className="screen" style={{ padding: 40 }}><div className="error-banner">⚠️ {error}</div></div>;
  if (!restaurant) return null;

  const currentCategory = restaurant.menu.find((c) => c.id === activeCategory);
  const cartCount = cart.restaurantId === restaurant.id ? cart.items.reduce((s, i) => s + i.quantity, 0) : 0;
  const cartTotal = cart.restaurantId === restaurant.id ? cart.items.reduce((s, i) => s + i.quantity * i.price, 0) : 0;

  return (
    <div className="screen">
      <div className="header blob" style={{ alignItems: "flex-start" }}>
        <button className="back-btn" style={{ marginTop: 2 }} onClick={() => navigate(-1)}>→</button>
        <div>
          <div className="header-title">{restaurant.name_ar}</div>
          <div className="header-sub">{restaurant.category_ar} · ⭐ {restaurant.rating} · {restaurant.delivery_time_label}</div>
        </div>
      </div>
      <div className="scroll" style={{ padding: "16px 20px 8px" }}>
        <div className="tag-row" style={{ marginBottom: 6 }}>
          {restaurant.menu.map((cat) => (
            <div key={cat.id} className={"tag" + (activeCategory === cat.id ? " active" : "")} onClick={() => setActiveCategory(cat.id)}>
              {cat.name_ar}
            </div>
          ))}
        </div>

        <div className="section-title" style={{ marginTop: 14 }}>{currentCategory?.name_ar}</div>
        {currentCategory?.dishes.map((dish) => (
          <div key={dish.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <div className="img-placeholder" style={{ width: 64, height: 64 }}>صورة</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{dish.name_ar}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", margin: "3px 0 6px" }}>{dish.description_ar}</div>
          <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: 13 }}>{dish.price} ل.س</div>


  
            <button
              style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--primary)", color: "#fff", border: "none", fontSize: 16, cursor: "pointer" }}
              onClick={() => addToCart(restaurant.id, restaurant.name_ar, dish)}
            >+</button>
          </div>
        ))}
      </div>
      {cartCount > 0 && }
        <div className="bottom-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{cartCount} عناصر بالسلة</div>
          <button className="btn btn-primary" style={{ width: "auto", padding: "13px 26px" }} onClick={() => navigate("/cart")}>
          عرض السلة · {cartTotal} ل.س
          </button>
        </div>
      )}
    </div>
  );
}
