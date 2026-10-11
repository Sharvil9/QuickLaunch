import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import type { Link } from '../types';
import { reorderLinkList, type DropPosition } from '../utils/reorderLinks';
import { usePointerReorder } from '../utils/usePointerReorder';
import { ShortcutIcon } from './ShortcutIcon';

interface LinkGridProps {
  links: Link[];
  onDelete: (id: string) => void;
  onClick: (link: Link) => void;
  onReorder: (sourceId: string, targetId: string, position: DropPosition, targetCategory: string) => void;
  canReorder: boolean;
}

export const LinkGrid = memo(function LinkGrid({ links, onDelete, onClick, onReorder, canReorder }: LinkGridProps) {
  const {
    draggedId,
    previewDrop,
    ghostStyle,
    ghostRef,
    startReorder,
    moveReorder,
    finishReorder,
    cancelReorder,
    suppressClickAfterDrag,
  } = usePointerReorder(onReorder, canReorder);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousRectsRef = useRef(new Map<string, DOMRect>());
  const visibleLinks = useMemo(() => (
    previewDrop
      ? reorderLinkList(links, previewDrop.sourceId, previewDrop.targetId, previewDrop.position, previewDrop.targetCategory)
      : links
  ), [links, previewDrop]);

  useLayoutEffect(() => {
    const nodes = gridRef.current?.querySelectorAll<HTMLElement>('[data-shortcut-id]') ?? [];
    const previousRects = previousRectsRef.current;
    const nextRects = new Map<string, DOMRect>();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    nodes.forEach((node) => {
      const id = node.dataset.shortcutId;
      if (!id) return;
      const nextRect = node.getBoundingClientRect();
      const previousRect = previousRects.get(id);
      if (previousRect) {
        const dx = previousRect.left - nextRect.left;
        const dy = previousRect.top - nextRect.top;
        if (!reduceMotion && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
          node.getAnimations().forEach((animation) => animation.cancel());
          node.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
            { duration: 210, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
          );
        }
      }
      nextRects.set(id, nextRect);
    });

    previousRectsRef.current = nextRects;
  }, [visibleLinks]);

  const groupedLinks = visibleLinks.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, Link[]>);

  const categoryOrder = ['AI Applications', 'Productivity', 'Development', 'Social Media', 'Entertainment'];
  const sortedCategories = Object.entries(groupedLinks).sort(([first], [second]) => {
    const firstIndex = categoryOrder.indexOf(first);
    const secondIndex = categoryOrder.indexOf(second);
    return (firstIndex === -1 ? categoryOrder.length : firstIndex) - (secondIndex === -1 ? categoryOrder.length : secondIndex);
  });

  if (sortedCategories.length === 0) {
    return <p className="app-surface app-text-muted rounded-[26px] border p-6 text-center text-sm">No shortcuts found. Try another search or add a link.</p>;
  }

  const draggedLink = draggedId ? links.find((link) => link.id === draggedId) : undefined;

  return (
    <div
      ref={gridRef}
      className="relative space-y-5"
      onPointerMove={moveReorder}
      onPointerUp={finishReorder}
      onPointerCancel={cancelReorder}
      onClickCapture={suppressClickAfterDrag}
    >
      {sortedCategories.map(([category, categoryLinks]) => (
        <section key={category} aria-label={category}>
          <h2 className="app-eyebrow mb-2.5">{category}</h2>
          <div className="grid grid-cols-4 gap-2">
            {categoryLinks.map((link) => (
              <div
                key={link.id}
                aria-grabbed={draggedId === link.id}
                data-dragging={draggedId === link.id}
                data-shortcut-id={link.id}
                data-shortcut-category={link.category}
                title={canReorder ? `${link.title} — drag to rearrange` : link.title}
                onPointerDown={(event) => startReorder(event, link.id)}
                className={`app-card group relative aspect-square min-w-0 select-none ${canReorder ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => onClick(link)}
                  title={link.title}
                  className="app-focus flex h-full w-full flex-col items-center justify-center gap-2 rounded-[inherit] px-1.5 py-2 text-center"
                >
                  <ShortcutIcon title={link.title} src={link.icon} />
                  <span className="line-clamp-2 text-[11px] leading-tight app-text-muted">{link.title}</span>
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(link.id);
                  }}
                  aria-label={`Remove ${link.title}`}
                  title={`Remove ${link.title}`}
                  className="app-surface app-text-muted app-focus absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {draggedLink && ghostStyle && (
        <div ref={ghostRef} aria-hidden="true" className="app-card app-drag-ghost flex flex-col items-center justify-center gap-2 px-1.5 py-2 text-center" style={ghostStyle}>
          <ShortcutIcon title={draggedLink.title} src={draggedLink.icon} />
          <span className="line-clamp-2 text-[11px] leading-tight app-text-muted">{draggedLink.title}</span>
        </div>
      )}
    </div>
  );
});
