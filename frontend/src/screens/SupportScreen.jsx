import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupportScreen() {
  const navigate = useNavigate();
  const [orderRef, setOrderRef] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>→</button>
        <div><div className="header-title">الدعم</div></div>
      </div>
      <div className="scroll" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="https://wa.me/" target="_blank" rel="noreferrer" className="card" style={{ flex: 1, textAlign: "center", padding: "16px 10px", textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>💬</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>واتساب</div>
          </a>
          <a href="mailto:support@rahati.app" className="card" style={{ flex: 1, textAlign: "center", padding: "16px 10px", textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>✉️</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>البريد الإلكتروني</div>
          </a>
          <a href="tel:+963000000000" className="card" style={{ flex: 1, textAlign: "center", padding: "16px 10px", textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>📞</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>اتصال</div>
          </a>
        </div>

        {sent ? (
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700 }}>تم إرسال رسالتك</div>
            <div className="hint" style={{ marginTop: 6 }}>سيتواصل معك فريق الدعم قريبًا</div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="section-title" style={{ marginTop: 6 }}>أو أرسل لنا رسالة</div>
            <div>
              <label className="field-label">الاسم / رقم الطلب (اختياري)</label>
              <input className="input" placeholder="مثال: طلب #10452" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} />
            </div>
            <div>
              <label className="field-label">رسالتك</label>
              <textarea className="input" rows={5} placeholder="اكتب مشكلتك بالتفصيل..." style={{ resize: "none", fontFamily: "inherit" }} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <button className="btn btn-primary">إرسال</button>
          </form>
        )}
      </div>
    </div>
  );
}