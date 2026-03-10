import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
} from 'lucide-react';

export function ChatHeader({
  name = 'Unknown',
  avatar = '',
  status = '',
  onBack,
  isMobile = false,
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#202d33]  bg-[#202d33]/30 px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-md backdrop-brightness-110 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="flex-shrink-0 text-[#8a9296] hover:text-[#e9edef] transition-colors"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
        )}
        <Avatar className="h-8 sm:h-10 w-8 sm:w-10 flex-shrink-0">
          {avatar ? (
            <AvatarImage src={avatar} />
          ) : (
            <AvatarFallback className="bg-[#111b21] text-[#e9edef] text-xs sm:text-sm">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm font-medium text-[#e9edef] truncate">
            {name}
          </h2>
          <p className="text-xs text-[#8a9296]">{status}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button className="hidden sm:inline-flex p-1.5 sm:p-2 text-[#8a9296] hover:bg-[#111b21] rounded-full transition-colors">
          <Phone size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button className="hidden sm:inline-flex p-1.5 sm:p-2 text-[#8a9296] hover:bg-[#111b21] rounded-full transition-colors">
          <Video size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button className="hidden md:inline-flex p-1.5 sm:p-2 text-[#8a9296] hover:bg-[#111b21] rounded-full transition-colors">
          <Search size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button className="p-1.5 sm:p-2 text-[#8a9296] hover:bg-[#111b21] rounded-full transition-colors">
          <MoreVertical size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}