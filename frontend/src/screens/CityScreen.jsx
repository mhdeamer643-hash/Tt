import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";

export default function CityScreen() {
  const navigate = useNavigate();
  const { city, setCity } = useApp();
  const [cities, setCities] = useState([]);
  const [selected, setSelected] = useState(city);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCities().then(setCities).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const filtered = cities.filter((c) => c.name_ar.includes(q.trim()));

  function proceed() {
    if (!selected) return;
    setCity(selected);
    navigate("/area");
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>→</button>
        <div><div className="header-title">اختر المدينة</div></div>
      </div>
      <div className="scroll" style={{ padding: "16px 20px" }}>
        <input className="input" placeholder="ابحث عن مدينة..." style={{ marginBottom: 14 }} value={q} onChange={(e) => setQ(e.target.value)} />
        {loading && <div className="hint">جاري التحميل...</div>}
        {error && <div className="error-banner">⚠️ {error}</div>}
        {filtered.map((c) => (
          <div key={c.id} className="list-row" onClick={() => setSelected(c)}>
            <div style={{ fontWeight: 600, fontSize: 14.5 }}>{c.name_ar}</div>
            <div className={"radio-dot" + (selected?.id === c.id ? " checked" : "")}>
              {selected?.id === c.id ? "✓" : ""}
            </div>
          </div>
        ))}
        {!loading && !error && filtered.length === 0 && <div className="hint" style={{ marginTop: 16 }}>باقي المدن السورية قريبًا 🌍</div>}
      </div>
      <div className="bottom-bar">
        <button className="btn btn-primary" disabled={!selected} onClick={proceed}>متابعة</button>
      </div>
    </div>
  );
}