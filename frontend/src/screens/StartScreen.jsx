import { useNavigate } from "react-router-dom";

export default function StartScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen" style={{ padding: "40px 28px", justifyContent: "space-between" }}>
      <div />
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 84, height: 84, background: "var(--primary)", borderRadius: 24, margin: "0 auto 22px",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          fontFamily: "Cairo", fontWeight: 800, fontSize: 30,
        }}>ر</div>
        <div style={{ fontFamily: "Cairo", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>مرحبًا بك في راحتي</div>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>اطلب طعامك بسهولة، من مطعمك المفضل لباب بيتك</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>ابدأ</button>
        <div className="hint" style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/support")}>
          تحتاج مساعدة؟ تواصل مع الدعم
        </div>
      </div>
    </div>
  );
}