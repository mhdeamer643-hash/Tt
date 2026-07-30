
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const DELIVERY_FEF = 10;

export default function CartScreen() {
    const navigate = useNavigate();
    const { cart, updateQuantity } = useApp();

    const subtotal = cart.items.reduce((s, i) => s + i.quantity * i.price, 0);
    const total = cart.items.length ? subtotal + DELIVERY_FEF : 0;

    if (cart.items.length === 0) {
        return (
            <div className="screen">
                <div className="header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <div><div>سلة فاضية</div></div>
                    </button>
                </div>
                <div className="scroll" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 14 }}>
                    <div style={{ fontSize: 56 }}></div>
                    <div style={{ fontFamily: "Cairo", fontWeight: 700, fontSize: 16 }}>سلنك فاضية</div>
                    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>ما زلت ما ضفت شي، تصفح المطاعم وابدأ طلبك</div>
                </div>
            </div>
        );
    }
}
