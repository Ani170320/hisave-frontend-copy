import React, { useState } from "react";
import "../css/MyCards.css";
import { useUserCards } from "../context/UserCardContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MyCardsPopup: React.FC<Props> = ({ isOpen, onClose }) => {
  const { cards, addCard } = useUserCards();

  const [activeTab, setActiveTab] = useState<"cards" | "add">("cards");
  const [cardType, setCardType] = useState("credit");
  const [network, setNetwork] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardName, setCardName] = useState("");

  if (!isOpen) return null;

  const handleAddCard = () => {
    if (!bankName || !cardName || !network) {
      alert("Please fill all fields");
      return;
    }

    addCard({
      bankName,
      cardName,
      cardType,
      network,
    });

    setBankName("");
    setCardName("");
    setNetwork("");
    setCardType("credit");
    setActiveTab("cards");
  };

  return (
    <div className="mycards-overlay">
      <div className="mycards-modal">

        <div className="mycards-header">
          <h2>My Cards</h2>
          <span onClick={onClose}>×</span>
        </div>

        <div className="mycards-tabs">
          <div
            className={`tab ${activeTab === "cards" ? "active" : ""}`}
            onClick={() => setActiveTab("cards")}
          >
            My Cards ({cards.length})
          </div>

          <div
            className={`tab ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            Add New Card
          </div>
        </div>

        {activeTab === "cards" && (
          <div className="cards-row">
            {cards.length === 0 && (
              <div className="no-cards-box">
                No cards added yet.
              </div>
            )}

            {cards.map((card, index) => (
              <div key={index} className="card-box">
                <div className="card-top">
                  <span>{card.network}</span>
                  <span className="show-offer">Show Offer</span>
                </div>
                <div className="card-bottom">
                  <span>{card.cardName}</span>
                  <span>{card.cardType} card</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "add" && (
          <>
            <div className="form-group">
              <label>Bank Name</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              >
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
                {["Mastercard", "Visa", "RuPay", "Amex"].map((item) => (
                  <div
                    key={item}
                    className={network === item ? "network active" : "network"}
                    onClick={() => setNetwork(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <button className="addcard-button" onClick={handleAddCard}>
              Add Card
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default MyCardsPopup;