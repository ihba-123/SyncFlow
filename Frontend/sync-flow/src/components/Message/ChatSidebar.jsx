import { useState } from 'react';
import { MessageCircle, MoreVertical, Plus } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ChatItem } from './ChatItems';
import { useChatStore } from '../../stores/ChatStore';

export function ChatSidebar({ selectedChatId, onSelectChat }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { chats } = useChatStore();

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex-col bg-[#111b21] border-r border-[#202d33] flex h-screen">
 
      <div className="flex items-center justify-between border-b border-[#202d33] px-3 sm:px-4 py-3 sm:py-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-[#e9edef]">Chats</h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-1.5 sm:p-2 text-[#8a9296] hover:bg-[#202d33] rounded-full transition-colors">
            <Plus size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button className="p-1.5 sm:p-2 text-[#8a9296] hover:bg-[#202d33] rounded-full transition-colors">
            <MoreVertical size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-center">
            <div>
              <MessageCircle size={32} className="mx-auto mb-2 text-[#8a9296]" />
              <p className="text-xs text-[#8a9296]">No chats found</p>
            </div>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              id={chat.id}
              name={chat.name}
              avatar={chat.avatar}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
              isActive={selectedChatId === chat.id}
              unread={chat.unread}
              onClick={onSelectChat}
            />
          ))
        )}
      </div>
    </div>
  );
}