import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Link } from '../types';

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  return (
    <div className="group relative flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-3 flex-1"
      >
        {link.icon ? (
          <img src={link.icon} alt={link.title} className="w-6 h-6" />
        ) : (
          <ExternalLink className="w-6 h-6 text-gray-500" />
        )}
        <span className="text-gray-700 dark:text-gray-200">{link.title}</span>
      </a>
      <button
        onClick={() => onDelete(link.id)}
        className="opacity-0 group-hover:opacity-100 absolute right-2 top-2 text-red-500 hover:text-red-600"
      >
        ×
      </button>
    </div>
  );
}