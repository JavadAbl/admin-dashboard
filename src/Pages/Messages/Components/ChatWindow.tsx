import React, { useState, useRef, useEffect } from "react";
import type { Conversation } from "../../../Utils/Api/MockData/ConversationsMock";

interface Props {
  conversation: Conversation;
}

const ChatWindow: React.FC<Props> = ({ conversation }) => {
  const [newMsg, setNewMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message or conversation change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    // In real app, push to state / API
    conversation.messages.push({
      id: Date.now(),
      sender: "me",
      text: newMsg,
      time: "اکنون",
    });
    setNewMsg("");
    // Simulate other party typing
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  // Group messages by date (simplified: all in same day)
  const showDate = true; // You can implement logic to show date separator

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-300 bg-base-200/50">
        <div
          className={`avatar ${conversation.online ? "online" : "offline"} placeholder`}
        >
          <div className="w-12 rounded-full bg-neutral text-neutral-content">
            <span className="text-xl">{conversation.avatar}</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg">{conversation.name}</h3>
          <p className="text-xs text-base-content/60">
            {conversation.online ? "آنلاین" : "آفلاین"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showDate && (
          <div className="text-center">
            <span className="badge badge-ghost text-xs">امروز</span>
          </div>
        )}
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat ${msg.sender === "me" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble max-w-[75%] whitespace-pre-wrap break-words">
              {msg.text}
            </div>
            <div className="chat-footer text-xs opacity-50 mt-1">
              {msg.time}
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200 text-base-content">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-base-300 bg-base-200/50 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="پیام خود را بنویسید..."
          className="input input-bordered flex-1 text-sm"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
