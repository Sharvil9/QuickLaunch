import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import type { LaunchGroup, Link } from '../types';
import { ShortcutIcon } from './ShortcutIcon';

interface LaunchGroupModalProps {
  links: Link[];
  group?: LaunchGroup;
  onSave: (title: string, linkIds: string[]) => void;
  onClose: () => void;
}

export function LaunchGroupModal({ links, group, onSave, onClose }: LaunchGroupModalProps) {
  const [title, setTitle] = useState(group?.title ?? '');
  const [selectedIds, setSelectedIds] = useState<string[]>(group?.linkIds ?? []);

  const toggleLink = (id: string) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || selectedIds.length === 0) return;
    onSave(cleanTitle, selectedIds);
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="launch-group-title" className="app-surface flex h-[560px] max-h-[calc(100%-2rem)] w-full max-w-sm flex-col rounded-3xl border p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 id="launch-group-title" className="text-lg font-semibold">{group ? 'Edit launch set' : 'Create launch set'}</h2>
            <p className="app-text-muted mt-1 text-xs">Choose sites to open together in background tabs.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="app-control-hover app-text-muted app-focus rounded-full p-2 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <label className="block shrink-0 text-xs font-medium">
            Set name
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Start my workday"
              maxLength={40}
              className="app-input mt-1 w-full rounded-2xl border p-2.5 text-sm"
              required
            />
          </label>

          <fieldset className="min-h-0 flex-1 overflow-y-auto">
            <legend className="app-text-muted mb-2 text-xs font-medium">Sites ({selectedIds.length} selected)</legend>
            <div className="space-y-1">
              {links.map((link) => (
                <label key={link.id} className="app-control-hover flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(link.id)}
                    onChange={() => toggleLink(link.id)}
                    className="app-checkbox h-4 w-4 rounded"
                  />
                  <ShortcutIcon title={link.title} src={link.icon} size="small" />
                  <span className="min-w-0 flex-1 truncate">{link.title}</span>
                  <span className="app-text-muted truncate text-[10px]">{link.category}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!title.trim() || selectedIds.length === 0}
            className="app-primary-button app-focus w-full shrink-0 rounded-2xl p-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {group ? 'Save changes' : 'Create launch set'}
          </button>
        </form>
      </div>
    </div>
  );
}
