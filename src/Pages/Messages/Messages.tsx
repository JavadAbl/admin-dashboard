import { useState, useCallback } from "react";
import ConversationList from "./Components/ConversationList";
import ChatWindow from "./Components/ChatWindow";
import NewChatDialog from "./Components/NewChatDialog";
import { conversations as initialConversations } from "../../Utils/Api/MockData/ConversationsMock";
import type { Conversation } from "../../Utils/Api/MockData/ConversationsMock";
import type { User } from "../../Features/Auth/AuthTypes/UserType";
import { cn } from "../../Utils/Cn";

export default function Messages() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  // Track which users already have conversations
  const existingUserIds = conversations
    .map((c) => c.userId)
    .filter(Boolean) as string[];

  const handleStartChat = useCallback(
    (user: User) => {
      const existing = conversations.find((c) => c.userId === user.id);
      if (existing) {
        setSelectedId(existing.id);
        setSearch("");
        return;
      }

      const newConversation: Conversation = {
        id: Date.now(),
        name: user.name,
        avatar: user.avatar || user.name.charAt(0),
        online: user.isActive === "active",
        lastMessage: "",
        lastTime: "اکنون",
        unread: 0,
        messages: [],
        userId: user.id,
      };

      setConversations((prev) => [newConversation, ...prev]);
      setSelectedId(newConversation.id);
      setSearch("");
    },
    [conversations],
  );

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setSearch("");
  };

  // --- NEW: Callback to handle sending messages immutably ---
  const handleSendMessage = useCallback(
    (conversationId: number, messageText: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: Date.now(),
                  sender: "me",
                  text: messageText,
                  time: "اکنون",
                },
              ],
              lastMessage: messageText,
              lastTime: "اکنون",
            };
          }
          return c;
        }),
      );
    },
    [],
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-base-200">
      {/* Sidebar */}
      <div
        className={cn(
          "flex-col h-full w-full md:w-80",
          selectedId ? "hidden md:flex" : "flex",
        )}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
          search={search}
          onSearchChange={setSearch}
          onNewChat={() => setShowNewChat(true)}
        />
      </div>

      {/* Main chat area */}
      <div
        className={cn(
          "flex-1 flex-col h-full",
          selectedId ? "flex" : "hidden md:flex",
        )}
      >
        {selectedConversation ? (
          <>
            <button
              className="btn btn-ghost md:hidden self-start m-2"
              onClick={() => setSelectedId(null)}
            >
              ← بازگشت
            </button>

            {/* --- PASS THE CALLBACK HERE --- */}
            <ChatWindow
              conversation={selectedConversation}
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-base-content/40 p-8 text-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div>
              <p className="text-lg mb-1">یک گفتگو را انتخاب کنید</p>
              <p className="text-sm">
                یا{" "}
                <button
                  className="text-primary hover:underline font-medium"
                  onClick={() => setShowNewChat(true)}
                >
                  گفتگوی جدید
                </button>{" "}
                شروع کنید
              </p>
            </div>
          </div>
        )}
      </div>

      <NewChatDialog
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
        onStartChat={handleStartChat}
        existingUserIds={existingUserIds}
      />
    </div>
  );
}
