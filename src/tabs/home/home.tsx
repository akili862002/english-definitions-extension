import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { LoadingIcon, MagicIcon, SettingsIcon } from "./home.icons";
import { useStorage } from "../../hooks/use-storage";
import { useAppContext } from "../../App";
import { STORAGE_OPENAI_API_KEY } from "../../const/keys";

const defaultApiKey = import.meta.env.VITE_OPENAI_API_KEY || "";

export const Home = () => {
  const { setActiveTab } = useAppContext();

  const [text, setText] = useState("");
  const [isPressedTranslated, setIsPressedTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiKey] = useStorage<string>(STORAGE_OPENAI_API_KEY, defaultApiKey);

  const loadOpenAI = async () => {
    let key = apiKey;
    if (!key) {
      const result = await chrome.storage.sync.get([STORAGE_OPENAI_API_KEY]);
      key = result[STORAGE_OPENAI_API_KEY] || "";
    }

    if (key) {
      const openai = createOpenAI({
        apiKey: key,
      });
      return openai;
    }
    return null;
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

  const listen = (word: string) => {
    if (!word) return;

    // Stop any currently playing audio
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower than default for better clarity

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      console.error("SpeechSynthesis error");
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

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
        prompt: `You are an English dictionary assistant. Define the following word clearly and comprehensively.
For the definition, please include:
- Pronunciation guide (IPA and simplified)
- All relevant parts of speech and their meanings
- Simple example sentences for each meaning
- Common phrases or idioms using this word (if applicable)
- Synonyms and antonyms (if applicable)

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
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          English Definition
        </h2>
        <button
          onClick={() => setActiveTab("settings")}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          title="Settings"
        >
          <SettingsIcon />
        </button>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-gray-700">Original Text</h3>
        <div className="flex gap-1 items-center mt-1">
          <input
            type="text"
            autoFocus
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

      {!apiKey && (
        <div className="mt-4">
          <p className="text-sm text-red-600">
            Please set your OpenAI API key in the settings.
          </p>
        </div>
      )}

      {isPressedTranslated && (
        <div className="mt-4">
          <div className="flex items-center gap-1 justify-between">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent flex items-center gap-1">
              Translation{" "}
              <MagicIcon className="text-purple-600 animate-pulse size-6" />
            </h3>
            <button
              type="button"
              className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              onClick={() => listen(text)}
              disabled={isPlaying || !text}
            >
              {isPlaying ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Playing...
                </>
              ) : (
                "Listen"
              )}
            </button>
          </div>
          <div className="mt-2">
            {loading && !translatedText ? (
              <LoadingIcon className="size-4" />
            ) : (
              <>
                <div className="prose prose-sm prose-hr:my-1 prose-p:my-0 prose-li:my-0.5 prose-ul:my-0.5 prose-h3:mt-4">
                  <ReactMarkdown>{translatedText}</ReactMarkdown>
                </div>
                {isStreaming && (
                  <span className="inline-block ml-1 animate-pulse">|</span>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
