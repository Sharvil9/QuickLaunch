import type { RefObject } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
  inputRef: RefObject<HTMLInputElement>;
}

export function SearchBar({ onSearch, value, inputRef }: SearchBarProps) {
  return (
    <div className="relative">
      <Search aria-hidden="true" className="app-text-muted absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
      <input
        ref={inputRef}
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search shortcuts, apps, and sites"
        aria-label="Search shortcuts, apps, and sites"
        autoComplete="off"
        className="app-input w-full rounded-2xl border py-3 pl-10 pr-14 text-sm transition"
      />
      <span className="app-surface-soft app-text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-1.5 py-1 text-[10px]">
        ⌘ K
      </span>
    </div>
  );
}
