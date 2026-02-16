import React, { createContext, useContext, useState } from "react";

interface UserCard {
  bankName: string;
  cardName: string;
  cardType: string;
  network: string;
}

interface UserCardContextType {
  cards: UserCard[];
  addCard: (card: UserCard) => void;
}

const UserCardContext = createContext<UserCardContextType | null>(null);

export const UserCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<UserCard[]>([]);

  const addCard = (card: UserCard) => {
    setCards((prev) => [...prev, card]);
  };

  return (
    <UserCardContext.Provider value={{ cards, addCard }}>
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