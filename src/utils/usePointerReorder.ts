import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, PointerEvent } from 'react';
import type { DropPosition } from './reorderLinks';

type ReorderHandler = (
  sourceId: string,
  targetId: string,
  position: DropPosition,
  targetCategory: string,
) => void;

interface DropPreview {
  sourceId: string;
  targetId: string;
  position: DropPosition;
  targetCategory: string;
}

interface DragPoint {
  left: number;
  top: number;
  width: number;
  height: number;
}

type PointerGesture = {
  pointerId: number;
  sourceId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  dragging: boolean;
};

type PointerPosition = { x: number; y: number };

function getDropPreviewAt(x: number, y: number, sourceId: string): DropPreview | null {
  const target = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-shortcut-id]');
  const targetId = target?.dataset.shortcutId;
  const targetCategory = target?.dataset.shortcutCategory;
  if (!target || !targetId || !targetCategory || targetId === sourceId) return null;

  const bounds = target.getBoundingClientRect();
  const dx = (x - bounds.left) / Math.max(bounds.width, 1) - 0.5;
  const dy = (y - bounds.top) / Math.max(bounds.height, 1) - 0.5;
  const position: DropPosition = Math.abs(dx) > Math.abs(dy)
    ? (dx >= 0 ? 'after' : 'before')
    : (dy >= 0 ? 'after' : 'before');

  return { sourceId, targetId, position, targetCategory };
}

export function usePointerReorder(onReorder: ReorderHandler, enabled = true) {
  const gestureRef = useRef<PointerGesture | null>(null);
  const previewRef = useRef<DropPreview | null>(null);
  const suppressClickRef = useRef(false);
  const ghostRef = useRef<HTMLDivElement>(null);
  const pointerPositionRef = useRef<PointerPosition>({ x: 0, y: 0 });
  const moveFrameRef = useRef<number | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [ghostBox, setGhostBox] = useState<DragPoint | null>(null);
  const [previewDrop, setPreviewDrop] = useState<DropPreview | null>(null);

  const updateGhostAndPreview = () => {
    moveFrameRef.current = null;
    const gesture = gestureRef.current;
    if (!gesture?.dragging) return;

    const { x, y } = pointerPositionRef.current;
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate3d(${x - gesture.startX}px, ${y - gesture.startY}px, 0) scale(0.96) rotate(-2deg)`;
    }

    const nextPreview = getDropPreviewAt(x, y, gesture.sourceId);
    if (!nextPreview) return;

    const previousPreview = previewRef.current;
    if (
      !previousPreview
      || previousPreview.targetId !== nextPreview.targetId
      || previousPreview.position !== nextPreview.position
      || previousPreview.targetCategory !== nextPreview.targetCategory
    ) {
      previewRef.current = nextPreview;
      setPreviewDrop(nextPreview);
    }
  };

  const scheduleMove = () => {
    if (moveFrameRef.current !== null) return;
    moveFrameRef.current = window.requestAnimationFrame(updateGhostAndPreview);
  };

  useLayoutEffect(() => {
    if (ghostBox && ghostRef.current) {
      const { x, y } = pointerPositionRef.current;
      const gesture = gestureRef.current;
      if (gesture) {
        ghostRef.current.style.transform = `translate3d(${x - gesture.startX}px, ${y - gesture.startY}px, 0) scale(0.96) rotate(-2deg)`;
      }
    }
  }, [ghostBox]);

  useLayoutEffect(() => () => {
    if (moveFrameRef.current !== null) window.cancelAnimationFrame(moveFrameRef.current);
  }, []);

  const startReorder = (event: PointerEvent<HTMLElement>, sourceId: string) => {
    if (!enabled || !event.isPrimary || event.button !== 0 || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();

    gestureRef.current = {
      pointerId: event.pointerId,
      sourceId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
      width: bounds.width,
      height: bounds.height,
      dragging: false,
    };
  };

  const moveReorder = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
    if (!gesture.dragging && distance < 6) return;

    if (!gesture.dragging) {
      gesture.dragging = true;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can be unavailable if the browser already cancelled the gesture.
      }
      setDraggedId(gesture.sourceId);
      setGhostBox({
        left: gesture.startX - gesture.offsetX,
        top: gesture.startY - gesture.offsetY,
        width: gesture.width,
        height: gesture.height,
      });
    }

    event.preventDefault();
    pointerPositionRef.current = { x: event.clientX, y: event.clientY };
    scheduleMove();
  };

  const finishReorder = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (!gesture.dragging) return;

    event.preventDefault();
    if (moveFrameRef.current !== null) {
      window.cancelAnimationFrame(moveFrameRef.current);
      moveFrameRef.current = null;
    }
    const drop = getDropPreviewAt(event.clientX, event.clientY, gesture.sourceId) ?? previewRef.current;
    if (drop) onReorder(drop.sourceId, drop.targetId, drop.position, drop.targetCategory);

    setDraggedId(null);
    setGhostBox(null);
    previewRef.current = null;
    setPreviewDrop(null);
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 350);
  };

  const cancelReorder = (event?: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (event && gesture && gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    setDraggedId(null);
    setGhostBox(null);
    if (moveFrameRef.current !== null) {
      window.cancelAnimationFrame(moveFrameRef.current);
      moveFrameRef.current = null;
    }
    previewRef.current = null;
    setPreviewDrop(null);
  };

  const suppressClickAfterDrag = (event: MouseEvent<HTMLElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const ghostStyle: CSSProperties | undefined = ghostBox ? {
    position: 'fixed',
    left: ghostBox.left,
    top: ghostBox.top,
    width: ghostBox.width,
    height: ghostBox.height,
    zIndex: 9999,
  } : undefined;

  return {
    draggedId,
    previewDrop,
    ghostRef,
    ghostStyle,
    startReorder,
    moveReorder,
    finishReorder,
    cancelReorder,
    suppressClickAfterDrag,
  };
}
