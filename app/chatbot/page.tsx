"use client";

import { Chatbot } from "@/components/custom/chatbot";

export default function ChatbotPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Chatbot</h1>
      <div className="w-full max-w-md">
        <Chatbot />
      </div>
    </div>
  );
}