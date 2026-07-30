import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const items = [
    { to: "/home", icon: "🏠", label: "الرئيسية" },
    { to: "/orders", icon: "📦", label: "طلباتي" },
    { to: "/cart", icon: "🛒", label: "السلة" },
    { to: "/profile", icon: "👤", label: "حسابي" },
  ];
  return (
    <div className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <div className="nav-dot">{item.icon}</div>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}