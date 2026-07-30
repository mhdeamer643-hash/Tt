import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";

export default function OtpScreen() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devHint, setDevHint] = useState("");
  const inputsRef = useRef([]);

  async function submitPhone(e) {
    e.preventDefault();
    setError("");
    if (!phone.trim()) return setError("يرجى إدخال رقم الهاتف");
    setLoading(true);
    try {
      const res = await api.requestOtp(phone.trim());
      setStep("otp");
      if (res.dev_otp_code) setDevHint(`(وضع التطوير) الرمز: ${res.dev_otp_code}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDigit(i, val) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 3) inputsRef.current[i + 1]?.focus();
  }

  async function submitOtp(e) {
    e.preventDefault();
    setError("");
    const full = code.join("");
    if (full.length < 4) return setError("يرجى إدخال الرمز كاملاً");
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone.trim(), full);
      login(res.user, res.token);
      navigate("/city");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => (step === "otp" ? setStep("phone") : navigate(-1))}>→</button>
        <div><div className="header-title">تأكيد رقم الهاتف</div></div>
      </div>

      <div className="scroll" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 22 }}>
        {step === "phone" ? (
          <form onSubmit={submitPhone} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="field-label">رقم الهاتف</label>
              <input className="input" placeholder="09xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {error && <div className="error-banner">⚠️ {error}</div>}
            <button className="btn btn-primary" disabled={loading}>{loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}</button>
          </form>
        ) : (
          <form onSubmit={submitOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div className="field-label">رقم الهاتف</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{phone}</div>
              </div>
              <button type="button" className="btn-ghost" style={{ textDecoration: "underline" }} onClick={() => setStep("phone")}>تعديل</button>
            </div>

            <div>
              <div className="field-label" style={{ marginBottom: 12 }}>أدخل الرمز المرسل إليك (4 أرقام)</div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className="input"
                    maxLength={1}
                    style={{ width: 56, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700 }}
                    value={d}
                    onChange={(e) => handleDigit(i, e.target.value)}
                  />
                ))}
              </div>
              {devHint && <div className="hint" style={{ marginTop: 10 }}>{devHint}</div>}
            </div>

            {error && <div className="error-banner">⚠️ {error}</div>}

            <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
              لم يصل الرمز؟{" "}
              <span style={{ color: "var(--primary)", fontWeight: 700, cursor: "pointer" }} onClick={submitPhone}>
                إعادة الإرسال
              </span>
            </div>

            <button className="btn btn-primary" disabled={loading}>{loading ? "جاري التحقق..." : "تأكيد"}</button>
          </form>
        )}
      </div>
    </div>
  );
}