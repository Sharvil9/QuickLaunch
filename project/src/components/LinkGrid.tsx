import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Link } from '../types';

interface LinkGridProps {
  links: Link[];
  onDelete: (id: string) => void;
  onClick: (link: Link) => void;
  darkMode: boolean;
}

export function LinkGrid({ links, onDelete, onClick, darkMode }: LinkGridProps) {
  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, Link[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
        <div key={category}>
          <h2 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {category}
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {categoryLinks.map(link => (
              <div
                key={link.id}
                onClick={() => onClick(link)}
                className={`group relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg transition-all cursor-pointer
                  ${darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-[#d7d7d7] hover:bg-gray-300'
                  }`}
              >
                {link.icon ? (
                  <img src={link.icon} alt={link.title} className="w-8 h-8 object-contain" />
                ) : (
                  <ExternalLink className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
                <span className={`text-xs text-center line-clamp-2 mt-2 
                  ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {link.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(link.id);
                  }}
                  className={`opacity-0 group-hover:opacity-100 absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-600 rounded-full shadow-sm
                    ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}