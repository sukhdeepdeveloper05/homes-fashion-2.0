"use client";

import React, { createContext, useContext, useState } from "react";

const SidebarFormContext = createContext({
  isShown: false,
  show: () => {},
  close: () => {},
  initialData: {},
  setInitialData: () => {},
});

export default function SidebarFormContextProvider({ children }) {
  const [isShown, setIsShown] = useState(false);
  const [initialData, setInitialData] = useState({});

  return (
    <SidebarFormContext.Provider
      value={{
        isShown,
        show: () => setIsShown(true),
        close: () => {
          setIsShown(false);
        },
        initialData,
        setInitialData,
      }}
    >
      {children}
    </SidebarFormContext.Provider>
  );
}

export function useSidebarFormContext() {
  return useContext(SidebarFormContext);
}
