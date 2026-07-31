import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const DELIVERY_FEE = 10;

export default function CartScreen() {
  const navigate = useNavigate();
  const { cart, updateQuantity } = useApp();

  const subtotal = cart.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const total = cart.items.length ? subtotal + DELIVERY_FEE : 0;

  if (cart.items.length === 0) {
    return (
      <div className="screen">
        <div className="header">
          <button className="back-btn" onClick={() => navigate(-1)}>→</button>
          <div><div className="header-title">سلتي</div></div>
        </div>
        <div className="scroll" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 14 }}>
          <div style={{ fontSize: 56 }}>🛒</div>
          <div style={{ fontFamily: "Cairo", fontWeight: 700, fontSize: 16 }}>سلتك فاضية</div>
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>ما زلت ما ضفت شي، تصفح المطاعم وابدأ طلبك</div>
          <button className="btn btn-primary" style={{ width: "auto", padding: "13px 28px", marginTop: 8 }} onClick={() => navigate("/home")}>تصفح المطاعم</button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>→</button>
        <div><div className="header-title">سلتي</div><div className="header-sub">{cart.restaurantName}</div></div>
      </div>
      <div className="scroll" style={{ padding: "8px 20px" }}>
        {cart.items.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <div className="img-placeholder" style={{ width: 56, height: 56 }}>صورة</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{item.name_ar}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg)", borderRadius: 999, padding: "5px 10px" }}>
              <button style={{ border: "none", background: "none", fontWeight: 700, cursor: "pointer" }} onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{item.quantity}</span>
              <button style={{ border: "none", background: "none", fontWeight: 700, cursor: "pointer" }} onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, width: 44, textAlign: "left" }}>{item.price * item.quantity} ₪</div>
          </div>
        ))}

        <div className="card" style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)" }}>
            <span>المجموع الفرعي</span><span>{subtotal} ₪</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)" }}>
            <span>رسوم التوصيل</span><span>{DELIVERY_FEE} ₪</span>
          </div>
          <div style={{ borderTop: "1px dashed var(--border)", margin: "4px 0" }}></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontFamily: "Cairo", fontSize: 15 }}>
            <span>الإجمالي</span><span>{total} ₪</span>
          </div>
        </div>
      </div>
      <div className="bottom-bar">
        <button className="btn btn-primary" onClick={() => navigate("/checkout")}>المتابعة للدفع</button>
      </div>
    </div>
  );
}