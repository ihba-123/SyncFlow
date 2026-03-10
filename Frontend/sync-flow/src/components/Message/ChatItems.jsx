import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';

export function ChatItem({
  id = '',
  name = 'Unknown',
  avatar = '',
  lastMessage = '',
  timestamp = '',
  isActive = false,
  unread = 0,
  onClick = () => {},
}) {
  return (
    <div
      onClick={() => onClick(id)}
      className={`cursor-pointer border-b border-[#202d33] px-3 py-3 transition-colors ${
        isActive ? 'bg-[#202d33]' : 'hover:bg-[#111b21]'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar className="h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0">
          {avatar ? (
            <AvatarImage src={avatar} />
          ) : (
            <AvatarFallback className="bg-[#202d33] text-[#e9edef] text-xs sm:text-sm">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-xs sm:text-sm font-medium text-[#e9edef] truncate">
              {name}
            </h3>
            <span className="text-xs text-[#8a9296] flex-shrink-0">
              {timestamp}
            </span>
          </div>
          <p className="text-xs text-[#8a9296] truncate">{lastMessage}</p>
        </div>
        {unread ? (
          <div className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#31a24c]">
            <span className="text-xs font-medium text-white">{unread}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}