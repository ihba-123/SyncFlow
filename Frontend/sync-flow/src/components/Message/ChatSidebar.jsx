import { useState, useRef, useEffect } from 'react';
import { MessageCircle, MoreVertical, Plus, Users, X, Check } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ChatItem } from './ChatItems';
import { useChatStore } from '../../stores/ChatStore';

export function ChatSidebar({ selectedChatId, onSelectChat }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  
  const menuRef = useRef(null);
  const { chats } = useChatStore();

  // Handle outside clicks to close the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateGroupSubmit = async () => {
    if (!newGroupName.trim()) return;

    // Matching your Django POST expected data:
    const payload = {
      name: newGroupName,
      is_group: true,
      participant_ids: [] // You'll likely add logic to select these later
    };

    try {
      console.log("Sending to Django:", payload);
      // Example: const response = await api.post('/chats/create/', payload);
      
      // Reset UI on success
      setIsCreatingGroup(false);
      setNewGroupName('');
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex-col bg-[#111b21] border-r border-[#202d33] flex h-screen relative">
      
      {/* Header */}
      <div className="flex flex-col border-b border-[#202d33] bg-[#202d33]/30">
        <div className="flex items-center justify-between px-4 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-light text-[#e9edef]">Chats</h1>
          
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full transition-all ${isMenuOpen ? 'bg-[#3b4a54] text-[#00a884]' : 'text-[#8a9296] hover:bg-[#202d33]'}`}
            >
              <Plus size={20} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} />
            </button>

            {/* Dropdown Menu - No Blur */}
            {isMenuOpen && !isCreatingGroup && (
              <div 
                ref={menuRef}
                className="absolute top-12 right-0 w-52 bg-[#233138] py-2 rounded-lg shadow-2xl border border-[#3b4a54] z-50 animate-in slide-in-from-top-2 duration-150"
              >
                <button 
                  onClick={() => setIsCreatingGroup(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#e9edef] hover:bg-[#182229] transition-colors text-sm"
                >
                  <Users size={18} className="text-[#8a9296]" />
                  New Group
                </button>
              </div>
            )}

            <button className="p-2 text-[#8a9296] hover:bg-[#202d33] rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Inline "New Group" Input Field - Appears under header when 'New Group' is clicked */}
        {isCreatingGroup && (
          <div className="px-4 pb-3 flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
            <input
              autoFocus
              type="text"
              placeholder="Enter group name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateGroupSubmit()}
              className="flex-1 bg-[#111b21] text-[#e9edef] text-sm rounded-lg px-3 py-2 border-b-2 border-[#00a884] focus:outline-none"
            />
            <button 
              onClick={handleCreateGroupSubmit}
              className="p-2 bg-[#00a884] text-[#111b21] rounded-full hover:bg-[#06cf9c]"
            >
              <Check size={16} strokeWidth={3} />
            </button>
            <button 
              onClick={() => setIsCreatingGroup(false)}
              className="p-2 text-[#8a9296] hover:bg-[#3b4a54] rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-center px-6">
            <div>
              <MessageCircle size={32} className="mx-auto mb-2 text-[#3b4a54]" />
              <p className="text-sm text-[#8a9296]">No chats found</p>
            </div>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              {...chat}
              isActive={selectedChatId === chat.id}
              onClick={onSelectChat}
            />
          ))
        )}
      </div>
    </div>
  );
}