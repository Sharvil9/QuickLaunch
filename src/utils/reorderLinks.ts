import type { Link } from '../types';

export type DropPosition = 'before' | 'after';

export function reorderLinkList(
  links: Link[],
  sourceId: string,
  targetId: string,
  position: DropPosition = 'before',
  targetCategory?: string,
): Link[] {
  if (sourceId === targetId) return links;

  const sourceIndex = links.findIndex((link) => link.id === sourceId);
  const targetIndex = links.findIndex((link) => link.id === targetId);
  if (sourceIndex === -1 || targetIndex === -1) return links;

  const reordered = [...links];
  const [source] = reordered.splice(sourceIndex, 1);
  const movedLink = targetCategory && source.category !== targetCategory
    ? { ...source, category: targetCategory }
    : source;
  const adjustedTargetIndex = reordered.findIndex((link) => link.id === targetId);
  const insertAt = adjustedTargetIndex + (position === 'after' ? 1 : 0);
  reordered.splice(insertAt, 0, movedLink);
  return reordered;
}
