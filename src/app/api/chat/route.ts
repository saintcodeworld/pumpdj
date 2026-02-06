import { NextResponse } from "next/server";

interface Message {
    id: string;
    user: string;
    text: string;
    timestamp: number;
}

// In-memory storage for chat messages (will reset on server restart)
let messages: Message[] = [
    {
        id: "1",
        user: "System",
        text: "Welcome to the chat!",
        timestamp: Date.now(),
    },
];

export async function GET() {
    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    try {
        const { user, text } = await request.json();

        if (!user || !text) {
            return NextResponse.json(
                { error: "Missing user or text" },
                { status: 400 }
            );
        }

        const newMessage: Message = {
            id: Math.random().toString(36).substring(7),
            user,
            text,
            timestamp: Date.now(),
        };

        // Keep only the last 50 messages to prevent memory growth
        messages = [...messages, newMessage].slice(-50);

        return NextResponse.json(newMessage);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
