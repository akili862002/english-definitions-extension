import { useState, useEffect } from "react";
import { useStorage } from "../../hooks/use-storage";
import { BackIcon } from "./settings.icons";
import { useAppContext } from "../../App";
import { STORAGE_OPENAI_API_KEY } from "../../const/keys";
import { createOpenAI } from "@ai-sdk/openai";

export function Settings() {
  const [key, setKeyState] = useState("");
  const [apiKey, saveApiKey, loading] = useStorage<string>(
    STORAGE_OPENAI_API_KEY,
    ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { setActiveTab } = useAppContext();

  // Set initial key value when loaded from storage
  useEffect(() => {
    if (!loading && apiKey) {
      setKeyState(apiKey);
    }
  }, [loading, apiKey]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const openai = createOpenAI({
        apiKey: apiKey,
      });

      await saveApiKey(key);
      setActiveTab("home");
    } catch (error) {
      console.error("Error saving API key:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <header className="flex gap-2">
        <button
          type="button"
          className="rounded-lg p-1 hover:bg-neutral-100 duration-100 active:bg-neutral-200"
          onClick={() => setActiveTab("home")}
        >
          <BackIcon />
        </button>
        <h3 className="text-lg font-semibold">Settings</h3>
      </header>

      <div className="mt-4">
        <label
          htmlFor="apiKey"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          OpenAI API Key
        </label>
        <div className="relative">
          <input
            id="apiKey"
            type={showKey ? "text" : "password"}
            value={key}
            onChange={(e) => setKeyState(e.target.value)}
            className="px-2 h-9 bg-gray-50 rounded-lg border border-gray-200 w-full pr-10"
            placeholder="sk-..."
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Your API key is stored locally and is never sent to our servers.
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
