import { useLayoutEffect, useMemo, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Link } from '../types';
import { reorderLinkList, type DropPosition } from '../utils/reorderLinks';
import { usePointerReorder } from '../utils/usePointerReorder';
import { ShortcutIcon } from './ShortcutIcon';

interface WorkspaceMenuProps {
  workspace: Link;
  onClose: () => void;
  onSelect: (link: Link) => void;
  onReorder: (workspaceId: string, sourceId: string, targetId: string, position: DropPosition, targetCategory: string) => void;
}

const EMPTY_LINKS: Link[] = [];

export function WorkspaceMenu({ workspace, onClose, onSelect, onReorder }: WorkspaceMenuProps) {
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
  } = usePointerReorder((sourceId, targetId, position, targetCategory) => {
    onReorder(workspace.id, sourceId, targetId, position, targetCategory);
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const previousRectsRef = useRef(new Map<string, DOMRect>());
  const subLinks = workspace.subLinks ?? EMPTY_LINKS;
  const visibleLinks = useMemo(() => (
    previewDrop
      ? reorderLinkList(subLinks, previewDrop.sourceId, previewDrop.targetId, previewDrop.position, previewDrop.targetCategory)
      : subLinks
  ), [previewDrop, subLinks]);

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

  const draggedLink = draggedId ? subLinks.find((link) => link.id === draggedId) : undefined;

  return (
    <section
      className="relative"
      onPointerMove={moveReorder}
      onPointerUp={finishReorder}
      onPointerCancel={cancelReorder}
      onClickCapture={suppressClickAfterDrag}
    >
      <div className="mb-4 flex items-center gap-3">
        <button type="button" onClick={onClose} aria-label="Back to shortcuts" className="app-control-hover app-text-muted app-focus rounded-2xl p-2 transition">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 items-center gap-2.5">
          <ShortcutIcon title={workspace.title} src={workspace.icon} size="small" />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{workspace.title}</h2>
            <p className="app-text-muted text-[10px]">Hold and drag to arrange</p>
          </div>
        </div>
      </div>

      <div ref={gridRef} className="grid grid-cols-4 gap-2">
        {visibleLinks.map((link) => (
          <div
            key={link.id}
            aria-grabbed={draggedId === link.id}
            data-dragging={draggedId === link.id}
            data-shortcut-id={link.id}
            data-shortcut-category={link.category}
            title={`${link.title} — drag to rearrange`}
            onPointerDown={(event) => startReorder(event, link.id)}
            className="app-card aspect-square min-w-0 cursor-grab select-none active:cursor-grabbing"
          >
            <button
              type="button"
              onClick={() => onSelect(link)}
              className="app-focus flex h-full w-full flex-col items-center justify-center gap-2 rounded-[inherit] p-2 text-center"
            >
              <ShortcutIcon title={link.title} src={link.icon} />
              <span className="line-clamp-2 text-[11px] leading-tight app-text-muted">{link.title}</span>
            </button>
          </div>
        ))}
      </div>

      {draggedLink && ghostStyle && (
        <div ref={ghostRef} aria-hidden="true" className="app-card app-drag-ghost flex flex-col items-center justify-center gap-2 p-2 text-center" style={ghostStyle}>
          <ShortcutIcon title={draggedLink.title} src={draggedLink.icon} />
          <span className="line-clamp-2 text-[11px] leading-tight app-text-muted">{draggedLink.title}</span>
        </div>
      )}
    </section>
  );
}
