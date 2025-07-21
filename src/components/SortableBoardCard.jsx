import { useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BoardCard from './BoardCard';

export function SortableBoardCard({ id, task, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    active,
    over,
  } = useSortable({
    id,
    activationConstraint: {
      delay: 400,
      tolerance: 8,
    },
  });

  const wasDraggingRef = useRef(false);

  const mouseDownTimeRef = useRef(null);

  const handleMouseDown = () => {
    mouseDownTimeRef.current = Date.now();
  };

  const handleMouseUp = (e) => {
    const elapsed = Date.now() - (mouseDownTimeRef.current || 0);

    // Consider it a drag if the mouse was held longer than 200ms
    if (elapsed > 200) {
      return;
    }

    if (e.button === 0) {
      onClick?.();
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <BoardCard task={task} />
    </div>
  );
}
