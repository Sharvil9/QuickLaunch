import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Link } from '../types';

interface WorkspaceMenuProps {
  workspace: Link;
  onClose: () => void;
  darkMode: boolean;
}

export function WorkspaceMenu({ workspace, onClose, darkMode }: WorkspaceMenuProps) {
  const subLinks = workspace.subLinks || [];

  return (
    <div className={`h-full ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
              ${darkMode ? 'text-white' : 'text-gray-700'}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <img src={workspace.icon} alt={workspace.title} className="w-6 h-6" />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {workspace.title}
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {subLinks.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center p-3 rounded-lg transition-colors
                ${darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <img src={link.icon} alt={link.title} className="w-10 h-10 mb-2" />
              <span className="text-xs text-center">{link.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}