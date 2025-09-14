import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useStorage } from "../../hooks/use-storage";
import { STORAGE_SEARCH_HISTORY } from "../../const/keys";
import { useAppContext } from "../../App";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BackIcon } from "../settings/settings.icons";
dayjs.extend(relativeTime);

// Define the history item type
export interface HistoryItem {
  id: string;
  query: string;
  result: string;
  timestamp: number;
}

// Create a context to share the selected query across components
export const HistoryContext = createContext<{
  selectedQuery: string | null;
  setSelectedQuery: (query: string | null) => void;
}>({
  selectedQuery: null,
  setSelectedQuery: () => {},
});

export const useHistoryContext = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

  return (
    <HistoryContext.Provider value={{ selectedQuery, setSelectedQuery }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const History = () => {
  const { setActiveTab } = useAppContext();
  const [history, setHistory] = useStorage<HistoryItem[]>(
    STORAGE_SEARCH_HISTORY,
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<string | null>(
    null
  );

  useEffect(() => {
    setLoading(false);
  }, [history]);

  const clearHistory = async () => {
    await setHistory([]);
  };

  const deleteHistoryItem = async (id: string) => {
    await setHistory(history.filter((item) => item.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const goToHome = (query: string) => {
    // Store the query in localStorage so the home component can access it
    localStorage.setItem("selected_query", query);
    setActiveTab("home");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg p-1 hover:bg-neutral-100 duration-100 active:bg-neutral-200"
            onClick={() => setActiveTab("home")}
          >
            <BackIcon />
          </button>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search History
          </h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
          >
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          <p>No search history yet</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <button
                  onClick={() => goToHome(item.query)}
                  className="text-blue-600 hover:underline font-medium text-left"
                >
                  {item.query}
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {dayjs(item.timestamp).fromNow()}
                  </span>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
