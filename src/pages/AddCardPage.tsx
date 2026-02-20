import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AddCardPage.css";
import { useAi } from "../ai/context/AiContext";
import { useAuth } from "../context/AuthContext";
import HomeService from "../services/HomeService";


interface PaymentMethod {
  id: string;
  paymentMethod: {
    pmtType: string;
    network: string;
    cardName: string;
    bankName: string;
  };
}

const AddCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendMessage } = useAi();
  const { user } = useAuth();
  const uid = user?.uid;

  const [activeTab, setActiveTab] = useState<"cards" | "add">("add");
  const [cardType, setCardType] = useState("credit");
  const [network, setNetwork] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardName, setCardName] = useState("");
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uid) {
      fetchCards();
    }
  }, [uid]);

  const fetchCards = async () => {
    if (!uid) return;

    try {
      const response = await HomeService.getPaymentMethod({ uid });
      setCards(response || []);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  const handleAddCard = async () => {
    if (!uid) {
      alert("User not logged in");
      return;
    }

    if (!bankName || !cardName || !network) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      uid: uid,
      paymentMethod: {
        pmtType: cardType,
        network: network,
        cardName: cardName,
        bankName: bankName,
        walletType: null,
        upiType: null,
      }
    };

    try {
      setLoading(true);

      await HomeService.addPaymentMethod(payload);

      const updatedCards = await HomeService.getPaymentMethod({ uid });
      setCards(updatedCards);

      // Format cards for AI
      const formattedCards = updatedCards.map(card => ({
        bankName: card.paymentMethod.bankName,
        network: card.paymentMethod.network,
        pmtType: card.paymentMethod.pmtType
      }));

      // Send to AI (backend already handles logic)
      sendMessage(
        "Show best offers on flights and restaurants using my cards",
        JSON.stringify(formattedCards)
      );

      navigate("/hisave-ai");

    } catch (error) {
      console.log("Add error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!uid) return;

    try {
      await HomeService.deletePaymentMethod({ id, uid });
      await fetchCards();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div className="addcard-overlay">
      <div className="addcard-modal">
        <h2>My Cards</h2>

        <div className="addcard-tabs">
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
            {cards.map((card) => (
              <div key={card.id} className="card-box">
                <div className="card-top">
                  <span>{card.paymentMethod.network}</span>
                  <span
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    Delete
                  </span>
                </div>
                <div className="card-bottom">
                  <span>{card.paymentMethod.cardName}</span>
                  <span>{card.paymentMethod.pmtType} card</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "add" && (
          <>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            >
              <option value="">Select Bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
            </select>

            <input
              placeholder="Card Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />

            <input
              placeholder="Network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
            />

            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <button onClick={handleAddCard}>
              {loading ? "Adding..." : "Add Card"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddCardPage;