import { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";

const STEPS = [
  { key: "processing", label: "قيد التحضير" },
  { key: "delivering", label: "قيد التوصيل" },
  { key: "delivered", label: "تم التسليم" },
];

const STATUS_LABEL = {
  processing: { text: "قيد التحضير", cls: "pill-amber", icon: "👨‍🍳" },
  delivering: { text: "قيد التوصيل", cls: "pill-amber", icon: "🛵" },
  delivered: { text: "تم التسليم", cls: "pill-green", icon: "✅" },
  canceled: { text: "ملغي", cls: "pill-red", icon: "✕" },
  delivery_failed: { text: "تعذر التوصيل", cls: "pill-red", icon: "⚠️" },
};

function Step({ label, state }) {
  const color = state === "pending" ? "var(--border)" : "var(--primary)";
  const txtColor = state === "pending" ? "var(--muted)" : "var(--text)";
  const dot = state === "done" ? "✓" : state === "active" ? "●" : "";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{dot}</div>
      <div style={{ fontSize: 10.5, color: txtColor, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

export default function TrackingScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useApp();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [advancing, setAdvancing] = useState(false);

  function load() {
    api.getOrder(token, id).then(setOrder).catch((e) => setError(e.message));
  }

  useEffect(() => { load(); }, [id]);
  useEffect(() => {
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [id]);

  async function advance() {
    setAdvancing(true);
    try {
      await api.advanceOrderStatus(token, id);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setAdvancing(false);
    }
  }

  if (error) return <div className="screen" style={{ padding: 40 }}><div className="error-banner">⚠️ {error}</div></div>;
  if (!order) return <div className="screen" style={{ padding: 40 }}><div className="hint">جاري التحميل...</div></div>;

  const currentIndex = STEPS.findIndex((s) => s.key === order.status);
  const statusInfo = STATUS_LABEL[order.status] || STATUS_LABEL.processing;

  return (
    <div className="screen">
      <div className="header blob">
        <button className="back-btn" onClick={() => navigate("/orders")}>→</button>
        <div><div className="header-title">تتبع الطلب</div><div className="header-sub">طلب #{order.id}</div></div>
      </div>
      <div className="scroll" style={{ padding: "20px 20px 8px" }}>
        {currentIndex >= 0 && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <Fragment key={s.key}>
                <Step label={s.label} state={i < currentIndex ? "done" : i === currentIndex ? "active" : "pending"} />
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < currentIndex ? "var(--primary)" : "var(--border)", marginTop: -16 }}></div>}
              </Fragment>
            ))}
          </div>
        )}

        <div className="card" style={{ textAlign: "center", marginBottom: 16 }}>
          <div className={`pill ${statusInfo.cls}`} style={{ marginBottom: 8 }}>{statusInfo.icon} {statusInfo.text}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{order.restaurant_name} · الإجمالي {order.total} ₪</div>
        </div>

        {order.status === "delivering" && order.courier_name && (
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{order.courier_name}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>مندوب التوصيل</div>
            </div>
            <a href={`tel:${order.courier_phone}`} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}>📞</a>
          </div>
        )}

        {(order.status === "processing" || order.status === "delivering") && (
          <button className="btn btn-secondary" onClick={advance} disabled={advancing}>
            {advancing ? "..." : "محاكاة: تقديم حالة الطلب (للتجربة فقط)"}
          </button>
        )}
      </div>
    </div>
  );
}