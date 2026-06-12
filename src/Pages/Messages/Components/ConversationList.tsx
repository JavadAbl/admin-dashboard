import React from "react";
import type { Conversation } from "../../../Utils/Api/MockData/ConversationsMock";
import Input from "../../../Components/Inputs/Input";
import { SearchIcon } from "lucide-react";

interface Props {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  search: string;
  onSearchChange: (val: string) => void;
  onNewChat: () => void;
}

const ConversationList: React.FC<Props> = ({
  conversations,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  onNewChat,
}) => {
  const filtered = conversations.filter(
    (c) => c.name.includes(search) || c.lastMessage.includes(search),
  );

  return (
    <div className="w-full md:w-80 border-r border-base-300 bg-base-100 flex flex-col h-full">
      {/* Header with New Chat button */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">پیام‌ها</h2>
          <button
            className="btn btn-primary btn-sm btn-circle"
            onClick={onNewChat}
            title="گفتگوی جدید"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <Input
          type="input"
          className=" input-sm flex border-0  border-b"
          icon={SearchIcon}
        >
          <input
            type="text"
            className="  text-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Input>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-base-content/40 text-sm">
            گفتگویی یافت نشد
          </div>
        ) : (
          filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`flex items-center gap-3 p-3 mx-2 rounded-box cursor-pointer transition-colors hover:bg-base-200 ${
                selectedId === conv.id
                  ? "bg-primary/10 border-l-4 border-primary"
                  : ""
              }`}
            >
              <div
                className={`avatar ${conv.online ? "online" : "offline"} placeholder`}
              >
                <div className="w-12 rounded-full bg-neutral text-neutral-content">
                  <img
                    src={"/images/user-avatar.webp"}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm truncate">
                    {conv.name}
                  </h4>
                  <span className="text-xs text-base-content/50 whitespace-nowrap ml-1">
                    {conv.lastTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-base-content/60 truncate">
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span className="badge badge-primary badge-sm ml-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
