import React, { createContext, useContext, useEffect, useState } from "react";
import HomeService from "../services/HomeService";
import { useAuth } from "./AuthContext";

interface UserCard {
  id?: string;
  bankName: string;
  cardName: string;
  pmtType: string;
  network: string;
}

interface UserCardContextType {
  cards: UserCard[];
  fetchCards: () => Promise<void>;
  addCard: (card: UserCard) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
}

const UserCardContext = createContext<UserCardContextType | null>(null);

export const UserCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [cards, setCards] = useState<UserCard[]>([]);
  const { user } = useAuth();

  // ✅ Fetch cards from backend
  const fetchCards = async () => {
    if (!user?.uid) return;

    try {
      const response = await HomeService.getPaymentMethod({ uid: user.uid });
      setCards(response || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  // ✅ Add card via backend
  const addCard = async (card: UserCard) => {
    if (!user?.uid) return;

    try {
      await HomeService.addPaymentMethod({
        uid: user.uid,
        paymentMethod: card
      });

      await fetchCards(); // refresh after add
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  // ✅ Delete card via backend
  const deleteCard = async (id: string) => {
    if (!user?.uid) return;

    try {
      await HomeService.deletePaymentMethod({
        id,
        uid: user.uid
      });

      await fetchCards(); // refresh after delete
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  // 🔥 Auto fetch when user logs in
  useEffect(() => {
    if (user?.uid) {
      fetchCards();
    }
  }, [user]);

  return (
    <UserCardContext.Provider value={{ cards, fetchCards, addCard, deleteCard }}>
      {children}
    </UserCardContext.Provider>
  );
};

export const useUserCards = () => {
  const context = useContext(UserCardContext);
  if (!context) {
    throw new Error("useUserCards must be used within UserCardProvider");
  }
  return context;
};