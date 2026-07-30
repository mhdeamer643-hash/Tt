import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { area, city } = useApp();
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!area) {
      navigate("/city");
      return;
    }
    load();
  }, [area]);

  function load() {
    setLoading(true);
    api.getRestaurants(area.id, q).then(setRestaurants).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  function onSearch(e) {
    e.preventDefault();
    load();
  }

  return (
    <div className="screen">
      <div className="header">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => navigate("/area")}>
            📍 {area?.name_ar}، {city?.name_ar} ▾
          </div>
          <div className="header-title" style={{ marginTop: 2 }}>وين بدك تطلب اليوم؟</div>
        </div>
      </div>
      <div className="scroll" style={{ padding: "14px 20px 8px" }}>
        <form onSubmit={onSearch}>
          <input className="input" placeholder="ابحث عن مطعم أو وجبة..." style={{ marginBottom: 14 }} value={q} onChange={(e) => setQ(e.target.value)} />
        </form>

        {loading && <div className="hint">جاري التحميل...</div>}
        {error && <div className="error-banner">⚠️ {error}</div>}
        {!loading && !error && restaurants.length === 0 && <div className="hint">لا توجد مطاعم متاحة بهذه المنطقة حاليًا</div>}

        <div className="section-title">مطاعم متاحة</div>
        {restaurants.map((r) => (
          <div key={r.id} className="card" style={{ display: "flex", gap: 12, marginBottom: 12, padding: 12, cursor: "pointer" }} onClick={() => navigate(`/restaurant/${r.id}`)}>
            <div className="img-placeholder" style={{ width: 76, height: 76 }}>صورة</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 5 }}>
              <div style={{ fontFamily: "Cairo", fontWeight: 700, fontSize: 14.5 }}>{r.name_ar}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.category_ar}</div>
              <div style={{ display: "flex", gap: 10, fontSize: 11.5, color: "var(--muted)" }}>
                <span>⭐ {r.rating}</span><span>🕒 {r.delivery_time_label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}