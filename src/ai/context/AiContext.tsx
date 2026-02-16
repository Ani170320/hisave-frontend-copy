import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_BASE_URL = "https://jmiazr2sjf.ap-south-1.awsapprunner.com";

interface Message {
  id: number;
  user: string;
  bot: string;
}

interface AiContextType {
  messages: Message[];
  loading: boolean;
  sendMessage: (text: string, paymentMethods?: string) => void;
  clearChat: () => void;
}

const AiContext = createContext<AiContextType | null>(null);

export const AiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      transports: ["polling", "websocket"], // ✅ allow fallback
      withCredentials: true
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to AI server");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket error:", err);
    });

    socketRef.current.on("chat response new line", (msg: string) => {
      setLoading(false);

      setMessages((prev) => {
        if (prev.length === 0) return prev;

        const updated = [...prev];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          bot: updated[lastIndex].bot + msg,
        };

        return updated;
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (text: string, paymentMethods: string = "[]") => {
    if (!text.trim()) return;
    if (!socketRef.current) return;

    setLoading(true);

    const newId = Date.now();

    setMessages((prev) => [
      ...prev,
      { id: newId, user: text, bot: "" },
    ]);

    socketRef.current.emit("chat search", {
      who: "43275e01-9301-496f-a833-6259ba87af13",
      data: text,
      payment_methods: paymentMethods,
    });
  };

  const clearChat = () => setMessages([]);

  return (
    <AiContext.Provider value={{ messages, loading, sendMessage, clearChat }}>
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => {
  const context = useContext(AiContext);
  if (!context) throw new Error("useAi must be used inside AiProvider");
  return context;
};