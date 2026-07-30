import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import BottomNav from "../components/BottomNav";

function MenuRow({ icon, label, danger, onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 4px", borderBottom: "1px solid var(--border)", cursor: "pointer" }} onClick={onClick}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{icon}</div>
      <div style={{ flex: 1, fontWeight: 600, fontSize: 13.5, color: danger ? "var(--danger)" : "var(--text)" }}>{label}</div>
      <div style={{ color: "var(--muted)" }}>‹</div>
    </div>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useApp();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="screen">
      <div className="header blob" style={{ alignItems: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧑</div>
        <div>
          <div className="header-title">{user?.name || "زبون راحتي"}</div>
          <div className="header-sub">{user?.phone}</div>
        </div>
      </div>
      <div className="scroll" style={{ padding: "14px 20px" }}>
        <MenuRow icon="📍" label="عناويني" />
        <MenuRow icon="📦" label="طلباتي السابقة" onClick={() => navigate("/orders")} />
        <MenuRow icon="💳" label="طرق الدفع" />
        <MenuRow icon="🔔" label="الإشعارات" />
        <MenuRow icon="🎧" label="الدعم" onClick={() => navigate("/support")} />
        <MenuRow icon="🚪" label="تسجيل خروج" danger onClick={handleLogout} />
      </div>
      <BottomNav />
    </div>
  );
}