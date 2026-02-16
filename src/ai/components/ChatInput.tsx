import React, { useState } from "react";
import { useAi } from "../context/AiContext";

const ChatInput: React.FC = () => {
  const { sendMessage, loading } = useAi();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-chat-search-panel">
      <div className="ai-chat-searchbar-container">
        <input
          className="ai-chat-searchbar"
          placeholder="Ask HiSAVE anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="ai-chat-search-button-container">
        <button
          className="ai-chat-search-button"
          onClick={handleSend}
          disabled={loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatInput;