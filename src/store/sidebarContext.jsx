"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext({
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  isMobile: false,
});

export function SidebarContextProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const miniSidebar = localStorage.getItem("miniSidebar") ?? "false";
      setIsSidebarOpen(JSON.parse(miniSidebar));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("miniSidebar", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  return useContext(SidebarContext);
}
