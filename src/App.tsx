import { createContext, useContext, useEffect, useState } from "react";
import { Home } from "./tabs/home/home";
import { Settings } from "./tabs/settings/settings";
import { History, HistoryProvider } from "./tabs/history/history";

const tabs = [
  {
    id: "home",
    label: "Home",
  },
  {
    id: "history",
    label: "History",
  },
  {
    id: "settings",
    label: "Settings",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

const AppContext = createContext<{
  activeTab: TabId;
  setActiveTab: (tabId: TabId) => void;
}>(null as any);

export const useAppContext = () => useContext(AppContext);

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <HistoryProvider>
      <AppContext.Provider value={{ activeTab, setActiveTab }}>
        <div className="w-full p-4 max-w-md text-sm">
          {activeTab === "home" && <Home />}
          {activeTab === "history" && <History />}
          {activeTab === "settings" && <Settings />}
        </div>
      </AppContext.Provider>
    </HistoryProvider>
  );
}

export default App;
