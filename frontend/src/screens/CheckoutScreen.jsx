import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";

const DELIVERY_FEE = 10;

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const { cart, clearCart, token, user } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const total = subtotal + DELIVERY_FEE;

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocError("متصفحك لا يدعم تحديد الموقع");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError("تعذّر تحديد الموقع، يرجى السماح بالوصول للموقع من إعدادات المتصفح");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function submitOrder() {
    setError("");
    if (!location) return setError("يرجى تحديد موقعك أولاً");
    setSubmitting(true);
    try {
      const order = await api.createOrder(token, {
        restaurant_id: cart.restaurantId,
        items: cart.items.map((i) => ({ dish_id: i.id, quantity: i.quantity })),
        address_note: note,
        lat: location.lat,
        lng: location.lng,
        contact_name: name,
        contact_phone: phone,
      });
      clearCart();
      navigate(`/tracking/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>→</button>
        <div><div className="header-title">إتمام الطلب</div></div>
      </div>
      <div className="scroll" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label className="field-label">الاسم</label>
          <input className="input" placeholder="اسمك الكامل" style={{ marginBottom: 10 }} value={name} onChange={(e) => setName(e.target.value)} />
          <label className="field-label">رقم الهاتف</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="card">
          <div className="section-title">موقع التوصيل</div>
          <div className="img-placeholder" style={{ height: 130, marginBottom: 12 }}>🗺️ خريطة</div>

          {!location ? (
            <button className="btn btn-secondary" onClick={detectLocation} disabled={locating}>
              {locating ? "جاري تحديد الموقع..." : "📍 تحديد موقعي الحالي"}
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#E3F3E9", borderRadius: 12, padding: "10px 12px" }}>
              <span className="pill pill-green">✓ تم تحديد الموقع</span>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </div>
          )}
          {locError && <div className="error-banner" style={{ marginTop: 10 }}>⚠️ {locError}</div>}
          <div className="hint" style={{ marginTop: 8 }}>لا يمكن تعديل الموقع بعد تحديده، يمكنك إعادة الطلب من جديد لتغييره</div>
        </div>

        <div>
          <label className="field-label">ملاحظات إضافية (اختياري)</label>
          <input className="input" placeholder="مثال: الطابق الثاني، بجانب الصيدلية" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontFamily: "Cairo", fontSize: 15 }}>
            <span>الإجمالي</span><span>{total} ل.س</span>
          </div>
          <div className="hint" style={{ marginTop: 8 }}>الدفع نقدًا عند الاستلام</div>
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}
      </div>
      <div className="bottom-bar">
        <button className="btn btn-primary" onClick={submitOrder} disabled={submitting || !location}>
          {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
        </button>
      </div>
    </div>
  );
}
