import { memo, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface ShortcutIconProps {
  title: string;
  src?: string;
  size?: 'small' | 'large';
}

export const ShortcutIcon = memo(function ShortcutIcon({ title, src, size = 'large' }: ShortcutIconProps) {
  const [failed, setFailed] = useState(false);
  const iconSize = size === 'small' ? 'h-7 w-7' : 'h-9 w-9';

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className={`${iconSize} rounded-xl object-contain dark:bg-white dark:p-1.5 dark:shadow-sm dark:ring-1 dark:ring-black/10`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={`app-secondary-button app-accent-text flex ${iconSize} items-center justify-center rounded-2xl text-xs font-semibold`} aria-hidden="true">
      {title.trim().slice(0, 2).toUpperCase() || <ExternalLink className="h-4 w-4" />}
    </span>
  );
});
