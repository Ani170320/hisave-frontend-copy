// context/SearchContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  showSearchResults: boolean;
  setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        showSearchResults,
        setShowSearchResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used inside SearchProvider");
  }
  return context;
};