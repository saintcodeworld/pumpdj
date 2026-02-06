"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
    id: string;
    username: string;
    text: string;
    created_at: string;
}

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [username, setUsername] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem("chat_username");
        if (stored) {
            setUsername(stored);
        } else {
            const newName = `User${Math.floor(1000 + Math.random() * 9000)}`;
            localStorage.setItem("chat_username", newName);
            setUsername(newName);
        }
    }, []);

    const fetchMessages = useCallback(async () => {
        const { data } = await supabase
            .from("chat_messages")
            .select("*")
            .order("created_at", { ascending: true })
            .limit(50);

        if (data) setMessages(data);
    }, []);

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel("chat_messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "chat_messages" },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !username) return;

        const textToSend = inputText;
        setInputText("");

        await supabase
            .from("chat_messages")
            .insert({ username, text: textToSend });
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
                                    @{msg.username}
                                </span>
                                <span className="text-[10px] text-gray-600">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
