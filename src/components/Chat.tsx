"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";

interface Message {
    id: string;
    user: string;
    text: string;
    timestamp: number;
}

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    // Assign a persistent random username for the session
    const [username, setUsername] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Client-side only username generation to avoid hydration mismatch
        const stored = localStorage.getItem("chat_username");
        if (stored) {
            setUsername(stored);
        } else {
            const newName = `User${Math.floor(1000 + Math.random() * 9000)}`;
            localStorage.setItem("chat_username", newName);
            setUsername(newName);
        }
    }, []);

    useEffect(() => {
        // Poll for messages
        const fetchMessages = async () => {
            try {
                const res = await fetch("/api/chat");
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch chat", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 1000); // Poll every second for better responsiveness
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !username) return;

        const tempMsg = {
            id: "temp-" + Date.now(),
            user: username,
            text: inputText,
            timestamp: Date.now()
        };

        // Optimistic update
        setMessages(prev => [...prev, tempMsg]);
        const textToSend = inputText;
        setInputText("");

        try {
            await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: username, text: textToSend }),
            });
            // The poll will sync the real ID later
        } catch (error) {
            console.error("Failed to send message", error);
            // Revert if needed, but for simple chat we can ignore
        }
    };

    return (
        <div className="flex-1 bg-[#111] border border-[#333] p-4 rounded-lg overflow-hidden flex flex-col h-full min-h-[300px]">
            <h2 className="text-[#00ff00] mb-2 flex items-center gap-2 border-b border-[#333] pb-2 font-bold tracking-wider">
                <MessageSquare size={16} /> LIVE CHAT
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 text-xs mb-3 pr-2 scrollbar-thin scrollbar-thumb-[#00ff00] scrollbar-track-[#111]" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="text-gray-600 text-center mt-10 italic">Start the convo...</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex gap-2 items-baseline">
                                <span className="text-[#00ff00] font-bold whitespace-nowrap shadow-[#00ff00] drop-shadow-[0_0_2px_rgba(0,255,0,0.5)]">
                                    @{msg.user}
                                </span>
                                <span className="text-[10px] text-gray-600">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <span className="text-gray-300 pl-1 break-words leading-relaxed">{msg.text}</span>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#333] pt-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Chat as @${username}...`}
                    className="flex-1 bg-[#050505] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] transition-all placeholder:text-gray-700"
                />
                <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-[#00ff00] text-black p-2 rounded hover:bg-[#00cc00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};
