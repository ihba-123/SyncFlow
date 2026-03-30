import { useState, useRef } from 'react';
import { Paperclip, Mic, Smile, Send, X } from 'lucide-react';

export function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [showEmojiPreview, setShowEmojiPreview] = useState(false);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😍', '🤔'];

  return (
    <div className="sticky bottom-0 z-10 border-t border-[#202d33] bg-[#0b141a]/30 backdrop-blur-md px-4 py-3 shadow-sm">
      <div className="flex items-end gap-2 sm:gap-3">
        {/* Attach Button */}
        <button className="hidden sm:flex flex-shrink-0 p-2 text-[#8a9296] hover:text-[#e9edef] rounded-full hover:bg-[#202d33] transition-all">
          <Paperclip size={20} />
        </button>

        {/* Input Field */}
        <div className="flex-1 bg-[#202d33] rounded-2xl px-3 sm:px-4 py-2 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 bg-transparent text-sm text-[#e9edef] placeholder-[#8a9296] outline-none"
          />
          <button
            onClick={() => setShowEmojiPreview(!showEmojiPreview)}
            className="hidden sm:flex flex-shrink-0 p-1 text-[#8a9296] hover:text-[#e9edef] transition-colors"
          >
            <Smile size={18} />
          </button>
        </div>

        {/* Mic / Send Button */}
        {message.trim() ? (
          <button
            onClick={handleSend}
            className="flex-shrink-0 p-2 bg-[#005c4b] text-white rounded-full hover:bg-[#00704d] transition-colors"
          >
            <Send size={20} />
          </button>
        ) : (
          <button className="flex-shrink-0 p-2 text-[#8a9296] hover:text-[#e9edef] rounded-full hover:bg-[#202d33] transition-all">
            <Mic size={20} />
          </button>
        )}
      </div>

      {/* Emoji Picker Preview */}
      {showEmojiPreview && (
        <div className="mt-3 bg-[#202d33] rounded-lg p-3 flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPreview(false)}
            className="ml-auto text-[#8a9296] hover:text-[#e9edef]"
          >
            <X size={18} />
          </button>
          <div className="flex gap-2 flex-wrap">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setMessage(message + emoji);
                  inputRef.current?.focus();
                }}
                className="text-xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}