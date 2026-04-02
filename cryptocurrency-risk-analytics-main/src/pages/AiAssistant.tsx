import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generateChatResponse } from "@/lib/chatEngine";
import { useCryptoData } from "@/hooks/useCryptoData";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What does a risk score of 70 mean?",
  "What's the safest crypto for beginners?",
  "Explain volatility vs liquidity",
  "How does sentiment analysis work?",
  "How do I use this platform?",
  "What are the current market trends?",
];

export default function AiAssistant() {
  const { data: cryptos } = useCryptoData(50);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "Hello! I'm your **CryptoRisk AI** assistant. I can help with risk analysis, investment guidance, market sentiment, and explain how this platform works.\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Generate context-aware response
    const context = {
      allCoins: cryptos ?? [],
      coin: cryptos?.[0] ?? null, // Default to top coin; could be selected coin
    };

    // Simulate typing delay for natural feel
    const response = generateChatResponse(text.trim(), context);

    // Stream the response character by character for typing effect
    let accumulated = "";
    const assistantId = Date.now() + 1;

    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    const chunkSize = 3;
    for (let i = 0; i < response.length; i += chunkSize) {
      accumulated = response.slice(0, i + chunkSize);
      const current = accumulated;
      await new Promise((r) => setTimeout(r, 8));
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: current } : m))
      );
    }

    // Final complete message
    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, content: response } : m))
    );
    setIsTyping(false);
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-3.5rem)] flex flex-col max-w-[900px] mx-auto">
      <div className="mb-4 opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Ask about crypto risk, sentiment, investments, or platform features
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-[10px] text-primary font-medium">
            Context-aware • {cryptos?.length ?? 0} coins loaded
          </span>
        </div>
      </div>

      <Card className="glass-card border-border/30 flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              style={{ animation: "fade-up 0.3s ease-out" }}
            >
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary/50 rounded-xl px-4 py-3 flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crypto risk, sentiment, investing..."
              className="bg-secondary/50"
              disabled={isTyping}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
