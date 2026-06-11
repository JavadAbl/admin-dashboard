import React from "react";
import type { Conversation } from "../../../Utils/Api/MockData/ConversationsMock";

interface Props {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

const ConversationList: React.FC<Props> = ({
  conversations,
  selectedId,
  onSelect,
  search,
  onSearchChange,
}) => {
  const filtered = conversations.filter(
    (c) => c.name.includes(search) || c.lastMessage.includes(search),
  );

  return (
    <div className="w-full md:w-80 border-r border-base-300 bg-base-100 flex flex-col h-full">
      {/* Search */}
      <div className="p-4">
        <div className="input-group">
          <input
            type="text"
            placeholder="جستجوی پیام‌ها..."
            className="input input-bordered w-full text-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="btn btn-square btn-ghost">
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
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((conv) => (
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
                <span className="text-xl">{conv.avatar}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-sm truncate">{conv.name}</h4>
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
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
