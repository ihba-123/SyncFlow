import { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../../stores/ChatStore';

export function ChatWindow({ chatId, onBack, isMobile = false }) {
  const scrollRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);
  const { chats, messages, addMessage } = useChatStore();

  const currentChat = chatId ? chats.find((c) => c.id === chatId) : null;
  const chatMessages = chatId ? messages[chatId] || [] : [];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    shouldStickToBottomRef.current = distanceFromBottom <= 48;
  };

  const handleWheel = (event) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const hasScrollableContent = container.scrollHeight > container.clientHeight;
    if (!hasScrollableContent) return;

    // Keep wheel scrolling local to the message pane.
    event.preventDefault();
    event.stopPropagation();
    container.scrollTop += event.deltaY;
  };

  // Auto scroll only when user is already near bottom.
  useEffect(() => {
    if (scrollRef.current && shouldStickToBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (!currentChat) {
    return (
      <div className="hidden md:flex h-full min-h-0 flex-col items-center justify-center bg-slate-100 text-center dark:bg-[#0b141a]">
        <div className="space-y-4">
          <div className="text-6xl">💬</div>
          <h2 className="text-2xl font-light text-slate-800 dark:text-[#e9edef]">
            WhatsApp Web Clone
          </h2>
          <p className="text-sm text-slate-500 dark:text-[#8a9296]">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
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
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="relative flex min-h-0 flex-1 touch-pan-y flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-2 py-3 sm:px-4 sm:py-4"
        style={{
          backgroundImage: 'url(/doodle-pattern.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-white/35 dark:bg-black/35" />

        {/* Messages */}
        <div className="relative z-10 space-y-1">
          {chatMessages.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-center">
              <div>
                <div className="text-4xl mb-2">👋</div>
                <p className="text-sm text-slate-600 dark:text-[#8a9296]">
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