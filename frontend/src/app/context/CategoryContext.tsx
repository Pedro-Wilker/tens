"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CategoryContextType {
  categoryId: number | null;
  subcategoryId: number | null;
  setCategoryId: (id: number | null) => void;
  setSubcategoryId: (id: number | null) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null);

  const value = {
    categoryId,
    subcategoryId,
    setCategoryId,
    setSubcategoryId,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};