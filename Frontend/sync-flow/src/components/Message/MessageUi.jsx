import React, { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatItem } from './ChatItems';
import { ChatSidebar } from './ChatSidebar'; // Make sure this exists
import { useMediaQuery } from '../../hooks/useMobile';
import { ChatWindow } from './ChatWindow';
export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set default chat on desktop
    if (!isMobile && !selectedChatId) {
      setSelectedChatId('1');
    }
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex h-screen bg-[#0b141a] overflow-hidden">
      {/* Desktop/Tablet Sidebar */}
      <div className="hidden md:flex md:w-[260px] lg:w-[320px] flex-col border-r border-[#202d33]">
        <ChatSidebar
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>

      {/* Mobile: Chat List - Full width when no chat selected */}
      <div className={`md:hidden ${selectedChatId ? 'hidden' : 'flex'} w-full flex-col`}>
        <ChatSidebar
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>

      {/* Mobile: Chat Window - Full width when chat selected */}
      <div
        className={`md:hidden ${selectedChatId ? 'fixed inset-0 z-50' : 'hidden'} w-full flex flex-col bg-[#0b141a]`}
      >
        {selectedChatId && (
          <ChatWindow
            chatId={selectedChatId}
            onBack={() => setSelectedChatId(null)}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Desktop/Tablet: Chat Window */}
      {selectedChatId ? (
        <div className="hidden md:flex flex-1 flex-col">
          <ChatWindow
            chatId={selectedChatId}
            onBack={undefined}
            isMobile={isMobile}
          />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-center bg-[#0b141a]">
          <div className="space-y-4">
            <div className="text-6xl">💬</div>
            <h2 className="text-2xl font-light text-[#e9edef]">
              WhatsApp Web Clone
            </h2>
            <p className="text-sm text-[#8a9296]">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}