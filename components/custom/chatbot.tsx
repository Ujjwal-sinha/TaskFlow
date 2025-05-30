"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, MessageSquare, X, Loader2, User, Bot, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const BOT_NAME = "Freelance AI";
const USER_NAME = "You";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your freelance guide. How can I help you today?', timestamp: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === '') return;

    setError(null);
    const userMessage: Message = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response, timestamp: new Date().toLocaleTimeString() };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.', timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleNewChat = () => {
    setMessages([{ role: 'assistant', content: 'Hello! I am your freelance guide. How can I help you today?', timestamp: new Date().toLocaleTimeString() }]);
    setInput('');
    setError(null);
    setIsLoading(false);
  };

  return (
    <TooltipProvider>
      <>
        {/* Chatbot Toggle Button */}
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-apple-blue hover:bg-apple-blue/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
          </Button>
        </motion.div>

        {/* Chatbot Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 120, damping: 17 }}
              className="fixed bottom-20 right-4 z-50 w-80 h-[400px] bg-background border rounded-lg shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-card rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-apple-blue" /> {BOT_NAME}
                </h3>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleNewChat} aria-label="New Chat">
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New Chat</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close Chatbot">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 space-y-6 bg-secondary/10">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src="/placeholder-logo.svg" alt={BOT_NAME} />
                        <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-apple-blue text-white rounded-br-none' : 'bg-card text-foreground rounded-bl-none'}`}
                    >
                      <p className="font-medium text-sm mb-1">
                        {msg.role === 'user' ? USER_NAME : BOT_NAME}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                    </div>
                    {msg.role === 'user' && (
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src="/placeholder-user.jpg" alt={USER_NAME} />
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src="/placeholder-logo.svg" alt={BOT_NAME} />
                      <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[70%] p-3 rounded-xl shadow-sm bg-card text-foreground rounded-bl-none animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md border border-red-200">
                    Error: {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t bg-card flex items-center space-x-2 rounded-b-lg">
                <Textarea
                  placeholder="Type your message..."
                  className="flex-1 resize-none pr-10 min-h-[40px] max-h-[120px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isLoading || input.trim() === ''}
                  className="shrink-0"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </TooltipProvider>
  );
}
  
