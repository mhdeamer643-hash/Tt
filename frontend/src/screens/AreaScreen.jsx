import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";

export default function AreaScreen() {
  const navigate = useNavigate();
  const { city, area, setArea } = useApp();
  const [areas, setAreas] = useState([]);
  const [selected, setSelected] = useState(area);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) {
      navigate("/city");
      return;
    }
    api.getAreas(city.id).then(setAreas).finally(() => setLoading(false));
  }, [city]);

  const filtered = areas.filter((a) => a.name_ar.includes(q.trim()));
  const notDeliverable = selected && selected.is_deliverable === 0;

  function proceed() {
    if (!selected || notDeliverable) return;
    setArea(selected);
    navigate("/home");
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>→</button>
        <div><div className="header-title">اختر المنطقة</div><div className="header-sub">{city?.name_ar}</div></div>
      </div>
      <div className="scroll" style={{ padding: "16px 20px" }}>
        <input className="input" placeholder="ابحث عن منطقة..." style={{ marginBottom: 14 }} value={q} onChange={(e) => setQ(e.target.value)} />
        {loading && <div className="hint">جاري التحميل...</div>}
        {filtered.map((a) => (
          <div key={a.id} className="list-row" onClick={() => setSelected(a)} style={{ opacity: a.is_deliverable ? 1 : 0.6 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5 }}>{a.name_ar}</div>
            <div className={"radio-dot" + (selected?.id === a.id ? " checked" : "")}>
              {selected?.id === a.id ? "✓" : ""}
            </div>
          </div>
        ))}
        {notDeliverable && (
          <div className="card" style={{ marginTop: 16, background: "#FBE7E7", borderColor: "#F3C7C7", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ fontSize: 16 }}>⚠️</div>
            <div style={{ fontSize: 12.5, color: "#A83232", lineHeight: 1.6 }}>
              التوصيل غير متاح حاليًا في هذه المنطقة. يمكنك اختيار منطقة أخرى قريبة.
            </div>
          </div>
        )}
      </div>
      <div className="bottom-bar">
        <button className="btn btn-primary" disabled={!selected || notDeliverable} onClick={proceed}>متابعة</button>
      </div>
    </div>
  );
}