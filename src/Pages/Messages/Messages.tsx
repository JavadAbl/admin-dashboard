import React, { useState } from "react";
import ConversationList from "./Components/ConversationList";
import ChatWindow from "./Components/ChatWindow";
import { conversations } from "../../Utils/Api/MockData/ConversationsMock";

const Messages: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-base-200">
      {/* Sidebar - hidden on mobile if a chat is open */}
      <div
        className={`${
          selectedId && "hidden md:flex"
        } md:flex flex-col h-full w-full md:w-80`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setSearch(""); // clear search on select
          }}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {/* Main chat area */}
      <div
        className={`flex-1 flex-col h-full ${
          selectedId ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Mobile back button */}
            <button
              className="btn btn-ghost md:hidden self-start m-2"
              onClick={() => setSelectedId(null)}
            >
              ← بازگشت
            </button>
            <ChatWindow conversation={selectedConversation} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-base-content/40 text-lg p-8 text-center">
            یک گفتگو را انتخاب کنید یا پیام جدیدی شروع کنید
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
