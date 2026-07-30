import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";

const STATUS_LABEL = {
  processing: { text: "قيد التحضير", cls: "pill-amber" },
  delivering: { text: "قيد التوصيل", cls: "pill-amber" },
  delivered: { text: "تم التسليم", cls: "pill-green" },
  canceled: { text: "ملغي", cls: "pill-red" },
  delivery_failed: { text: "تعذر التوصيل", cls: "pill-red" },
};

export default function OrdersHistoryScreen() {
  const navigate = useNavigate();
  const { token } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders(token).then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div className="screen">
      <div className="header"><div><div className="header-title">طلباتي</div></div></div>
      <div className="scroll" style={{ padding: "16px 20px" }}>
        {loading && <div className="hint">جاري التحميل...</div>}
        {!loading && orders.length === 0 && <div className="hint">لسا ما عندك طلبات سابقة</div>}
        {orders.map((o) => {
          const s = STATUS_LABEL[o.status] || STATUS_LABEL.processing;
          return (
            <div key={o.id} className="card" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => navigate(`/tracking/${o.id}`)}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>طلب #{o.id} · {o.restaurant_name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", margin: "4px 0" }}>{new Date(o.created_at).toLocaleString("ar")}</div>
                <span className={`pill ${s.cls}`}>{s.text}</span>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, fontFamily: "Cairo", fontSize: 14 }}>{o.total} ₪</div>
                <div style={{ fontSize: 11, color: "var(--primary)", marginTop: 4 }}>التفاصيل ›</div>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}