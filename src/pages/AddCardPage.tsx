import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AddCardPage.css";
import { useUserCards } from "../context/UserCardContext";
import { useAi } from "../ai/context/AiContext";

const AddCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCard, cards } = useUserCards();
  const { sendMessage } = useAi();

  const [cardType, setCardType] = useState("credit");
  const [network, setNetwork] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardName, setCardName] = useState("");

  const networks = [
    { name: "Mastercard", img: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    { name: "Visa", img: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "RuPay", img: "https://upload.wikimedia.org/wikipedia/commons/5/51/RuPay.svg" },
    { name: "Amex", img: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" }
  ];

  const handleAddCard = () => {
    if (!bankName || !cardName || !network) {
      alert("Please fill all fields");
      return;
    }

    const newCard = {
      bankName,
      cardName,
      cardType,
      network,
    };

    addCard(newCard);

    const paymentMethods = JSON.stringify([...cards, newCard]);
    sendMessage("Show offers for my cards", paymentMethods);

    // 🔥 Trigger popup
    sessionStorage.setItem("openMyCardsPopup", "true");

    // 🔥 Force route change
    navigate("/hisave-ai?cards=updated");
  };

  return (
    <div className="addcard-overlay">
      <div className="addcard-modal">
        <div className="addcard-header">
          <h2>My Cards</h2>
          <span className="close-btn" onClick={() => navigate(-1)}>×</span>
        </div>

        <div className="addcard-tabs">
          <div className="tab">My Cards ({cards.length})</div>
          <div className="tab active">Add New Card</div>
        </div>

        <div className="form-group">
          <label>Bank Name</label>
          <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
            <option value="">e.g. HDFC</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>SBI</option>
          </select>
        </div>

        <div className="form-group">
          <label>Card Type</label>
          <div className="card-type-toggle">
            <div
              className={cardType === "credit" ? "type-btn active" : "type-btn"}
              onClick={() => setCardType("credit")}
            >
              Credit Card
            </div>
            <div
              className={cardType === "debit" ? "type-btn active" : "type-btn"}
              onClick={() => setCardType("debit")}
            >
              Debit Card
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Card Name</label>
          <input
            type="text"
            placeholder="e.g. HDFC Moneyback+"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Network</label>
          <div className="network-row">
            {networks.map((item) => (
              <div
                key={item.name}
                className={network === item.name ? "network active" : "network"}
                onClick={() => setNetwork(item.name)}
              >
                <img src={item.img} alt={item.name} />
              </div>
            ))}
          </div>
        </div>

        <button className="addcard-button" onClick={handleAddCard}>
          Add Card
        </button>
      </div>
    </div>
  );
};

export default AddCardPage;