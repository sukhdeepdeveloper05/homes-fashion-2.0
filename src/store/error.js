"use client";
import { createContext, useContext, useState } from "react";

const ErrorContext = createContext({
  isError: false,
  setIsError: () => {},
});
export const useError = () => useContext(ErrorContext);

export function ErrorProvider({ children }) {
  const [isError, setIsError] = useState(false);
  return (
    <ErrorContext.Provider value={{ isError, setIsError }}>
      {children}
    </ErrorContext.Provider>
  );
}
