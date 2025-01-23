import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  darkMode: boolean;
}

export function SearchBar({ onSearch, darkMode }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search links..."
        className={`w-full pl-8 pr-4 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${darkMode 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
          } border`}
      />
    </div>
  );
}