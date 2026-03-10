'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export function SearchBar({ onSearch }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-3 py-2">
      <div
        className={`flex items-center gap-2 rounded-lg bg-[#202d33] px-3 py-2 transition-all ${
          isFocused ? 'ring-2 ring-[#005c4b] bg-[#2a3f47]' : ''
        }`}
      >
        <Search size={18} className="text-[#8a9296]" />
        <input
          type="text"
          placeholder="Search or start new chat"
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-sm text-[#e9edef] placeholder-[#8a9296] outline-none"
        />
      </div>
    </div>
  );
}