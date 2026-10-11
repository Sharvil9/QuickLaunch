import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Link } from '../types';

interface AddLinkModalProps {
  onAdd: (link: Omit<Link, 'id'>) => void;
  onClose: () => void;
  categories: string[];
}

export function AddLinkModal({ onAdd, onClose, categories }: AddLinkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    onAdd({ title: title.trim(), url: normalizedUrl, category });
  };

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="add-shortcut-title" className="app-surface w-full max-w-sm rounded-3xl border p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 id="add-shortcut-title" className="text-lg font-semibold">Add shortcut</h3>
            <p className="app-text-muted mt-1 text-xs">Save a site you open often.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="app-control-hover app-text-muted app-focus rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-medium">
            Shortcut name
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Research assistant"
              className="app-input mt-1 w-full rounded-2xl border p-2.5 text-sm"
              required
            />
          </label>
          <label className="block text-xs font-medium">
            Website URL
            <input
              type="text"
              inputMode="url"
              autoCapitalize="none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="app-input mt-1 w-full rounded-2xl border p-2.5 text-sm"
              required
            />
          </label>
          <label className="block text-xs font-medium">
            Group
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="app-input mt-1 w-full rounded-2xl border p-2.5 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="app-primary-button app-focus w-full rounded-2xl p-2.5 text-sm font-semibold transition"
          >
            Add shortcut
          </button>
        </form>
      </div>
    </div>
  );
}
