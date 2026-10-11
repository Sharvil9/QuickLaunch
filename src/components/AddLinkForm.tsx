import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Link } from '../types';

interface AddLinkFormProps {
  onAdd: (link: Omit<Link, 'id'>) => void;
  categories: string[];
}

export function AddLinkForm({ onAdd, categories }: AddLinkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, url, category });
    setTitle('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Link Title"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        <Plus size={20} />
        <span>Add Link</span>
      </button>
    </form>
  );
}