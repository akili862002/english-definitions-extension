import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { LoadingIcon, MagicIcon, SettingsIcon } from "./icons";
import { Settings } from "./components/Settings";

const defaultApiKey = import.meta.env.VITE_OPENAI_API_KEY || "";

function App() {
  const [text, setText] = useState("");
  const [isPressedTranslated, setIsPressedTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const loadOpenAI = async () => {
    const result = await chrome.storage.sync.get(["openaiApiKey"]);
    if (result.openaiApiKey) {
      const apiKey = result.openaiApiKey;

      if (apiKey) {
        const openai = createOpenAI({
          apiKey: apiKey,
        });
        return openai;
      }
    }
  };

  useEffect(() => {
    const handleLoad = async () => {
      if (!chrome.tabs) return;

      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!tab.id) return;

        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            return window.getSelection()?.toString() || "";
          },
        });

        const selectedText = results[0].result;
        if (selectedText) {
          setText(selectedText);
          translate(selectedText);
        }
      } catch (error) {
        console.error("Error getting selected text:", error);
      }
    };

    handleLoad();
  }, []);

  const translate = async (inputText: string) => {
    try {
      setTranslatedText("");
      setLoading(true);
      setIsPressedTranslated(true);

      const openai = await loadOpenAI();

      if (!openai) {
        setTranslatedText("Please set your OpenAI API key in the settings.");
        setLoading(false);
        return;
      }

      const { textStream } = streamText({
        model: openai("gpt-4.1"),
        prompt: `You are a translator assistant, translate for me input word i type in english
return 
 - the meanings of that
 - example for each meaning
 - do not ask more question

Input: ${inputText}
 `,
      });

      for await (const textPart of textStream) {
        setTranslatedText((prev) => prev + textPart);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Có lỗi xảy ra khi dịch. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 max-w-md text-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Interpretation</h2>
        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          title="Settings"
        >
          <SettingsIcon />
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">Original Text</h3>
        <div className="flex gap-1 items-center mt-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="px-2 flex-1 h-9 bg-gray-50 rounded-lg border border-gray-200 w-full"
            placeholder="Enter text to translate"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                translate(text);
                e.preventDefault();
              }
            }}
          />
          <button
            type="button"
            className="px-2 h-9 flex-shrink-0 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed active:bg-blue-700"
            onClick={() => translate(text)}
            disabled={loading}
          >
            Translate
          </button>
        </div>
      </div>
      {isPressedTranslated && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            Translation <MagicIcon />
          </h3>
          <div className="p-2 bg-gray-50 rounded-lg mt-1 border border-gray-200">
            {loading && !translatedText ? (
              <LoadingIcon className="size-4" />
            ) : (
              <>
                <div className="prose prose-sm prose-hr:my-1 prose-p:my-1">
                  <ReactMarkdown>{translatedText}</ReactMarkdown>
                </div>
                {isStreaming && (
                  <span className="inline-block ml-1 animate-pulse">▌</span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
