import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAi } from "../ai/context/AiContext";
import { useUserCards } from "../context/UserCardContext";
import "../css/MyCards.css";

import "../ai/css/AIChatThemeStyle.css";
import "../ai/css/AIChatStyle.css";

import logo from "../ai/assets/logo.png";

import exclusiveIcon from "../ai/assets/icons/exclusive.png";
import flightIcon from "../ai/assets/icons/flight-icon.png";
import fashionIcon from "../ai/assets/icons/Fashion.png";
import groceryIcon from "../ai/assets/icons/Grocery.png";
import cardIcon from "../ai/assets/icons/card-icon.png";
import topIcon from "../ai/assets/icons/Top.png";
import electronicsIcon from "../ai/assets/icons/electronics.png";
import mobileIcon from "../ai/assets/icons/Mobile.png";
import hotelIcon from "../ai/assets/icons/hotel-icon.png";
import cardsIcon from "../ai/assets/icons/cards.png";

import sendIcon from "../ai/assets/icons/send-icon.png";
import trashIcon from "../ai/assets/icons/trash.png";
import refreshIcon from "../ai/assets/icons/refresh.png";

import likeIcon from "../ai/assets/icons/like.png";
import dislikeIcon from "../ai/assets/icons/dislike.png";

const HisaveAiPage: React.FC = () => {
  const navigate = useNavigate();
  const { messages, loading, sendMessage, clearChat } = useAi();
  const { cards } = useUserCards();

  const messageEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showMyCardsPopup, setShowMyCardsPopup] = useState(false);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= POPUP CHECK ================= */
  useEffect(() => {
    const shouldOpen = sessionStorage.getItem("openMyCardsPopup");

    if (shouldOpen === "true") {
      setShowMyCardsPopup(true);
      sessionStorage.removeItem("openMyCardsPopup");
    }
  }); // ⚠️ no dependency — runs after render

  /* ================= HANDLERS ================= */

  const handleSend = (text?: string) => {
    const messageText = text ?? input;
    if (!messageText.trim()) return;

    setShowChat(true);
    sendMessage(messageText);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const optionClick = (text: string) => {
    if (text === "Add Cards") {
      navigate("/add-card");
      return;
    }
    handleSend(text);
  };

  const cleanMessage = (text: string) => {
    return text.replace(/\[\d+:\d+:[^\]]+\]/g, "");
  };

  const options = [
    { label: "HiSAVE Exclusive", icon: exclusiveIcon },
    { label: "Cheapest Flights available", icon: flightIcon },
    { label: "Latest Trends in Fashion", icon: fashionIcon },
    { label: "Best Grocery Deals near you", icon: groceryIcon },
    { label: "Add Cards", icon: cardIcon },
    { label: "Top Deals and offer for you", icon: topIcon },
    { label: "Top Discounts on Electronics", icon: electronicsIcon },
    { label: "Exclusive Mobile Offers", icon: mobileIcon },
    { label: "Top Hotel Deals for your stay", icon: hotelIcon },
    { label: "Compare My Cards", icon: cardsIcon },
  ];

  return (
    <div className="ai-chat-container">
      <div className="ai-chat">

        {/* ================= HEADER ================= */}
        <div className="ai-mobile-header">
          <button className="ai-back-btn" onClick={() => navigate(-1)}>←</button>
          <img src={logo} alt="HiSAVE" className="ai-logo" />

          <div className="ai-header-icons">
            <img
              src={trashIcon}
              alt="Clear"
              className="ai-header-icon"
              onClick={() => {
                clearChat();
                setShowChat(false);
              }}
            />
            <img
              src={refreshIcon}
              alt="Refresh"
              className="ai-header-icon"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>

        {/* ================= WELCOME ================= */}
        {!showChat && (
          <>
            <div className="ai-mobile-title">
              <h2>
                Top Offers Available On <br />
                <span>Your Cards, Top Brands & Local Stores</span>
              </h2>
            </div>

            <div className="ai-horizontal-scroll">
              {options.map((item, index) => (
                <div
                  key={index}
                  className="ai-mobile-card"
                  onClick={() => optionClick(item.label)}
                >
                  <img src={item.icon} alt={item.label} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= CHAT ================= */}
        {showChat && (
          <div className="ai-chat-communication">
            <div className="ai-chat-message-list">

              {messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  <div className="ai-chat-user-text-message-block">
                    <div className="ai-chat-user-text-message">
                      {msg.user}
                    </div>
                  </div>

                  {msg.bot && (
                    <div className="ai-chat-system-text-message-block">
                      <div className="ai-chat-system-text-message">
                        <ReactMarkdown>
                          {cleanMessage(msg.bot)}
                        </ReactMarkdown>

                        <div className="ai-feedback-row">
                          <img src={likeIcon} alt="Like" />
                          <img src={dislikeIcon} alt="Dislike" />
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {loading && (
                <div className="ai-chat-system-text-message-block">
                  <div className="ai-chat-system-text-message">
                    Typing...
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>
          </div>
        )}

        {/* ================= INPUT ================= */}
        <div className="ai-chat-search-panel">
          <div className="ai-chat-searchbar-container">
            <input
              className="ai-chat-searchbar"
              value={input}
              placeholder="Ask HiSAVE anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="ai-chat-search-button-container">
            <button
              className="ai-chat-search-button"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <img src={sendIcon} alt="Send" />
            </button>
          </div>
        </div>

      </div>

      {/* ================= MY CARDS POPUP ================= */}
      {showMyCardsPopup && (
        <div className="mycards-overlay">
          <div className="mycards-modal">

            <div className="mycards-header">
              <h2>My Cards</h2>
              <span onClick={() => setShowMyCardsPopup(false)}>×</span>
            </div>

            <div className="mycards-tabs">
              <div className="tab active">
                My Cards ({cards.length})
              </div>
              <div
                className="tab"
                onClick={() => {
                  setShowMyCardsPopup(false);
                  navigate("/add-card");
                }}
              >
                Add New Card
              </div>
            </div>

            <div className="cards-row">
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

          </div>
        </div>
      )}

    </div>
  );
};

export default HisaveAiPage;