"use client";

import ProductModal from "@/components/user/modals/Product";
import React, { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext({
  isShown: false,
  product: {},
  setProduct: () => {},
});

export default function ProductContextProvider({ children }) {
  const [isShown, setIsShown] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (product) {
      setIsShown(true);
    } else {
      setIsShown(false);
    }
  }, [product]);

  return (
    <ProductContext.Provider
      value={{
        isShown,
        product,
        setProduct,
      }}
    >
      {children}
      <ProductModal
        product={product}
        open={isShown}
        onOpenChange={(isOpen) => {
          if (!isOpen) setProduct(null);
        }}
      />
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error("useProduct must be used inside <ProductContextProvider>");
  return ctx;
}
