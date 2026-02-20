import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/CheckoutPage.css";

interface SelectedPlan {
    id: number;
    name: string;
    totalPrice: string;
    pricePerMonth: string;
    durationMonths: number;
    duration: string;
    currency: string;
}

type PaymentTab = "apps" | "upi-id" | "qr";

const UPI_APPS = [
    { id: "gpay", label: "Google Pay", color: "#4285F4", icon: "G" },
    { id: "phonepe", label: "PhonePe", color: "#5F259F", icon: "P" },
    { id: "paytm", label: "Paytm", color: "#00BAF2", icon: "Pt" },
    { id: "bhim", label: "BHIM", color: "#FF6600", icon: "B" },
    { id: "amazonpay", label: "Amazon Pay", color: "#FF9900", icon: "A" },
];

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const plan: SelectedPlan | undefined = location.state?.selectedPlan;

    const [activeTab, setActiveTab] = useState<PaymentTab>("apps");
    const [selectedApp, setSelectedApp] = useState<string>("");
    const [upiId, setUpiId] = useState("");
    const [upiVerified, setUpiVerified] = useState<null | boolean>(null);
    const [verifying, setVerifying] = useState(false);
    const [paying, setPaying] = useState(false);

    if (!plan) {
        return (
            <div className="co-wrapper">
                <div className="co-error-box">
                    <h2>No plan selected</h2>
                    <button onClick={() => navigate("/pricing")}>← Back to Plans</button>
                </div>
            </div>
        );
    }

    const handleVerifyUpi = () => {
        if (!upiId.includes("@")) return;
        setVerifying(true);
        setUpiVerified(null);
        setTimeout(() => {
            setVerifying(false);
            setUpiVerified(true); // mock success
        }, 1500);
    };

    const handlePay = () => {
        setPaying(true);
        setTimeout(() => setPaying(false), 2000); // mock — will wire real API later
    };

    const canPay =
        (activeTab === "apps" && selectedApp !== "") ||
        (activeTab === "upi-id" && upiVerified === true) ||
        activeTab === "qr";

    return (
        <div className="co-wrapper">
            <div className="co-container">

                {/* Back */}
                <button className="co-back" onClick={() => navigate("/pricing")}>
                    ← Back to Plans
                </button>

                <div className="co-layout">

                    {/* ─── LEFT: Order Summary ─── */}
                    <div className="co-summary">
                        <h2 className="co-section-title">Order Summary</h2>

                        <div className="co-plan-card">
                            <div className="co-plan-header">
                                <span className="co-plan-name">{plan.name}</span>
                                {plan.durationMonths === 12 && (
                                    <span className="co-best-tag">Best Value</span>
                                )}
                            </div>
                            <div className="co-plan-duration">{plan.duration}</div>

                            <div className="co-price-row">
                                <span>Subtotal</span>
                                <span>₹{plan.totalPrice}</span>
                            </div>
                            {plan.durationMonths > 1 && (
                                <div className="co-price-row muted">
                                    <span>Per month</span>
                                    <span>₹{plan.pricePerMonth}/mo</span>
                                </div>
                            )}
                            <div className="co-price-row">
                                <span>GST (18%)</span>
                                <span>Included</span>
                            </div>
                            <div className="co-divider" />
                            <div className="co-price-row total">
                                <span>Total</span>
                                <span>₹{plan.totalPrice}</span>
                            </div>
                        </div>

                        <ul className="co-features">
                            <li>✓ Ad-Free Experience</li>
                            <li>✓ AI Smart Searches</li>
                            <li>✓ Offer Unlocks</li>
                            <li>✓ Priority Support</li>
                            <li>✓ Instant Activation</li>
                        </ul>

                        <div className="co-secure-badge">🔒 100% Secure &amp; Encrypted</div>
                    </div>

                    {/* ─── RIGHT: UPI Payment ─── */}
                    <div className="co-payment">
                        <h2 className="co-section-title">Pay via UPI</h2>

                        {/* Tabs */}
                        <div className="co-tabs">
                            <button
                                className={`co-tab ${activeTab === "apps" ? "active" : ""}`}
                                onClick={() => setActiveTab("apps")}
                            >
                                UPI Apps
                            </button>
                            <button
                                className={`co-tab ${activeTab === "upi-id" ? "active" : ""}`}
                                onClick={() => setActiveTab("upi-id")}
                            >
                                UPI ID
                            </button>
                            <button
                                className={`co-tab ${activeTab === "qr" ? "active" : ""}`}
                                onClick={() => setActiveTab("qr")}
                            >
                                QR Code
                            </button>
                        </div>

                        {/* ── Tab: UPI Apps ── */}
                        {activeTab === "apps" && (
                            <div className="co-tab-content">
                                <p className="co-hint">Select your preferred UPI app</p>
                                <div className="co-app-grid">
                                    {UPI_APPS.map((app) => (
                                        <button
                                            key={app.id}
                                            className={`co-app-btn ${selectedApp === app.id ? "selected" : ""}`}
                                            onClick={() => setSelectedApp(app.id)}
                                        >
                                            <div
                                                className="co-app-icon"
                                                style={{ background: app.color }}
                                            >
                                                {app.icon}
                                            </div>
                                            <span>{app.label}</span>
                                            {selectedApp === app.id && (
                                                <div className="co-app-check">✓</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Tab: UPI ID ── */}
                        {activeTab === "upi-id" && (
                            <div className="co-tab-content">
                                <p className="co-hint">Enter your UPI ID to pay</p>
                                <div className="co-upi-row">
                                    <input
                                        type="text"
                                        className={`co-upi-input ${upiVerified === true ? "valid" :
                                                upiVerified === false ? "invalid" : ""
                                            }`}
                                        placeholder="yourname@upi"
                                        value={upiId}
                                        onChange={(e) => {
                                            setUpiId(e.target.value);
                                            setUpiVerified(null);
                                        }}
                                    />
                                    <button
                                        className="co-verify-btn"
                                        onClick={handleVerifyUpi}
                                        disabled={verifying || !upiId.includes("@")}
                                    >
                                        {verifying ? "..." : "Verify"}
                                    </button>
                                </div>
                                {upiVerified === true && (
                                    <p className="co-upi-status success">✓ UPI ID verified</p>
                                )}
                                {upiVerified === false && (
                                    <p className="co-upi-status error">✗ Invalid UPI ID</p>
                                )}
                                <p className="co-upi-examples">
                                    Examples: name@okaxis, name@ybl, name@paytm
                                </p>
                            </div>
                        )}

                        {/* ── Tab: QR Code ── */}
                        {activeTab === "qr" && (
                            <div className="co-tab-content co-qr-section">
                                <p className="co-hint">Scan QR with any UPI app</p>
                                <div className="co-qr-box">
                                    <div className="co-qr-placeholder">
                                        <div className="co-qr-mock">
                                            {/* mock QR pattern */}
                                            <div className="qr-corner tl" />
                                            <div className="qr-corner tr" />
                                            <div className="qr-corner bl" />
                                            <div className="qr-logo">₹</div>
                                        </div>
                                    </div>
                                    <p className="co-qr-label">
                                        Scan to pay <strong>₹{plan.totalPrice}</strong>
                                    </p>
                                    <p className="co-qr-sub">
                                        Open GooglePay / PhonePe / Paytm → Scan QR
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pay Button */}
                        <button
                            className={`co-pay-btn ${canPay ? "ready" : "disabled"}`}
                            disabled={!canPay || paying}
                            onClick={handlePay}
                        >
                            {paying ? (
                                <span className="co-pay-spinner" />
                            ) : (
                                `Pay ₹${plan.totalPrice}`
                            )}
                        </button>

                        <p className="co-footer-note">
                            By paying you agree to our{" "}
                            <span
                                className="co-link"
                                onClick={() => navigate("/terms-conditions")}
                            >
                                Terms &amp; Conditions
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
