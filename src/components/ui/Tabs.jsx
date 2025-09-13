import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../shadcn/tabs";
import { motion } from "framer-motion";

export default function CustomTabs({ children, tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0].slug);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="bg-white gap-2 mb-6 border-b border-gray-200 lg:overflow-auto p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab.slug}
            key={tab.slug}
            className="text-base whitespace-nowrap relative font-semibold data-[state=active]:text-foreground-primary text-foreground-secondary border-0 inline-flex h-full p-0 px-5 pb-3 group"
          >
            {tab.name}
            {tab.slug === activeTab && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground-primary rounded-full"
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </Tabs>
  );
}
