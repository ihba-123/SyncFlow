import { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../../stores/ChatStore';

export function ChatWindow({ chatId, onBack, isMobile = false }) {
  const scrollRef = useRef(null);
  const { chats, messages, addMessage } = useChatStore();

  const currentChat = chatId ? chats.find((c) => c.id === chatId) : null;
  const chatMessages = chatId ? messages[chatId] || [] : [];

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (!currentChat) {
    return (
      <div className="hidden md:flex h-screen flex-col items-center justify-center bg-[#0b141a] text-center">
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
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <ChatHeader
        name={currentChat.name}
        avatar={currentChat.avatar}
        status="Active now"
        onBack={onBack}
        isMobile={isMobile}
      />

      {/* Messages Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 sm:py-4 flex flex-col relative"
style={{
  backgroundImage: 'url(/doodle-pattern.png)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#ffff',
}}
      >
        {/* Dark Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        />

        {/* Messages */}
        <div className="relative z-10 space-y-1">
          {chatMessages.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-center">
              <div>
                <div className="text-4xl mb-2">👋</div>
                <p className="text-sm text-[#8a9296]">
                  No messages yet. Start the conversation!
                </p>
              </div>
            </div>
          ) : (
            chatMessages.map((msg, idx) => {
              const prevMsg = idx > 0 ? chatMessages[idx - 1] : null;
              const showTail = !prevMsg || prevMsg.isOutgoing !== msg.isOutgoing;

              return (
                <MessageBubble
                  key={msg.id}
                  id={msg.id}
                  text={msg.text}
                  timestamp={msg.timestamp}
                  isOutgoing={msg.isOutgoing}
                  showTail={showTail}
                  isRead={msg.isRead}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Input Area */}
      <MessageInput
        onSendMessage={(text) =>
          addMessage(chatId, {
            text,
            isOutgoing: true,
            isRead: true,
          })
        }
      />
    </div>
  );
}