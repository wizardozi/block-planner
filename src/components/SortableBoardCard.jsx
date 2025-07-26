import { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BoardCard from './BoardCard';

export function SortableBoardCard({ id, task, columnId, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `board-task-${task.id}`,
    data: { nodeId: task.id, type: 'task', columnId }, // ← unified key
    activationConstraint: { delay: 400, tolerance: 8 },
  });

  /* distinguish click vs drag */
  const mouseDownAt = useRef(null);
  const onMouseDown = () => (mouseDownAt.current = Date.now());
  const onMouseUp = (e) => {
    if (Date.now() - (mouseDownAt.current || 0) < 200 && e.button === 0) {
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
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <BoardCard task={task} />
    </div>
  );
}
