import { Check, CheckCheck } from 'lucide-react';

export function MessageBubble({
  text,
  timestamp,
  isOutgoing,
  showTail = false,
  isRead = false,
}) {
  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`flex max-w-[80%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[50%] items-end gap-1 ${
          isOutgoing ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`rounded-lg px-3 py-2 ${
            isOutgoing
              ? 'rounded-br-none bg-[#005c4b] text-[#e9edef]'
              : 'rounded-bl-none bg-[#202d33] text-[#e9edef]'
          } ${showTail ? (isOutgoing ? 'rounded-br-none' : 'rounded-bl-none') : ''}`}
        >
          <p className="break-words text-sm">{text}</p>
          <div className="mt-1 flex items-center justify-end gap-1">
            <span className="text-xs text-[#8a9296]">{timestamp}</span>
            {isOutgoing && (
              <>
                {isRead ? (
                  <CheckCheck size={14} className="text-[#31a24c]" />
                ) : (
                  <Check size={14} className="text-[#8a9296]" />
                )}
              </>
            )}
          </div>
        </div>
        {showTail && (
          <div
            className={`h-2 w-2 ${isOutgoing ? 'bg-[#005c4b]' : 'bg-[#202d33]'}`}
            style={{
              clipPath: isOutgoing
                ? 'polygon(0 0, 100% 100%, 100% 0)'
                : 'polygon(0 100%, 100% 0, 0 0)',
            }}
          />
        )}
      </div>
    </div>
  );
}